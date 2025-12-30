# HOF Specialization for Typed Collections

## Status: Deferred

## Overview

Higher-order functions (HOFs) like `map`, `filter`, `reduce`, `find`, `every`, `some`, and `sort` currently use generic `Any` types and runtime dispatch. Specializing these for typed collections would provide significant performance improvements by:

1. **Eliminating boxing overhead** - Work directly with native types (i64, f64, etc.) instead of CrespiValue
2. **Enabling LLVM optimizations** - Type-specific implementations allow vectorization and other compiler optimizations
3. **Reducing runtime type checks** - Type is known at compile time

## Current Implementation

### Type Signatures (Generic)

Location: `crates/crespi-core/src/builtins/definitions.rs:771-839`

All HOFs currently have signatures like:
```rust
BuiltinDef {
    id: Builtin::Map,
    name: "map",
    signature: Some(BuiltinSignature::new(
        vec![
            ParamDef::required("collection", BuiltinType::Any),
            ParamDef::required("func", BuiltinType::Any),
        ],
        BuiltinType::Any,
    )),
    is_hof_stub: true,
    is_primitive_method: true,
}
```

### Runtime Implementation (Interpreter Only)

Location: `crates/crespi-core/src/interpreter/eval.rs:3093-3350`

```rust
fn try_collection_hof(
    &mut self,
    name: &str,
    args: Vec<Value>,
    span: Span,
) -> RuntimeResult<Option<Value>>
```

**Key characteristics:**
- Runtime type checking - collections must be `List` or `Tuple` at runtime
- Dynamic dispatch - handler selected at runtime in `try_collection_hof()`
- Generic callback handling - works with any callable type
- **No LLVM implementation** - HOFs always fall back to interpreter

Example current implementation for `map`:
```rust
"map" => {
    let arr = match &args[0] {
        Value::List(arr) => arr.borrow().elements.clone(),
        Value::Tuple(items) => items.to_vec(),
        other => return Err(...),
    };
    let callback = args[1].clone();
    let mut result = Vec::with_capacity(arr.len());
    for item in arr {
        let mapped = self.call(callback.clone(), vec![item], span)?;
        result.push(mapped);
    }
    Ok(Some(Value::List(Rc::new(RefCell::new(ListValue::new(result))))))
}
```

## Proposed Implementation

### Phase 1: Native Runtime Implementations

Add specialized native implementations for each HOF × list type combination.

**Files to modify:**
- `crates/crespi-runtime/src/builtins.rs`

**Example for `map` on `IntList`:**
```rust
#[unsafe(no_mangle)]
pub unsafe extern "C" fn crespi_rt_int_list_map(
    gc_ctx: *mut GcContext,
    list_value: CrespiValue,
    callback: CrespiValue,  // Function pointer
) -> CrespiValue {
    if !list_value.is_object() {
        return CrespiValue::NULL;
    }

    let obj_ptr = list_value.as_object();
    if let HeapObject::IntList(ref list) = *obj_ptr {
        let mut result = Vec::with_capacity(list.elements.len());
        for &elem in &list.elements {
            // Call callback with unboxed i64
            let elem_boxed = CrespiValue::from_int(elem);
            let mapped = crespi_rt_call_function(callback, &[elem_boxed], 1);
            // Extract and store result as i64
            if let Some(value) = mapped.as_int() {
                result.push(value);
            }
        }
        return (*gc_ctx).alloc_int_list(result);
    }

    CrespiValue::NULL
}
```

**Scope:**
- 7 HOFs (map, filter, reduce, find, every, some, sort)
- 12 list types (Int, Int32, Int16, Int8, UInt, UInt32, UInt16, UInt8, Double, Float32, Bool, Any)
- **Total: ~84 specialized functions**

**Code generation strategy:**
Use macros similar to `impl_dict_ops!` to generate the repetitive implementations:

```rust
macro_rules! impl_hof_for_list_type {
    ($type_name:ident, $heap_variant:ident, $value_type:ty, $crespi_type:expr) => {
        paste::paste! {
            #[unsafe(no_mangle)]
            pub unsafe extern "C" fn [<crespi_rt_ $type_name _list_map>](
                gc_ctx: *mut GcContext,
                list_value: CrespiValue,
                callback: CrespiValue,
            ) -> CrespiValue {
                // Implementation here
            }

            // Similar for filter, reduce, find, every, some, sort
        }
    };
}
```

### Phase 2: LLVM Codegen Integration

Add HOF detection and specialized codegen in the LLVM backend.

**Files to modify:**
- `crates/crespi-llvm/src/compiler.rs`
- `crates/crespi-llvm/src/builtins.rs`

