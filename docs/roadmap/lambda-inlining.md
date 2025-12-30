# Lambda Inlining and Stream Fusion

## Status: Planned (depends on HOF Specialization)

## Overview

Lambda inlining is a compiler optimization that replaces function calls with the body of the called function, eliminating call overhead entirely. When combined with **stream fusion** (also called **deforestation**), it can eliminate intermediate data structures in chained HOF operations.

```crespi
// Before optimization:
numbers.map(x => x * 2).filter(x => x > 10).reduce((a, b) => a + b)
// Creates 2 intermediate lists, 3 function calls per element

// After lambda inlining + fusion:
var acc = 0
for x in numbers {
    let mapped = x * 2
    if mapped > 10 {
        acc = acc + mapped
    }
}
// Zero intermediate lists, zero function call overhead
```

**Expected performance improvement**: 5-20x for chained HOF operations on large collections.

## Background Research

### Academic Foundations

1. **Stream Fusion** (Coutts, Leshchinskiy, Stewart - ICFP 2007)
   - Original paper: [Stream Fusion: From Lists to Streams to Nothing at All](https://www.cs.tufts.edu/~nr/cs257/archive/duncan-coutts/stream-fusion.pdf)
   - Key insight: Transform list operations to stream operations, then fuse via general-purpose compiler optimizations
   - Used in Haskell's `vector` library with great success

2. **Deforestation** (Wadler 1990)
   - Eliminates intermediate tree/list structures
   - Recent advancement: [The Long Way to Deforestation](https://dl.acm.org/doi/10.1145/3674634) (ICFP 2024)
   - Reports 8.2% average speedup on nofib benchmark suite

3. **LLVM Loop Fusion**
   - [Loop Fusion Pass](https://llvm.org/doxygen/LoopFuse_8cpp_source.html) - fuses adjacent loops with same iteration count
   - [Loop Fusion in the Optimization Pipeline](https://llvm.org/devmtg/2019-04/slides/TechTalk-Barton-Loop_fusion_loop_distribution_and_their_place_in_the_loop_optimization_pipeline.pdf)
   - Strategy: "Fuse early, expose optimization opportunities, split late after vectorization"

### How Other Languages Do It

| Language | Approach | Notes |
|----------|----------|-------|
| **Haskell** | Rewrite rules + stream fusion | Most mature implementation |
| **Rust** | Iterator trait + LLVM inlining | Zero-cost abstractions via monomorphization |
| **Scala** | Staged computation (LMS) | Research-grade, complex |
| **Java** | JIT inlining at runtime | Effective but unpredictable |
| **Swift** | `@inlinable` + specialization | Opt-in with compiler heuristics |

## Current Crespi Implementation

### Closure Representation in HIR

Location: `crates/crespi-hir/src/hir.rs`

```rust
pub struct HirFunction {
    pub id: FunctionId,
    pub name: String,
    pub is_closure: bool,                    // Flag to mark closures
    pub captures: Vec<String>,               // Captured variable names
    pub capture_mutable: Vec<bool>,          // Mutability of each capture
    pub should_inline: bool,                 // Inlining hint (from @inline)
    pub type_params: Vec<String>,            // Generic type parameters
    pub param_types: Vec<Option<Type>>,      // Parameter type information
    pub return_type: Option<Type>,           // Return type
    pub body: Vec<HirStmt>,                  // Function body statements
}

pub enum HirExprKind {
    MakeClosure {
        function: FunctionId,
        captures: Vec<HirExpr>,              // Captured expressions
    },
    // ...
}
```

### Existing Inlining Infrastructure

Location: `crates/crespi-hir/src/optimizer.rs`

```rust
pub enum OptimizationLevel {
    None,           // -O0: no optimizations
    Basic,          // -O1: constant folding, dead code elimination
    Full,           // -O2: basic + function inlining
}

struct Inliner {
    functions: &HashMap<FunctionId, HirFunction>,
    name_to_id: &HashMap<String, FunctionId>,
    next_var_id: usize,                    // For renaming captured vars
    functions_inlined: usize,
}
```

**Current inlining behavior:**
- At -O1: Only inline `@inline` decorated functions
- At -O2: Also auto-inline small functions (≤5 statements)
- Detects and avoids recursive functions
- Uses variable renaming to avoid conflicts

### LLVM Closure Lowering

Location: `crates/crespi-llvm/src/compiler.rs:2229-2312`

Closures are currently compiled as:
1. Separate LLVM functions with environment pointer
2. Runtime `crespi_rt_make_closure()` creates closure object
3. Calls go through `crespi_rt_call_closure()` with dynamic dispatch

This is the overhead we want to eliminate.

## Proposed Implementation

### Phase 1: Lambda Call Site Analysis

**Goal**: Identify which lambdas can be inlined and where.

**New module**: `crates/crespi-hir/src/lambda_analysis.rs`

```rust
pub struct LambdaCallSite {
    pub lambda_id: FunctionId,
    pub call_location: Span,
    pub in_loop: bool,                      // Hot path detection
    pub argument_types: Vec<Option<Type>>,  // For specialization
}

pub struct LambdaAnalysis {
    pub call_sites: HashMap<FunctionId, Vec<LambdaCallSite>>,
    pub single_use_lambdas: HashSet<FunctionId>,
    pub hot_lambdas: HashSet<FunctionId>,   // Called in loops
    pub recursive_lambdas: HashSet<FunctionId>,
}

impl LambdaAnalysis {
    /// Analyze all lambdas in a program
    pub fn analyze(program: &HirProgram) -> Self {
        // 1. Collect all MakeClosure expressions
        // 2. Track call sites for each lambda
        // 3. Detect hot paths (inside loops, HOFs)
        // 4. Build dependency graph for recursion detection
    }

    /// Should this lambda be inlined at this call site?
    pub fn should_inline(&self, lambda_id: FunctionId, site: &LambdaCallSite) -> bool {
        // Heuristics:
        // - Single use: always inline
        // - In hot loop: inline if small
        // - Recursive: never inline
        // - Large body (>20 stmts): only if single use
    }
}
```

### Phase 2: HOF Pattern Recognition

**Goal**: Detect HOF call patterns that can be fused.

```rust
pub enum HofPattern {
    /// Single HOF: list.map(f)
    Single {
        collection: HirExpr,
        hof: HofKind,
        lambda: FunctionId,
    },

    /// Chained HOFs: list.map(f).filter(g).reduce(h)
    Chain {
        collection: HirExpr,
        operations: Vec<(HofKind, FunctionId)>,
    },
}

pub enum HofKind {
    Map,
    Filter,
    Reduce { initial: Option<HirExpr> },
    Find,
    Every,
    Some,
    FlatMap,  // Future
}

impl HofPatternRecognizer {
    /// Detect HOF patterns in method call chains
    pub fn recognize(expr: &HirExpr) -> Option<HofPattern> {
        // Walk backwards through method calls
        // Build chain of HOF operations
        // Stop at non-HOF or non-collection
    }
}
```

### Phase 3: Lambda Inlining Pass

**Goal**: Replace HOF + lambda with direct loop code.

**Extension to**: `crates/crespi-hir/src/optimizer.rs`

```rust
impl HirOptimizer {
    /// Inline lambdas into HOF call sites
    fn inline_lambdas(&mut self, program: &mut HirProgram) {
        let analysis = LambdaAnalysis::analyze(program);

        for func in &mut program.functions {
            self.inline_lambdas_in_function(func, &analysis);
        }
    }

    fn inline_lambda_in_hof(
        &mut self,
        hof_call: &HirExpr,
        lambda: &HirFunction,
    ) -> HirStmt {
        // Generate loop structure based on HOF type
        match hof_kind {
            HofKind::Map => self.generate_map_loop(collection, lambda),
            HofKind::Filter => self.generate_filter_loop(collection, lambda),
            HofKind::Reduce { initial } => self.generate_reduce_loop(collection, lambda, initial),
            // ...
        }
    }

    fn generate_map_loop(
        &mut self,
        collection: &HirExpr,
        lambda: &HirFunction,
    ) -> HirStmt {
        // Generate:
        // var __result = []
        // for __item in collection {
        //     let __mapped = <inlined lambda body with __item>
        //     __result.push(__mapped)
        // }
        // __result
    }
}
```

### Phase 4: Stream Fusion (Chained HOFs)

**Goal**: Fuse multiple chained HOFs into a single loop.

```rust
impl HirOptimizer {
    fn fuse_hof_chain(&mut self, chain: HofPattern::Chain) -> HirStmt {
        // For: list.map(f).filter(g).reduce(h, init)
        // Generate:
        //
        // var __acc = init
        // for __item in list {
        //     let __mapped = <inline f(__item)>
        //     if <inline g(__mapped)> {
        //         __acc = <inline h(__acc, __mapped)>
        //     }
        // }
        // __acc

        let mut loop_body = vec![];
        let mut current_var = "__item".to_string();

        for (hof, lambda) in chain.operations {
            match hof {
                HofKind::Map => {
                    let new_var = self.fresh_var("mapped");
                    loop_body.push(self.inline_as_let(&new_var, lambda, &current_var));
                    current_var = new_var;
                }
                HofKind::Filter => {
                    // Wrap remaining operations in if statement
                    let condition = self.inline_as_expr(lambda, &current_var);
                    // ... build conditional
                }
                HofKind::Reduce { initial } => {
                    // Final accumulation
                    loop_body.push(self.inline_reduce_step(lambda, "__acc", &current_var));
                }
                // ...
            }
        }

        self.build_for_loop(chain.collection, loop_body)
    }
}
```

### Phase 5: Capture Substitution

**Goal**: Handle captured variables correctly during inlining.

```rust
impl LambdaInliner {
    fn substitute_captures(
        &mut self,
        lambda_body: Vec<HirStmt>,
        captures: &[(String, HirExpr)],
        param_binding: &[(String, String)],  // param_name -> loop_var
    ) -> Vec<HirStmt> {
        let mut substitutions = HashMap::new();

        // Map captured variable names to their capture expressions
        for (name, expr) in captures {
            substitutions.insert(name.clone(), expr.clone());
        }

        // Map parameter names to loop variables
        for (param, var) in param_binding {
            substitutions.insert(
                param.clone(),
                HirExpr::var(var.clone()),
            );
        }

        // Walk and substitute
        self.substitute_in_stmts(lambda_body, &substitutions)
    }
}
```

## Integration with HOF Specialization

Lambda inlining builds on top of [HOF Specialization](./hof-typed-lists.md):

```
┌─────────────────────────────────────────────────┐
│  Lambda Inlining (this feature)                 │
│  ─────────────────────────────────────────────  │
│  HOF Specialization (prerequisite)              │
│  ─────────────────────────────────────────────  │
│  Native Typed Lists (complete)                  │
└─────────────────────────────────────────────────┘
```

**Why HOF Specialization first?**
- Provides typed loop structure to inline into
- Eliminates boxing overhead that inlining alone can't fix
- Gives LLVM better optimization opportunities

**Combined optimization flow:**
1. Detect HOF pattern on typed list
2. If lambda is simple, inline into specialized HOF loop
3. If chained HOFs, fuse into single typed loop
4. LLVM optimizes the resulting native loop (vectorization, etc.)

## Files to Modify

| File | Changes |
|------|---------|
| `crates/crespi-hir/src/lambda_analysis.rs` | New: Call site analysis |
| `crates/crespi-hir/src/hof_patterns.rs` | New: HOF pattern recognition |
| `crates/crespi-hir/src/optimizer.rs` | Extend: Lambda inlining pass |
| `crates/crespi-hir/src/lib.rs` | Export new modules |

## Implementation Phases

### Phase 1: Foundation (~300 LOC)
1. Create `lambda_analysis.rs` module
2. Implement call site collection
3. Add basic inlining heuristics
4. Test with simple single-use lambdas

### Phase 2: Single HOF Inlining (~400 LOC)
1. Create `hof_patterns.rs` module
2. Implement pattern recognition for single HOFs
3. Generate loop code for map/filter/reduce/find/every/some
4. Handle capture substitution
5. Test with `list.map(x => x * 2)` patterns

### Phase 3: Chain Fusion (~500 LOC)
1. Extend pattern recognition for chains
2. Implement fusion algorithm
3. Handle complex capture scenarios
4. Test with `list.map(...).filter(...).reduce(...)` patterns

### Phase 4: Integration (~200 LOC)
1. Wire into optimization pipeline
2. Add optimization statistics
3. Add compiler flags (`-fno-inline-lambdas`, `-ffuse-hofs`)
4. Comprehensive testing

**Estimated total**: ~1,400 LOC

## Complexity Considerations

### What Makes This Hard

1. **Capture Semantics**: Mutable captures need special handling
   ```crespi
   var sum = 0
   list.forEach(x => { sum = sum + x })  // Mutates captured var
   ```

2. **Exception Safety**: Inlined code must preserve exception behavior
   ```crespi
   list.map(x => {
       if x < 0 { throw Error("negative") }
       return x * 2
   })
   ```

3. **Early Exit**: `find`, `every`, `some` need to break from loop
   ```crespi
   list.find(x => x > 100)  // Must exit loop on first match
   ```

4. **Nested Lambdas**: Lambdas inside lambdas
   ```crespi
   matrix.map(row => row.map(x => x * 2))
   ```

5. **Side Effects**: Some lambdas have observable side effects
   ```crespi
   list.map(x => { print(x); return x * 2 })
   ```

### Mitigation Strategies

| Challenge | Strategy |
|-----------|----------|
| Mutable captures | Generate mutation-preserving code |
| Exceptions | Preserve try/catch structure in loop |
| Early exit | Use labeled break from generated loop |
| Nested lambdas | Recursive inlining with depth limit |
| Side effects | Preserve execution order strictly |

## Performance Expectations

### Micro-benchmarks (estimated)

| Pattern | Current | With Inlining | Speedup |
|---------|---------|---------------|---------|
| `list.map(x => x * 2)` | 45ms | 8ms | 5.6x |
| `list.filter(x => x > 0)` | 50ms | 10ms | 5.0x |
| `list.map(...).filter(...)` | 95ms | 12ms | 7.9x |
| `list.map(...).filter(...).reduce(...)` | 145ms | 15ms | 9.7x |

*Based on 1M element Int list, estimates from similar optimizations in other languages*

### Why Such Large Speedups?

1. **Eliminates function call overhead**: ~10-20 cycles per call × millions of elements
2. **Eliminates intermediate allocations**: No temporary lists
3. **Better cache locality**: Single pass over data
4. **Enables SIMD**: LLVM can vectorize simple arithmetic loops
5. **Eliminates closure creation**: No runtime closure objects

## Testing Strategy

### Unit Tests

```crespi
// test_lambda_inlining.crespi

// Simple map inlining
@test fn test_map_inline() {
    let result = [1, 2, 3].map(x => x * 2)
    assert_eq(result, [2, 4, 6])
}

// Filter inlining
@test fn test_filter_inline() {
    let result = [1, 2, 3, 4, 5].filter(x => x % 2 == 0)
    assert_eq(result, [2, 4])
}

// Chain fusion
@test fn test_chain_fusion() {
    let result = [1, 2, 3, 4, 5]
        .map(x => x * 2)
        .filter(x => x > 4)
        .reduce((a, b) => a + b, 0)
    assert_eq(result, 24)  // 6 + 8 + 10
}

// Capture handling
@test fn test_captures() {
    let factor = 3
    let result = [1, 2, 3].map(x => x * factor)
    assert_eq(result, [3, 6, 9])
}

// Mutable capture
@test fn test_mutable_capture() {
    var sum = 0
    [1, 2, 3].forEach(x => { sum = sum + x })
    assert_eq(sum, 6)
}
```

### Verification Strategy

1. **Correctness**: Run full test suite with and without inlining
2. **Performance**: Benchmark suite comparing inlined vs non-inlined
3. **IR inspection**: Dump HIR before/after to verify transformation
4. **LLVM IR check**: Verify loops are vectorizable after inlining

## Future Enhancements

### 1. Parallel HOFs
```crespi
list.par_map(x => expensive(x))  // Parallel execution
```

### 2. Lazy Evaluation
```crespi
list.lazy().map(f).filter(g).take(10)  // Only compute first 10
```

### 3. Custom Fusion Rules
```crespi
// User-defined fusion patterns
@fusion_rule
fn map_map<A, B, C>(f: A -> B, g: B -> C) -> (A -> C) {
    return x => g(f(x))
}
```

### 4. Profile-Guided Inlining
- Collect runtime call frequencies
- Inline only actually-hot lambdas
- Avoid code bloat from cold paths

## References

- [Stream Fusion Paper (PDF)](https://www.cs.tufts.edu/~nr/cs257/archive/duncan-coutts/stream-fusion.pdf)
- [The Long Way to Deforestation (ICFP 2024)](https://dl.acm.org/doi/10.1145/3674634)
- [LLVM Loop Fusion Pass](https://llvm.org/doxygen/LoopFuse_8cpp_source.html)
- [Inlining: Replacing Function Calls with Their Bodies](https://softwarepatternslexicon.com/functional/optimizations/caching-and-specialization/inlining/)
- [Lambda the Ultimate SSA (arXiv)](https://arxiv.org/pdf/2201.07272)

## Implementation Checklist

### Phase 1: Lambda Analysis
- [ ] Create `lambda_analysis.rs` module
- [ ] Implement call site collection
- [ ] Implement single-use detection
- [ ] Implement hot path detection
- [ ] Add recursion detection
- [ ] Add basic inlining heuristics

### Phase 2: Single HOF Inlining
- [ ] Create `hof_patterns.rs` module
- [ ] Implement HOF pattern recognition
- [ ] Generate map loop code
- [ ] Generate filter loop code
- [ ] Generate reduce loop code
- [ ] Generate find/every/some loop code
- [ ] Implement capture substitution
- [ ] Handle mutable captures

### Phase 3: Chain Fusion
- [ ] Extend pattern recognition for chains
- [ ] Implement map-map fusion
- [ ] Implement map-filter fusion
- [ ] Implement filter-reduce fusion
- [ ] Implement full chain fusion
- [ ] Handle early exit HOFs in chains

### Phase 4: Integration
- [ ] Wire into optimizer pipeline
- [ ] Add optimization statistics
- [ ] Add compiler flags
- [ ] Write comprehensive tests
- [ ] Performance benchmarks
- [ ] Documentation

## Conclusion

Lambda inlining is a high-value optimization that eliminates significant overhead in functional-style code. Combined with stream fusion, it can provide order-of-magnitude speedups for common patterns like `list.map(...).filter(...).reduce(...)`.

**Priority**: Medium-High (after HOF Specialization)
**Complexity**: Medium
**Impact**: High (5-20x speedup for HOF-heavy code)
