# Roadmap: Dictionary Literal Parsing

> **Status:** Planned
> **Priority:** High (6 tests blocked)
> **Affects:** Lexer, Parser, AST, Interpreter, Compiler

---

## Summary

Implement parsing for dictionary literal syntax `["key": value, ...]`. Currently, dictionaries can only be created via the `Dict()` constructor or by building them incrementally.

---

## Current State

### What Works

```crespi
// Constructor-based creation
var dict = Dict()
dict["name"] = "Alice"
dict["age"] = 30

// Access and modification
print(dict["name"])  // "Alice"
dict["age"] = 31
```

### What Doesn't Work

```crespi
// Literal syntax - NOT YET IMPLEMENTED
var dict = ["name": "Alice", "age": 30]

// Pattern matching on dictionaries - blocked
when data {
    is ["name": n, "age": a] -> { print(n) }
    default -> { print("no match") }
}
```

---

## Proposed Syntax

Following Swift's bracket-based dictionary syntax:

```crespi
// Empty dictionary
var empty = [:]

// String keys (most common)
var person = ["name": "Alice", "age": 30, "active": true]

// Nested dictionaries
var config = [
    "database": ["host": "localhost", "port": 5432],
    "cache": ["enabled": true, "ttl": 3600]
]

// Trailing comma allowed
var settings = [
    "debug": true,
    "verbose": false,
]
```

### Type Annotations

```crespi
var scores: [String: Int] = ["alice": 100, "bob": 85]
var empty: [String: Any] = [:]
```

---

## Grammar Changes

Current grammar (not implemented):

```antlr
dictLiteral
  : '[' ':' ']'                              // empty dict
  | '[' dictEntry (',' dictEntry)* ','? ']'  // non-empty
  ;

dictEntry
  : expression ':' expression
  ;
```

### Disambiguation from Arrays

The parser must distinguish:
- `[1, 2, 3]` - array literal
- `["a": 1]` - dictionary literal
- `[:]` - empty dictionary
- `[]` - empty array

Lookahead strategy:
1. After `[`, if next is `:` and then `]` → empty dict
2. After `[`, parse first expression
3. If followed by `:` → dictionary entry, continue as dict
4. Otherwise → array element, continue as array

---

## Implementation Plan

### Phase 1: Lexer

No changes needed - `[`, `]`, `:`, `,` already tokenized.

### Phase 2: Parser

1. In `parse_primary()`, handle `LeftBracket`:
   - Check for `[:]` (empty dict)
   - Parse first expression
   - If `:` follows → `parse_dictionary_literal()`
   - Otherwise → `parse_array_literal()`

2. Implement `parse_dictionary_literal()`:
   - Parse key-value pairs separated by `,`
   - Allow trailing comma
   - Return `Expr::DictLiteral`

### Phase 3: AST

Add or update:

```rust
pub enum Expr {
    // ...
    DictLiteral {
        entries: Vec<(Expr, Expr)>,
        span: Span,
    },
}
```

### Phase 4: Interpreter

In `interpret_expr()`:

```rust
Expr::DictLiteral { entries, .. } => {
    let mut dict = HashMap::new();
    for (key_expr, val_expr) in entries {
        let key = self.interpret_expr(key_expr)?;
        let val = self.interpret_expr(val_expr)?;
        dict.insert(key.to_string(), val);
    }
    Ok(Value::Dict(dict))
}
```

### Phase 5: Compiler (HIR/LLVM)

1. Lower `Expr::DictLiteral` to HIR `DictLiteral` node
2. In LLVM codegen, emit calls to dict construction runtime functions

### Phase 6: Pattern Matching

Enable dictionary destructuring in `when`:

```crespi
when data {
    is ["name": n, "age": a] -> { print("$n is $a years old") }
    is ["error": msg] -> { print("Error: $msg") }
    default -> { print("unknown") }
}
```

---

## Test Cases to Unblock

Once implemented, these tests should pass:

1. `test_dictionary` - Basic dictionary literal creation
2. `test_dictionary_assignment` - Literal with assignment
3. `test_cuando_dict_destructuring` - Pattern matching on dicts
4. `test_enums_in_dictionaries` - Enums as dictionary values
5. `test_issue3_string_interpolation_with_brackets` - Interpolation in dict keys
6. `test_issue3_nested_interpolation` - Nested interpolation

---

## Edge Cases

### Mixed Key Types

```crespi
// Should this be allowed?
var mixed = [1: "one", "two": 2]  // Int and String keys
```

Decision: Allow for now (dynamic typing), but type checker can warn.

### Computed Keys

```crespi
var prefix = "user_"
var data = [prefix + "name": "Alice"]  // Computed key
```

Should work - keys are expressions.

### Duplicate Keys

```crespi
var dup = ["a": 1, "a": 2]  // Last wins? Error?
```

Decision: Last value wins (like JavaScript/Python), no error.

---

## References

- [Collections Guide](../en/guide/collections.md)
- [Pattern Matching Guide](../en/guide/pattern-matching.md)
- [Feature Parity](../feature-parity.md)