**Implementation approach:**

1. **Detect HOF calls** in method call lowering
2. **Extract list type** from the receiver
3. **Generate specialized call** based on ListKind

```rust
// In lower_method_call or similar
fn lower_hof_call(
    &mut self,
    receiver: &HirExpr,
    method_name: &str,
    args: &[HirExpr],
) -> CodegenResult<Option<ArrayValue<'ctx>>> {
    let list_kind = CollectionResolver::list_kind(receiver.ty.as_ref());

    if matches!(list_kind, ListKind::Any) {
        return Ok(None); // Fall back to interpreter
    }

    match method_name {
        "map" => {
            let symbol = hof_symbol("map", list_kind);
            let list_value = self.lower_expr(receiver)?;
            let callback = self.lower_expr(&args[0])?;

            let params = vec![
                self.gc_ptr_type().into(),
                self.crespi_value_basic_type().into(),
                self.crespi_value_basic_type().into(),
            ];
            let func = self.runtime_function(symbol, &params, true);

            let call = self.builder.build_call(
                func,
                &[self.gc_ctx.into(), list_value.into(), callback.into()],
                "map_specialized",
            )?;

            Ok(Some(call.try_as_basic_value().basic()?.into_array_value()))
        }
        "filter" => { /* similar */ }
        // ... other HOFs
        _ => Ok(None),
    }
}
```

**Symbol resolution helper:**
```rust
fn hof_symbol(hof_name: &str, list_kind: ListKind) -> &'static str {
    match (hof_name, list_kind) {
        ("map", ListKind::Int) => "crespi_rt_int_list_map",
        ("map", ListKind::Float) => "crespi_rt_float_list_map",
        ("filter", ListKind::Int) => "crespi_rt_int_list_filter",
        // ... etc
    }
}
```

### Phase 3: Type System Updates (Optional)

Consider updating HOF signatures to preserve type information:

```rust
// Current:
map: (List[T], T -> U) -> List[Any]

// Proposed:
map: (List[T], T -> U) -> List[U]
```

This would require:
- Parametric polymorphism in the type system
- Type inference for callback return types
- Unification during HOF type checking

**Files to modify:**
- `crates/crespi-core/src/types/checker.rs`
- `crates/crespi-core/src/types/inference.rs`
- `crates/crespi-core/src/builtins/definitions.rs`

## Performance Impact

### Current Performance (Unoptimized)

For `numbers.map(x => x * 2)` on `List[Int]`:
- Each element boxed to CrespiValue (16 bytes)
- Callback called via dynamic dispatch
- Result elements boxed back to CrespiValue
- Memory: 16 bytes/element input + 16 bytes/element output

### Expected Performance (Optimized)

With Int list specialization:
- Elements passed as native i64 (8 bytes)
- Direct function call (no boxing)
- Result stored as native i64
- Memory: 8 bytes/element (50% reduction)
- **Potential speedup: 2-5x for arithmetic-heavy operations**

## Implementation Complexity

### Estimated Effort

| Component | Functions | Lines of Code (est.) |
|-----------|-----------|---------------------|
| Runtime HOF implementations | 84 | ~8,400 (with macros: ~500) |
| LLVM codegen integration | 1 | ~300 |
| Symbol resolution | 1 | ~100 |
| Tests | 84 | ~1,000 |
| **Total** | **170** | **~10,000 (with macros: ~2,000)** |

### Complexity Factors

1. **Callback handling** - Need to marshal between native types and CrespiValue for callback invocation
2. **Result type flexibility** - Map can change element type (Int -> String), need to handle fallback
3. **Error handling** - Callbacks can throw exceptions, need proper cleanup
4. **Memory management** - Ensure GC tracking for allocated results
5. **Edge cases** - Empty collections, null callbacks, type mismatches

## Alternative Approaches

### 1. Partial Specialization (Recommended Start)

Specialize only the 3 most common types:
- **Int** (i64) - Most common numeric type
- **Double** (f64) - Most common float type
- **Bool** - Common for filter predicates

**Effort:** ~30% of full implementation
**Benefit:** ~80% of performance gains (Pareto principle)

### 2. JIT Compilation

Generate specialized HOF implementations at runtime using LLVM JIT:
- Detect HOF call patterns
- Generate optimized machine code on first call
- Cache generated code for reuse

**Pros:** No code explosion, optimal performance
**Cons:** JIT complexity, startup overhead, harder to debug

### 3. Monomorphization

Generate specialized versions during compilation (Rust/C++ style):
- Type checker tracks HOF instantiations
- Compiler generates specialized versions for each used type
- Link only what's needed

