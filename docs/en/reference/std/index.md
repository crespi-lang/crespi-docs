# Standard Library

> **Language:** [Espanol](../../../es/referencia/std/index.md) | English

---

Crespi's standard library is organized into six modules. All functions are also available globally for convenience, but importing from `std.*` modules provides better organization and discoverability.

## Modules

| Module | Description | Functions |
|--------|-------------|-----------|
| [std.io](io.md) | Input/Output | `print`, `read` |
| [std.convert](convert.md) | Type conversions | `str`, `int`, `float`, `typeof` |
| [std.math](math.md) | Mathematics | 25 functions + `PI`, `E` constants |
| [std.string](string.md) | String manipulation | 10 methods |
| [std.collections](collections.md) | Collection operations | 16 methods |
| [std.functional](functional.md) | Functional programming | `memoize`, `inline` |

---

## Importing

### Selective Import

```crespi
import std.math { sqrt, PI }
import std.string { trim, uppercase }

var radius = 5.0
var area = PI * radius * radius
print("Area: " + str(area))
```

### Module Alias

```crespi
import std.math as m

var result = m.sqrt(16) + m.pow(2, 10)
print(result)  // 1028
```

### Qualified Access (No Import)

```crespi
var len = std.collections.length([1, 2, 3])
print(len)  // 3
```

---

## Global Access

All standard library functions are also available globally without imports:

```crespi
// No import needed
print("Hello!")
var x = sqrt(16)
var nums = [1, 2, 3].map(n => n * 2)
```

---

## Quick Reference

### I/O

| Function | Description |
|----------|-------------|
| `print(value)` | Print to stdout |
| `read()` | Read line from stdin |

### Conversions

| Function | Description |
|----------|-------------|
| `str(value)` | Convert to string |
| `int(value)` | Convert to integer |
| `float(value)` | Convert to float |
| `typeof(value)` | Get type name |

### Math

| Function | Description |
|----------|-------------|
| `abs(x)` | Absolute value |
| `sqrt(x)` | Square root |
| `pow(base, exp)` | Power |
| `round(x)` | Round to nearest |
| `floor(x)` / `ceil(x)` | Round down/up |
| `sin(x)` / `cos(x)` / `tan(x)` | Trigonometry |
| `exp(x)` / `ln(x)` | Exponential/logarithm |
| `random()` | Random 0.0-1.0 |
| `PI` / `E` | Constants |

### Strings (Methods)

| Method | Description |
|--------|-------------|
| `s.split(delim)` | Split string |
| `s.trim()` | Remove whitespace |
| `s.uppercase()` / `s.lowercase()` | Case conversion |
| `s.substring(start, end?)` | Extract substring |
| `s.replace(old, new)` | Replace all |
| `s.starts_with(prefix)` / `s.ends_with(suffix)` | Check prefix/suffix |

### Collections (Methods)

| Method | Description |
|--------|-------------|
| `c.length()` | Get length |
| `list.push(v)` / `list.pop()` | Add/remove |
| `dict.keys()` / `dict.values()` | Dictionary access |
| `c.contains(v)` | Check membership |
| `list.map(fn)` / `list.filter(fn)` | Transform |
| `list.reduce(fn, init?)` | Aggregate |
| `list.sort(cmp?)` / `list.reverse()` | Order |

### Functional

| Function | Description |
|----------|-------------|
| `memoize(fn)` | Cache function results |
| `@memoize` | Decorator form |
| `@inline` | Compiler inlining hint |

---

## See Also

- [Built-in Functions](../functions.md) - Complete flat reference
- [Data Types](../types.md)
- [Keywords](../keywords.md)
