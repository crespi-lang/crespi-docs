# Roadmap: Exhaustive Pattern Matching

> **Status:** Planned
> **Priority:** Medium
> **Affects:** Parser, Type Checker, Interpreter, Compiler

---

## Summary

Implement exhaustiveness checking for `when` expressions so that the compiler/interpreter can verify all possible cases are handled, eliminating the need for a `default` branch when all variants are covered.

---

## Current State

### What Works

```crespi
enum Color {
    case red, green, blue
}

var c = Color.red

// Must include default even if all cases covered
when c {
    case .red -> { print("red") }
    case .green -> { print("green") }
    case .blue -> { print("blue") }
    default -> { print("unreachable") }  // Required but never executed
}
```

### Problem

The `default` branch is always required, even when:
- All enum variants are explicitly handled
- The match is provably exhaustive
- The default case is unreachable

This leads to:
- Boilerplate code
- Silent bugs when new variants are added (default catches them)
- No compiler warning for unhandled cases

---

## Proposed Behavior

### Exhaustive Enum Matching

```crespi
enum Direction {
    case north, south, east, west
}

var dir = Direction.north

// No default needed - all cases covered
when dir {
    case .north -> { print("N") }
    case .south -> { print("S") }
    case .east -> { print("E") }
    case .west -> { print("W") }
}
```

### Missing Case Error

```crespi
when dir {
    case .north -> { print("N") }
    case .south -> { print("S") }
    // Error: Non-exhaustive match. Missing cases: east, west
}
```

### Default Still Allowed

```crespi
// Explicit default when you only care about some cases
when dir {
    case .north -> { print("going up") }
    default -> { print("other direction") }
}
```

### Associated Values

```crespi
enum Result[T, E] {
    case ok(T)
    case err(E)
}

var result = Result.ok(42)

when result {
    case .ok(value) -> { print("Success: $value") }
    case .err(error) -> { print("Error: $error") }
}
// Exhaustive - no default needed
```

---

## Implementation Plan

### Phase 1: Enum Variant Tracking

Track all variants when defining an enum:

```rust
struct EnumDef {
    name: String,
    variants: Vec<EnumVariant>,
    // ...
}

struct EnumVariant {
    name: String,
    associated_types: Vec<Type>,
}
```

### Phase 2: Pattern Analysis

For each `when` expression:

1. Determine the type being matched
2. If it's an enum, collect all variants
3. Track which variants are covered by case branches
4. If `default` present → exhaustive
5. If all variants covered → exhaustive
6. Otherwise → report missing variants

```rust
fn check_exhaustiveness(
    matched_type: &Type,
    cases: &[WhenCase],
    has_default: bool,
) -> Result<(), Vec<String>> {
    if has_default {
        return Ok(());
    }

    let Type::Enum(enum_def) = matched_type else {
        // Non-enum types require default
        return Err(vec!["default branch required for non-enum types".into()]);
    };

    let covered: HashSet<_> = cases.iter()
        .filter_map(|c| c.variant_name())
        .collect();

    let all_variants: HashSet<_> = enum_def.variants.iter()
        .map(|v| &v.name)
        .collect();

    let missing: Vec<_> = all_variants.difference(&covered).collect();

    if missing.is_empty() {
        Ok(())
    } else {
        Err(missing.iter().map(|s| s.to_string()).collect())
    }
}
```

### Phase 3: Nested Pattern Exhaustiveness

Handle nested patterns:

```crespi
enum Outer {
    case a(Inner)
    case b
}

enum Inner {
    case x, y
}

when outer {
    case .a(.x) -> { }
    case .a(.y) -> { }
    case .b -> { }
}
// All combinations covered
```

This requires:
- Expanding nested enum patterns
- Computing cartesian product of possibilities
- Checking all combinations are covered

### Phase 4: Wildcard Patterns

Support `_` as a catch-all for specific positions:

```crespi
when outer {
    case .a(_) -> { }  // Covers .a(.x) and .a(.y)
    case .b -> { }
}
// Exhaustive
```

### Phase 5: Guard Clause Interaction

Guards make exhaustiveness undecidable in general:

```crespi
when value {
    case .some(x) if x > 0 -> { }
    case .some(x) if x <= 0 -> { }
    case .none -> { }
}
// Logically exhaustive, but compiler can't prove it
```

Decision: Require `default` when guards are present, or use `case .some(x)` without guard as catch-all.

---

## Error Messages

### Missing Variants

```
error: non-exhaustive pattern match
  --> src/main.crespi:15:1
   |
15 | when direction {
   | ^^^^ missing cases: east, west
   |
   = help: add the missing cases or use 'default' to handle them
```

### Unreachable Default

```
warning: unreachable default branch
  --> src/main.crespi:20:5
   |
20 |     default -> { print("never") }
   |     ^^^^^^^ all enum variants are already covered
   |
   = help: remove the default branch or remove redundant case branches
```

### Redundant Case

```
warning: redundant case branch
  --> src/main.crespi:18:5
   |
18 |     case .red -> { print("red again") }
   |     ^^^^^^^^^ this case is already covered above
```

---

## Type Checker Integration

Exhaustiveness checking integrates with the optional type checker:

- **Without type checker**: Runtime error if no branch matches (current behavior)
- **With type checker (`--check`)**: Compile-time exhaustiveness verification

```bash
crespi --check src/main.crespi
# Reports exhaustiveness errors/warnings
```

---

## Non-Enum Types

For non-enum types, `default` is always required:

```crespi
when value {
    is Int -> { }
    is String -> { }
    default -> { }  // Required - can't enumerate all types
}
```

Exception: Boolean could be made exhaustive:

```crespi
when flag {
    case true -> { }
    case false -> { }
}
// Could be exhaustive (only 2 values)
```

---

## References

- [Pattern Matching Guide](../en/guide/pattern-matching.md)
- [Enums Guide](../en/guide/enums.md)
- [Feature Parity](../feature-parity.md)