**Pros:** Optimal binary size, no runtime overhead
**Cons:** Complex type system changes, longer compile times

## Relevant Files

### Runtime Layer
- `crates/crespi-runtime/src/builtins.rs` - Add specialized HOF implementations
- `crates/crespi-runtime/src/gc.rs` - List type definitions (already complete)

### LLVM Backend
- `crates/crespi-llvm/src/compiler.rs` - Add HOF call detection and codegen
- `crates/crespi-llvm/src/collections.rs` - Add HOF symbol resolution methods
- `crates/crespi-llvm/src/builtins.rs` - May need HOF-specific helpers

### Type System (if doing full type inference)
- `crates/crespi-core/src/types/checker.rs` - HOF type checking
- `crates/crespi-core/src/types/inference.rs` - Infer callback return types
- `crates/crespi-core/src/builtins/definitions.rs` - Update HOF signatures

### Interpreter (Current Implementation)
- `crates/crespi-core/src/interpreter/eval.rs:3093-3350` - Reference implementation
- `crates/crespi-core/src/interpreter/primitive_extensions.rs` - Extension method registration

### Tests
- `crates/crespi-core/tests/` - Add HOF specialization tests
- `crates/crespi-llvm/tests/` - Add LLVM codegen tests for HOFs

## Implementation Checklist

### Phase 1: Runtime (Macros)
- [ ] Create `impl_hof_ops!` macro for code generation
- [ ] Generate map implementations (12 variants)
- [ ] Generate filter implementations (12 variants)
- [ ] Generate reduce implementations (12 variants)
- [ ] Generate find implementations (12 variants)
- [ ] Generate every implementations (12 variants)
- [ ] Generate some implementations (12 variants)
- [ ] Generate sort implementations (12 variants)
- [ ] Add callback invocation helpers
- [ ] Add result type handling (fallback to Any on type change)

### Phase 2: LLVM Integration
- [ ] Add `lower_hof_call()` method in compiler.rs
- [ ] Detect HOF method calls in `lower_method_call()`
- [ ] Extract ListKind from receiver type
- [ ] Generate specialized calls for known types
- [ ] Fall back to interpreter for Any/unknown types
- [ ] Add symbol resolution for all HOF × type combinations

### Phase 3: Testing
- [ ] Unit tests for each HOF × type (84 test cases)
- [ ] Integration tests for chained HOFs
- [ ] Performance benchmarks vs current implementation
- [ ] Edge case tests (empty lists, null callbacks, errors)

### Phase 4: Documentation
- [ ] Update language reference with performance characteristics
- [ ] Add examples of optimized HOF usage
- [ ] Document when specialization applies
- [ ] Note fallback behavior for dynamic types

## Design Decisions

### 1. Callback Return Type Handling

**Challenge:** `map` can change element types: `List[Int].map(x => x.toString())` returns `List[String]`

**Options:**
- **Runtime type check:** If callback returns different type, fall back to boxed list
- **Type constraints:** Require callback return type matches element type
- **Polymorphic result:** Support `List[U]` where `U` is callback return type (complex)

**Recommendation:** Runtime type check with fallback (simplest, maintains flexibility)

### 2. Callback Invocation

**Challenge:** Callbacks expect CrespiValue arguments, but we have native types

**Solution:**
```rust
// Box native value -> call callback -> unbox result
let elem_boxed = CrespiValue::from_int(elem);
let result_boxed = call_function(callback, &[elem_boxed]);
let result_native = result_boxed.as_int().ok_or(fallback_to_any)?;
```

### 3. Error Handling

**Challenge:** Callbacks can throw exceptions

