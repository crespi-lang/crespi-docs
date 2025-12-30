# Monomorphization for Generic Functions

## Status: Long-term / Research

## Overview

Monomorphization is a compiler optimization that generates specialized versions of generic functions for each concrete type they're used with. Instead of runtime type dispatch, the compiler creates separate implementations at compile time.

```crespi
// Generic function definition
fn sum<T: Numeric>(list: List[T]) -> T {
    list.reduce((a, b) => a + b, T.zero)
}

// Usage
let intSum = sum([1, 2, 3])           // Uses sum<Int>
let floatSum = sum([1.0, 2.0, 3.0])   // Uses sum<Double>

// After monomorphization, compiler generates:
fn sum_Int(list: List[Int]) -> Int { ... }
fn sum_Double(list: List[Double]) -> Double { ... }
```

**Key benefit**: Zero-cost generics - no runtime overhead compared to hand-written specialized code.

## Background Research

### How Rust Does It

Reference: [Rust Compiler Dev Guide - Monomorphization](https://rustc-dev-guide.rust-lang.org/backend/monomorph.html)

Rust takes a full monomorphization approach:
- Stamps out a different copy of generic function code for each concrete type
- Happens during code generation (after type checking)
- Results in zero runtime overhead
- Trade-off: Longer compile times, larger binaries

```rust
// Rust example
fn identity<T>(x: T) -> T { x }

identity(42);      // Generates identity::<i32>
identity("hello"); // Generates identity::<&str>
```

### How Swift Does It

Reference: [Compiling Swift Generics (PDF)](https://download.swift.org/docs/assets/generics.pdf)

Swift uses a **hybrid approach**:
1. **Witness tables**: Dictionary passing for type metadata (size, copy, destroy operations)
2. **Specialization**: Optionally monomorphizes with `@inlinable` annotation
3. **No boxing**: Works with any type without heap allocation

```swift
// Swift can specialize generic functions within a module
// and across modules with @inlinable annotation
@inlinable
func identity<T>(_ x: T) -> T { return x }
```

**Key insight from Swift**: You can provide uniform representation without boxing by passing type metadata (size, alignment, copy/destroy functions) at runtime.

### Trade-offs Comparison

| Approach | Compile Time | Binary Size | Runtime Performance | Flexibility |
|----------|--------------|-------------|---------------------|-------------|
| **Full Monomorphization** (Rust) | Slow | Large | Optimal | Limited |
| **Type Erasure** (Java/Kotlin) | Fast | Small | Overhead | High |
| **Witness Tables** (Swift) | Medium | Medium | Near-optimal | High |
| **JIT Specialization** (Julia) | N/A | N/A | Optimal after warmup | Very High |

Reference: [Models of Generics and Metaprogramming](https://thume.ca/2019/07/14/a-tour-of-metaprogramming-models-for-generics/)

## Current Crespi Implementation

### Type System

Location: `crates/crespi-core/src/types/core.rs`

```rust
pub enum Type {
    // Primitives
    Int, Int32, Int16, Int8,
    UInt, UInt32, UInt16, UInt8,
    Double, Float,
    String, Bool, Null, Unit,

    // Collections (parameterized)
    List(Box<Type>),
    Dict(Box<Type>, Box<Type>),
    Tuple(Vec<Type>),

    // Functions
    Function {
        params: Vec<Type>,
        return_type: Box<Type>,
        throws: bool,
    },

    // Generics
    Generic(String),           // e.g., "T" in Box[T]
    TypeVar(TypeVarId),        // Type inference variables

    // Classes & Enums (can be generic)
    Class { name: String, type_args: Vec<Type> },
    Enum { name: String, type_args: Vec<Type> },

    // Special
    Any, Unknown, Never, Error,
}
```

### HIR Function Representation

Location: `crates/crespi-hir/src/hir.rs`

```rust
pub struct HirFunction {
    pub id: FunctionId,
    pub name: String,
    pub type_params: Vec<String>,           // Generic parameters: ["T", "U"]
    pub param_types: Vec<Option<Type>>,     // Parameter types
    pub return_type: Option<Type>,          // Return type
    pub body: Vec<HirStmt>,
    // ...
}
```

### Current Generic Handling

Currently, Crespi generics are handled via:
1. **Type inference**: Hindley-Milner style unification
2. **Runtime dispatch**: Generic code uses `Any` type at runtime
3. **No specialization**: Same code path for all type instantiations

This works but has performance overhead from:
- Boxing/unboxing values
- Runtime type checks
- Missed optimization opportunities

## Proposed Implementation

### Approach: Selective Monomorphization

Rather than full Rust-style monomorphization (which would significantly increase compile times), propose a **selective approach**:

1. **Always monomorphize**: Small functions, hot paths, `@specialize` decorated
2. **Never monomorphize**: Large functions, rarely called, `@no_specialize` decorated
3. **Heuristic-based**: Medium functions based on call count and complexity

### Phase 1: Type Instantiation Tracking

**Goal**: Track which concrete types each generic function is called with.

**New module**: `crates/crespi-hir/src/instantiation.rs`

```rust
/// Tracks concrete type instantiations of generic functions
pub struct InstantiationCollector {
    /// Map from generic function to its instantiations
    /// Key: (FunctionId, Vec<Type>) - function + type arguments
    instantiations: HashMap<FunctionId, HashSet<Vec<Type>>>,
}

impl InstantiationCollector {
    /// Collect all instantiations in a program
    pub fn collect(program: &HirProgram) -> Self {
        let mut collector = Self::new();

        for func in &program.functions {
            collector.visit_function(func);
        }

        collector
    }

    fn visit_call(&mut self, callee: &HirExpr, args: &[HirExpr]) {
        if let Some(func_id) = self.resolve_generic_function(callee) {
            if let Some(type_args) = self.infer_type_arguments(callee, args) {
                self.instantiations
                    .entry(func_id)
                    .or_default()
                    .insert(type_args);
            }
        }
    }
}
```

### Phase 2: Function Specialization

**Goal**: Generate specialized versions of generic functions.

```rust
pub struct Specializer {
    /// Original generic functions
    generics: HashMap<FunctionId, HirFunction>,

    /// Generated specialized functions
    specialized: HashMap<(FunctionId, Vec<Type>), HirFunction>,

    /// Next available function ID
    next_id: FunctionId,
}

impl Specializer {
    /// Specialize a generic function for concrete types
    pub fn specialize(
        &mut self,
        func: &HirFunction,
        type_args: &[Type],
    ) -> FunctionId {
        let key = (func.id, type_args.to_vec());

        if let Some(existing) = self.specialized.get(&key) {
            return existing.id;
        }

        // Create specialized version
        let specialized = self.create_specialized(func, type_args);
        let id = specialized.id;
        self.specialized.insert(key, specialized);
        id
    }

    fn create_specialized(
        &mut self,
        func: &HirFunction,
        type_args: &[Type],
    ) -> HirFunction {
        let mut specialized = func.clone();

        // Update function name: sum -> sum_Int
        specialized.name = self.mangle_name(&func.name, type_args);

        // Assign new ID
        specialized.id = self.next_id();

        // Clear type parameters (now concrete)
        specialized.type_params.clear();

        // Substitute type parameters with concrete types
        let substitution = self.build_substitution(func, type_args);
        specialized.param_types = self.substitute_types(&func.param_types, &substitution);
        specialized.return_type = self.substitute_type(&func.return_type, &substitution);
        specialized.body = self.substitute_body(&func.body, &substitution);

        specialized
    }

    fn build_substitution(
        &self,
        func: &HirFunction,
        type_args: &[Type],
    ) -> HashMap<String, Type> {
        func.type_params
            .iter()
            .zip(type_args)
            .map(|(param, ty)| (param.clone(), ty.clone()))
            .collect()
    }
}
```

### Phase 3: Call Site Rewriting

**Goal**: Update call sites to use specialized versions.

```rust
impl Specializer {
    /// Rewrite call sites to use specialized functions
    pub fn rewrite_calls(&mut self, program: &mut HirProgram) {
        for func in &mut program.functions {
            self.rewrite_calls_in_function(func);
        }
    }

    fn rewrite_call(
        &self,
        callee: &mut HirExpr,
        args: &[HirExpr],
    ) -> Option<FunctionId> {
        let func_id = self.resolve_generic_function(callee)?;
        let type_args = self.infer_type_arguments(callee, args)?;

        let key = (func_id, type_args);
        let specialized = self.specialized.get(&key)?;

        // Rewrite callee to reference specialized function
        *callee = HirExpr::global(specialized.name.clone());

        Some(specialized.id)
    }
}
```

### Phase 4: Name Mangling

**Goal**: Generate unique names for specialized functions.

```rust
impl Specializer {
    fn mangle_name(&self, base: &str, type_args: &[Type]) -> String {
        let type_suffix = type_args
            .iter()
            .map(|ty| self.mangle_type(ty))
            .collect::<Vec<_>>()
            .join("_");

        format!("{}_{}", base, type_suffix)
    }

    fn mangle_type(&self, ty: &Type) -> String {
        match ty {
            Type::Int => "Int".to_string(),
            Type::Int32 => "Int32".to_string(),
            Type::Double => "Double".to_string(),
            Type::Float => "Float".to_string(),
            Type::Bool => "Bool".to_string(),
            Type::String => "String".to_string(),
            Type::List(inner) => format!("List_{}", self.mangle_type(inner)),
            Type::Class { name, type_args } => {
                if type_args.is_empty() {
                    name.clone()
                } else {
                    let args = type_args
                        .iter()
                        .map(|t| self.mangle_type(t))
                        .collect::<Vec<_>>()
                        .join("_");
                    format!("{}_{}", name, args)
                }
            }
            _ => "Any".to_string(),
        }
    }
}

// Examples:
// sum<Int> -> sum_Int
// swap<Int, String> -> swap_Int_String
// process<List[Int]> -> process_List_Int
// Box<Pair<Int, String>> -> Box_Pair_Int_String
```

### Phase 5: Specialization Heuristics

**Goal**: Decide when to specialize vs. use generic dispatch.

```rust
pub struct SpecializationHeuristics {
    /// Maximum function size (statements) to auto-specialize
    pub max_auto_specialize_size: usize,  // Default: 50

    /// Minimum call count to trigger specialization
    pub min_call_count: usize,  // Default: 2

    /// Maximum instantiations before giving up
    pub max_instantiations: usize,  // Default: 10
}

impl SpecializationHeuristics {
    pub fn should_specialize(
        &self,
        func: &HirFunction,
        instantiation_count: usize,
    ) -> SpecializationDecision {
        // Always specialize if marked
        if func.has_attribute("specialize") {
            return SpecializationDecision::Always;
        }

        // Never specialize if marked
        if func.has_attribute("no_specialize") {
            return SpecializationDecision::Never;
        }

        // Too many instantiations - would cause code bloat
        if instantiation_count > self.max_instantiations {
            return SpecializationDecision::Never;
        }

        // Small functions - always specialize
        if func.body.len() <= 10 {
            return SpecializationDecision::Always;
        }

        // Medium functions - specialize if called enough
        if func.body.len() <= self.max_auto_specialize_size {
            if instantiation_count >= self.min_call_count {
                return SpecializationDecision::Always;
            }
        }

        // Large functions - only if explicitly marked
        SpecializationDecision::Never
    }
}

pub enum SpecializationDecision {
    Always,
    Never,
    Conditional(/* predicate */),
}
```

## Files to Modify

| File | Changes |
|------|---------|
| `crates/crespi-hir/src/instantiation.rs` | New: Instantiation tracking |
| `crates/crespi-hir/src/specialization.rs` | New: Specialization engine |
| `crates/crespi-hir/src/mangling.rs` | New: Name mangling |
| `crates/crespi-hir/src/optimizer.rs` | Extend: Integration |
| `crates/crespi-hir/src/lib.rs` | Export new modules |
| `crates/crespi-llvm/src/compiler.rs` | Update: Handle specialized functions |

## Implementation Phases

### Phase 1: Instantiation Collection (~200 LOC)
1. Create `instantiation.rs` module
2. Walk HIR to find all generic function calls
3. Infer type arguments at each call site
4. Build instantiation map
5. Test with simple generic functions

### Phase 2: Basic Specialization (~400 LOC)
1. Create `specialization.rs` module
2. Implement type substitution in HIR
3. Generate specialized function copies
4. Create `mangling.rs` for name generation
5. Test with `identity<T>` and `swap<T, U>`

### Phase 3: Call Site Rewriting (~200 LOC)
1. Implement call site detection
2. Rewrite calls to use specialized versions
3. Remove original generic from output if unused
4. Test end-to-end specialization

### Phase 4: Heuristics (~150 LOC)
1. Implement size-based heuristics
2. Add `@specialize` and `@no_specialize` decorators
3. Add configuration options
4. Test with various function sizes

### Phase 5: Integration (~200 LOC)
1. Wire into optimizer pipeline
2. Add statistics (functions specialized, code size impact)
3. Add compiler flags
4. Comprehensive testing

**Estimated total**: ~1,150 LOC

## Complexity Considerations

### Recursive Generic Functions

```crespi
fn tree_sum<T: Numeric>(tree: Tree[T]) -> T {
    match tree {
        case Leaf(value): value
        case Node(left, right): tree_sum(left) + tree_sum(right)
    }
}
```

**Challenge**: Recursive call must reference specialized version.

**Solution**: Two-pass approach:
1. First pass: Create all specialized function stubs (name + signature only)
2. Second pass: Fill in bodies with rewritten recursive calls

### Mutual Recursion

```crespi
fn is_even<T: Numeric>(n: T) -> Bool {
    if n == 0 { true } else { is_odd(n - 1) }
}

fn is_odd<T: Numeric>(n: T) -> Bool {
    if n == 0 { false } else { is_even(n - 1) }
}
```

**Challenge**: Both functions must be specialized together.

**Solution**: Strongly connected component (SCC) analysis, specialize entire SCC at once.

### Generic Constraints (Traits)

```crespi
fn sum<T: Numeric>(list: List[T]) -> T {
    list.reduce((a, b) => a + b, T.zero)
}
```

**Challenge**: Need to resolve `+` operator and `zero` constant for concrete type.

**Solution**: During specialization, resolve trait methods to concrete implementations:
- `T.zero` with `T = Int` → `0`
- `a + b` with `a: Int, b: Int` → `Int::add(a, b)`

### Higher-Kinded Types (Future)

```crespi
fn map<F[_], A, B>(container: F[A], f: A -> B) -> F[B]
```

**Challenge**: `F` is a type constructor, not a type.

**Solution**: Defer to future type system enhancement. Current proposal focuses on simple generics.

## Performance Expectations

### Compile Time Impact

| Scenario | Without Mono | With Mono | Impact |
|----------|--------------|-----------|--------|
| Small project (1K LOC) | 0.5s | 0.6s | +20% |
| Medium project (10K LOC) | 2s | 2.5s | +25% |
| Large project (100K LOC) | 15s | 20s | +33% |

*Estimates based on similar implementations in other compilers*

### Binary Size Impact

| Generics Usage | Without Mono | With Mono | Impact |
|----------------|--------------|-----------|--------|
| Minimal | 100KB | 100KB | +0% |
| Moderate | 500KB | 600KB | +20% |
| Heavy | 2MB | 3MB | +50% |

### Runtime Performance Impact

| Operation | Without Mono | With Mono | Speedup |
|-----------|--------------|-----------|---------|
| Generic function call | 15ns | 3ns | 5x |
| Collection operation | 45ms | 15ms | 3x |
| Numeric computation | 100ms | 20ms | 5x |

*The runtime improvements often outweigh compile time costs*

## Alternative Approaches

### 1. Swift-style Witness Tables

Instead of full monomorphization, pass type metadata at runtime:

```rust
struct WitnessTable {
    size: usize,
    alignment: usize,
    copy: fn(*const u8, *mut u8),
    destroy: fn(*mut u8),
    // Type-specific operations
    add: Option<fn(*const u8, *const u8, *mut u8)>,
    // ...
}
```

**Pros**: No code bloat, faster compile times
**Cons**: Runtime overhead for metadata lookups

### 2. Partial Specialization

Only specialize for primitive types, use witness tables for complex types:

```rust
// These get specialized:
sum<Int>, sum<Double>, sum<Bool>

// These use witness tables:
sum<MyCustomType>, sum<List[T]>
```

**Pros**: Best of both worlds
**Cons**: More complex implementation

### 3. Profile-Guided Specialization

Use runtime profiling to decide what to specialize:

1. First compilation: Use generic dispatch with counters
2. Profile run: Collect instantiation frequencies
3. Second compilation: Specialize hot instantiations

**Pros**: Only specialize what matters
**Cons**: Requires two compilations, more tooling

## Relationship to Other Optimizations

```
┌─────────────────────────────────────────────────┐
│  Monomorphization (this feature)                │
│  ─────────────────────────────────────────────  │
│  Lambda Inlining (combines well)                │
│  ─────────────────────────────────────────────  │
│  HOF Specialization (prerequisite patterns)     │
│  ─────────────────────────────────────────────  │
│  Native Typed Lists (complete)                  │
└─────────────────────────────────────────────────┘
```

**Synergies:**
- Monomorphized generics expose more inlining opportunities
- Lambda inlining works better with concrete types
- HOF Specialization is manual monomorphization for builtins

## Testing Strategy

### Unit Tests

```crespi
// test_monomorphization.crespi

// Simple generic
fn identity<T>(x: T) -> T { x }

@test fn test_identity_mono() {
    assert_eq(identity(42), 42)
    assert_eq(identity("hello"), "hello")
    assert_eq(identity(true), true)
}

// Generic with constraint
fn double<T: Numeric>(x: T) -> T { x + x }

@test fn test_constrained_mono() {
    assert_eq(double(21), 42)
    assert_eq(double(21.0), 42.0)
}

// Generic with multiple type params
fn pair<A, B>(a: A, b: B) -> (A, B) { (a, b) }

@test fn test_multi_param_mono() {
    let p = pair(1, "hello")
    assert_eq(p.0, 1)
    assert_eq(p.1, "hello")
}

// Recursive generic
fn list_sum<T: Numeric>(list: List[T]) -> T {
    if list.isEmpty() { T.zero }
    else { list.head() + list_sum(list.tail()) }
}

@test fn test_recursive_mono() {
    assert_eq(list_sum([1, 2, 3, 4, 5]), 15)
    assert_eq(list_sum([1.0, 2.0, 3.0]), 6.0)
}
```

### Verification Strategy

1. **Correctness**: Compare results with and without monomorphization
2. **Code inspection**: Dump specialized function names, verify expected set
3. **Binary size**: Measure code size impact
4. **Performance**: Benchmark with various type instantiation patterns

## Implementation Checklist

### Phase 1: Instantiation Collection
- [ ] Create `instantiation.rs` module
- [ ] Implement AST/HIR walker for call sites
- [ ] Infer type arguments at call sites
- [ ] Build instantiation map
- [ ] Track instantiation counts

### Phase 2: Basic Specialization
- [ ] Create `specialization.rs` module
- [ ] Implement type substitution for types
- [ ] Implement type substitution for expressions
- [ ] Implement type substitution for statements
- [ ] Generate specialized function copies
- [ ] Create `mangling.rs` for name generation

### Phase 3: Call Site Rewriting
- [ ] Identify call sites to rewrite
- [ ] Generate call to specialized version
- [ ] Handle recursive calls
- [ ] Handle mutual recursion
- [ ] Remove unused generic versions

### Phase 4: Heuristics
- [ ] Implement size-based heuristics
- [ ] Add `@specialize` decorator
- [ ] Add `@no_specialize` decorator
- [ ] Add CLI configuration
- [ ] Tune default thresholds

### Phase 5: Integration
- [ ] Wire into optimizer pipeline
- [ ] Add statistics tracking
- [ ] Add compiler flags
- [ ] Write comprehensive tests
- [ ] Performance benchmarks
- [ ] Documentation

## References

- [Rust Compiler Dev Guide - Monomorphization](https://rustc-dev-guide.rust-lang.org/backend/monomorph.html)
- [Compiling Swift Generics (PDF)](https://download.swift.org/docs/assets/generics.pdf)
- [Models of Generics and Metaprogramming](https://thume.ca/2019/07/14/a-tour-of-metaprogramming-models-for-generics/)
- [Swift vs Rust Generics](https://medium.com/@petrachkovsergey/ios-dev-on-a-rust-journey-3-generics-c490beccc880)
- [What is Monomorphization?](https://medium.com/@lightworld/rust-tips-what-is-monomorphization-49b5840778fe)
- [Understanding Monomorphization in Rust](https://www.slingacademy.com/article/understanding-how-monomorphization-works-under-the-hood-with-generics/)

## Conclusion

Monomorphization provides zero-cost generics by generating specialized code at compile time. While it increases compile time and binary size, the runtime performance benefits are significant for performance-critical code.

**Recommendation**: Implement selective monomorphization with good heuristics to balance code size and performance. Start with always-specialize for small functions, add `@specialize`/`@no_specialize` for user control.

**Priority**: Low (long-term enhancement)
**Complexity**: High
**Impact**: Medium-High (depends on generic usage patterns)
**Dependencies**: Type system maturity, constraint/trait implementation
