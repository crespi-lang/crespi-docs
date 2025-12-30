# Standard Library (std)

> **Language:** [Español](../../es/guia/biblioteca-estandar.md) | English

---

Crespi groups built-in functions into virtual `std.*` modules. These modules are available without files on disk, and global builtins still work for backward compatibility.

## Importing from std

```crespi
import std.math { sqrt, PI }
import std.string as s

var area = PI * 4 * 4
print(s.trim("  hi  "))
```

## Qualified access

```crespi
var root = std.math.sqrt(81)
var size = std.collections.length([1, 2, 3])
```

## Modules

- `std.io`: `print`, `read` (alias `input`)
- `std.convert`: `str`, `int`, `float`, `typeof`
- `std.math`: math functions plus `PI` and `E`
- `std.string`: string helpers like `trim`, `split`, `replace`, `starts_with`
- `std.collections`: collection helpers like `length`, `contains`, `map`, `filter`, `reduce`
- `std.functional`: `memoize`, `inline`

## Method syntax still works

The module functions are the same builtins, so method syntax still works:

```crespi
var doubled = [1, 2, 3].map { x -> x * 2 }
var name = "  Ana  ".trim()
```

## Backward compatibility

```crespi
print("hello")
std.io.print("hello")

sqrt(16)
std.math.sqrt(16)
```