**Solution:**
- Propagate errors immediately (don't collect partial results)
- Use Rust Result types for each callback invocation
- Ensure proper cleanup on error (no memory leaks)

### 4. Memory Management

**Challenge:** Result lists need GC tracking

**Solution:**
- All specialized HOFs take `gc_ctx: *mut GcContext` parameter
- Use existing `alloc_<type>_list()` methods for results
- Intermediate values properly retained/released

## Performance Benchmarks (Estimated)

Based on native list variants' 50% memory reduction:

| Operation | Current (ms) | Optimized (ms) | Speedup |
|-----------|--------------|----------------|---------|
| `List[Int]` with 1M elements `.map(x => x * 2)` | 45 | 15 | 3.0x |
| `List[Double]` with 1M elements `.filter(x => x > 0)` | 50 | 18 | 2.8x |
| `List[Int]` with 1M elements `.reduce((a, b) => a + b)` | 60 | 12 | 5.0x |
| Chained: `.map().filter().reduce()` | 155 | 45 | 3.4x |

**Note:** Actual benchmarks needed to validate estimates.

## Code Size Impact

### Without Macros
- 84 HOF implementations × ~100 LOC each = **~8,400 LOC**
- Binary size increase: ~500KB (estimated)

### With Macros (Recommended)
- 1 macro definition × ~200 LOC = **~200 LOC**
- 84 macro invocations × ~1 LOC each = **~84 LOC**
- 1 symbol resolver × ~200 LOC = **~200 LOC**
- **Total: ~500 LOC** (95% reduction)
- Binary size: ~500KB (same - macros expand at compile time)

## Dependencies

### Already Available
- ✅ Native list types (Int, Int32, Int16, Int8, UInt, UInt32, UInt16, UInt8, Float, Float32, Bool, Bool)
- ✅ ListKind enum with all variants
- ✅ `paste` crate for macro token pasting
- ✅ CollectionResolver symbol resolution pattern
- ✅ Typed list operations (get, set, push, pop, len)

### Needed
- Function calling mechanism from native code
- Result type inference or fallback strategy
- Error propagation from callbacks
- Performance benchmarking infrastructure

## Migration Path

### Stage 1: Proof of Concept (1-2 days)
- Implement `map` for `IntList` only
- Add LLVM codegen for this single case
- Benchmark vs current implementation
- Validate approach works

### Stage 2: Core Types (3-5 days)
- Extend to Int, Double, Bool for all HOFs
- Add comprehensive tests
- Measure performance improvements
- Document any issues found

### Stage 3: Complete Coverage (5-7 days)
- Generate all 84 specialized functions via macros
- Add LLVM integration for all types
- Full test coverage
- Performance benchmarking suite

### Stage 4: Polish (2-3 days)
- Optimize callback invocation overhead
- Add inline hints for hot paths
- Documentation and examples
- Release notes

**Total estimated effort: 11-17 days**

## Risks and Mitigations

### Risk 1: Code Complexity
**Impact:** Hard to maintain 84 specialized functions
**Mitigation:** Use macros extensively, follow clear patterns

### Risk 2: Binary Size Bloat
**Impact:** Larger compiled programs
**Mitigation:** Link-time optimization (LTO), dead code elimination

### Risk 3: Type System Limitations
**Impact:** Can't fully type `map: (List[T], T -> U) -> List[U]`
**Mitigation:** Use runtime fallback for type-changing operations

### Risk 4: Callback Overhead
**Impact:** Boxing/unboxing for each callback call
**Mitigation:** Inline callback bodies where possible (future work)

## Future Enhancements

### 1. Lambda Inlining
Inline simple lambda bodies directly into the loop:
```crespi
numbers.map(x => x * 2)
// Becomes:
for i in 0..numbers.len() {
    result[i] = numbers[i] * 2
}
```

### 2. SIMD Vectorization
Use LLVM vector types for parallel operations:
```rust
// Process 4 elements at once with SSE/AVX
let vec_type = self.codegen.context.i64_type().vec_type(4);
```

### 3. Parallel HOFs
Add parallel versions using threads:
```crespi
numbers.par_map(x => expensive(x))  // Parallel map
```

### 4. Fusion Optimization
Combine multiple HOF calls into single pass:
```crespi
numbers.map(x => x * 2).filter(x => x > 10)
// Fused to:
numbers.iter().map_filter(x => {
    let mapped = x * 2;
    if mapped > 10 { Some(mapped) } else { None }
})
```

## Related Work

### Languages with Specialized HOFs
- **Rust:** Iterator trait with specialized impls
- **Scala:** Specialized collections in scala.collection.specialized
- **Julia:** Multiple dispatch with type-specific methods
- **C++:** Template specialization for STL algorithms

### Reference Implementations
- Rust Iterator::map: https://doc.rust-lang.org/src/core/iter/traits/iterator.rs.html#609
- LLVM Loop Vectorizer: https://llvm.org/docs/Vectorizers.html

## Conclusion

HOF specialization for typed collections would provide significant performance improvements (2-5x speedup estimated) with manageable complexity using macros. The infrastructure is now in place with all native list types available.

**Recommendation:** Start with Stage 1 proof-of-concept to validate the approach before committing to full implementation.

**Priority:** Medium-High
- **Performance impact:** High (2-5x for numeric operations)
- **User impact:** Medium (transparent optimization)
- **Implementation complexity:** High (84 functions, but macro-generated)
- **Risk:** Low (can fall back to current implementation)
