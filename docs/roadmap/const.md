# Roadmap: Compile-Time Constants (`const`)

> **Status:** Planned
> **Priority:** Medium
> **Affects:** Lexer, Parser, AST, HIR, Interpreter, Compiler

---

## Summary

Add a `const` keyword for compile-time constant declarations. Unlike `let` (runtime immutable) or `static let` (class-level, runtime-initialized), `const` values are evaluated at compile time and can be inlined by the compiler.

---

## Motivation

Crespi currently has:

| Declaration | Scope | Evaluation | Mutability |
|-------------|-------|------------|------------|
| `var` | Local/top-level | Runtime | Mutable |
| `let` | Local/top-level | Runtime | Immutable |
| `static var` | Class-level | Runtime | Mutable |
| `static let` | Class-level | Runtime | Immutable |

**Missing:** A way to express values that are known at compile time.

### Use Cases

1. **Mathematical constants** - `const TAU = 2 * PI` evaluated once at compile time
2. **Configuration** - `const MAX_CONNECTIONS = 100` inlined everywhere it's used
3. **Fixed-size arrays** - `const SIZE = 10; var buffer: [Int; SIZE]`
4. **Conditional compilation** - Dead code elimination when `const DEBUG = false`
5. **API versioning** - `const VERSION = "1.0.0"` baked into the binary

---

## Proposed Syntax

```crespi
const PI = 3.14159265359
const TAU = 2 * PI
const APP_NAME = "Crespi"
const MAX_RETRIES = 3
```

### Restrictions

- Right-hand side must be a **constant expression**:
  - Literals (`42`, `"text"`, `true`, `3.14`)
  - References to other `const` values
  - Arithmetic on constants (`const X = 1 + 2`)
  - Built-in constants (`PI`, `E`)
- **Not allowed:**
  - Function calls (even pure ones, initially)
  - Variable references
  - Class instantiation

### Class-Level Constants

```crespi
class Config {
    const VERSION = "1.0.0"
    const MAX_ITEMS = 100
}

print(Config.VERSION)  // "1.0.0"
```

---

## Compiler Benefits

### Inlining

```crespi
const MULTIPLIER = 10

fn scale(x: Int) -> Int {
    return x * MULTIPLIER  // Compiler inlines as: x * 10
}
```

### Dead Code Elimination

```crespi
const DEBUG = false

fn process() {
    if DEBUG {
        print("Debug mode")  // Compiler removes this entire block
    }
    // ...
}
```

### Fixed-Size Arrays (Future)

```crespi
const BUFFER_SIZE = 1024
var buffer: [Byte; BUFFER_SIZE]  // Stack-allocated, known size
```

---

## Implementation Plan

### Phase 1: Lexer & Parser

1. Add `TokenKind::Const` to the lexer
2. Parse `const NAME = expr` as a new AST node `ConstDecl`
3. Validate that the initializer is a constant expression

### Phase 2: AST & HIR

1. Add `ConstDecl` to AST and HIR
2. Implement constant folding pass to evaluate expressions
3. Store evaluated values in a compile-time constant table

### Phase 3: Interpreter

1. Evaluate `const` at definition time
2. Store in environment as immutable
3. Error on reassignment attempts

### Phase 4: Compiler

1. Emit constants to LLVM as global constants
2. Inline constant values at use sites
3. Enable dead code elimination based on constant conditions

### Phase 5: Type Checker

1. Track `const`-ness in the type system
2. Ensure only constant expressions in `const` declarations
3. Allow `const` in type positions (e.g., array sizes)

---

## Comparison with Other Languages

| Language | Keyword | Compile-Time | Notes |
|----------|---------|--------------|-------|
| Rust | `const` | Yes | Evaluated at compile time |
| Swift | `let` | No* | Runtime immutable (*static let can be) |
| Kotlin | `const val` | Yes | Top-level/object only |
| Go | `const` | Yes | Limited to basic types |
| TypeScript | `const` | No | Runtime only |
| **Crespi** | `const` | **Yes** | Proposed |

---

## Migration Notes

Existing code using `let` for constants remains valid. `const` is an addition, not a replacement. Developers should prefer `const` when:

- The value is known at compile time
- Performance-critical code benefits from inlining
- The value should be baked into the binary

---

## Open Questions

1. **Const functions?** - Should we allow `const fn` for compile-time evaluation?
2. **Const generics?** - `class Buffer[const N: Int]` for compile-time sizes?
3. **String interning?** - Should `const` strings be automatically interned?

---

## References

- [Variables and Constants Guide](../en/guide/variables.md)
- [Feature Parity](../feature-parity.md)
