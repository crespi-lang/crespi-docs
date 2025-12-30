# Roadmap: Anonymous Functions (`fn`)

> **Status:** Completed
> **Completed:** December 2025
> **Priority:** Medium
> **Affects:** Lexer, Parser, AST, HIR, Interpreter, Compiler, Type Checker

---

## Summary

Add anonymous function expressions using the `fn` keyword. Unlike lambdas (`{ x -> expr }`), anonymous functions support full function features including type annotations, default parameters, and explicit return types.

---

## Motivation

Crespi currently has two ways to create callable values:

| Syntax | Type Annotations | Default Params | Named |
|--------|------------------|----------------|-------|
| `fn name(x) = expr` | Yes | Yes | Yes |
| `{ x -> expr }` | No | No | No |

**Gap:** There's no way to create an anonymous callable with default parameters or type annotations.

### Use Cases

1. **Higher-order functions with typed callbacks**
   ```crespi
   var handler = fun(event: Event) -> Bool { return event.handled }
   ```

2. **Anonymous functions with default parameters**
   ```crespi
   var greet = fun(name: String = "World") = "Hello, " + name
   greet()       // "Hello, World"
   greet("Izan") // "Hello, Izan"
   ```

3. **Inline function definitions for clarity**
   ```crespi
   var comparator = fun(a: Int, b: Int) -> Int {
       if a < b { return -1 }
       if a > b { return 1 }
       return 0
   }
   list.sort(comparator)
   ```

4. **Immediately invoked function expressions (IIFE)**
   ```crespi
   var result = fun(x: Int = 10) = x * x ()
   ```

---

## Proposed Syntax

### Single-Expression Form

```crespi
// With type annotations
var double = fun(x: Int) -> Int = x * 2

// With default parameters
var scale = fun(x: Int, factor: Int = 2) = x * factor

// Combined
var format = fun(value: Int, prefix: String = "") -> String = prefix + str(value)
```

### Block Body Form

```crespi
// Full block body with explicit return type
var factorial = fun(n: Int) -> Int {
    if n <= 1 {
        return 1
    }
    return n * factorial(n - 1)
}

// Block body with default params
var logger = fun(message: String, level: String = "INFO") -> Void {
    print("[" + level + "] " + message)
}
```

### Grammar

```
anon_function := 'fun' '(' parameters ')' ('->' type)? ('=' expression | block)
parameters    := (parameter (',' parameter)*)?
parameter     := identifier (':' type)? ('=' expression)?
```

---

## Comparison: Lambdas vs Anonymous Functions

| Feature | Lambda `{ x -> expr }` | Anonymous `fun(x) = expr` |
|---------|------------------------|---------------------------|
| Concise syntax | Yes | No |
| Type annotations | No | Yes |
| Default parameters | No | Yes |
| Return type | Inferred only | Explicit or inferred |
| Block body | Yes (`{ x -> { ... } }`) | Yes |
| Best for | Short callbacks | Complex typed functions |

### When to Use Each

**Use lambdas when:**
- Short, single-purpose callbacks
- Type is inferred from context (e.g., `list.map({ x -> x * 2 })`)
- No default parameters needed

**Use anonymous functions when:**
- Need default parameters
- Want explicit type documentation
- Complex logic requiring block body
- Type context is unclear

---

## Implementation Plan

### Phase 1: Lexer

1. Add `TokenKind::Fun` keyword
2. Add Spanish alias `funcion` (if using language packs)

### Phase 2: Parser

1. Parse `fun(params) = expr` as `ExprKind::AnonFunction`
2. Parse `fun(params) -> Type { block }` variant
3. Support full parameter syntax (types, defaults)
4. Reuse existing parameter parsing from function declarations

### Phase 3: AST

Add new expression kind:
```rust
AnonFunction {
    params: Vec<Parameter>,
    return_type: Option<TypeExpr>,
    body: AnonFunctionBody,
}

enum AnonFunctionBody {
    Expression(Box<Expr>),
    Block(Vec<Stmt>),
}
```

### Phase 4: Type Checker

1. Infer function type from parameters and body
2. Validate default parameter types
3. Check return type matches body expression
4. Generate `Type::Function` with full signature

### Phase 5: Interpreter

1. Evaluate to `Value::Function` (same as named functions)
2. Handle default parameter evaluation at call time
3. Support closures (capture environment)

### Phase 6: Compiler (HIR/LLVM)

1. Lower to same IR as named functions
2. Generate unique symbol for each anonymous function
3. Handle captures in closure environment

---

## Edge Cases

### Ambiguity with Parenthesized Expressions

```crespi
// This is an anonymous function
var f = fun(x) = x * 2

// This is NOT ambiguous (fun is a keyword)
var g = fun(x + y)  // Error: expected parameter name
```

### Recursive Anonymous Functions

Anonymous functions cannot be directly recursive (no name to call). Use assignment with reference:

```crespi
// Works: assigned to variable first
var fib: (Int) -> Int = null
fib = fun(n: Int) -> Int {
    if n <= 1 { return n }
    return fib(n - 1) + fib(n - 2)
}

// Alternative: use named function
fn fib(n: Int) -> Int = if n <= 1 { n } else { fib(n-1) + fib(n-2) }
```

### IIFE (Immediately Invoked)

```crespi
// Immediately call with ()
var result = fun(x: Int = 5) = x * x ()  // result = 25

// With arguments
var sum = fun(a: Int, b: Int) = a + b (3, 4)  // sum = 7
```

---

## Comparison with Other Languages

| Language | Syntax | Default Params |
|----------|--------|----------------|
| Kotlin | `fun(x: Int) = x * 2` | Yes |
| Swift | `{ (x: Int) -> Int in x * 2 }` | No |
| Rust | `\|x: i32\| x * 2` | No |
| TypeScript | `(x: number) => x * 2` | Yes |
| **Crespi** | `fun(x: Int) = x * 2` | **Yes** |

---

## Migration Notes

This is an additive feature. Existing code using lambdas remains valid.

**Recommendation:** Use lambdas for simple callbacks, anonymous functions when you need:
- Type annotations for clarity
- Default parameter values
- Explicit return types

---

## Open Questions

1. **Keyword choice:** `fun` vs `func` vs `fn` (for expressions)?
2. **Trailing syntax:** Allow `fun(x) -> Int { }` and `fun(x): Int { }`?
3. **Generic anonymous functions:** `fun[T](x: T) = x`?

---

## References

- [Functions Guide](../en/guide/functions.md)
- [Lambdas Guide](../en/guide/lambdas.md) (if exists)
- [Type System](../en/guide/types.md)
