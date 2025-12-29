# Roadmap: Standard Library Modules

> **Status:** Planned
> **Priority:** Medium
> **Affects:** Runtime, Interpreter, Compiler, Documentation

---

## Summary

Organize Crespi's built-in functions and types into a structured standard library with proper namespacing. Currently, all 60+ built-ins are in the global scope. A standard library provides better organization, discoverability, and room for growth.

---

## Current State

### Global Built-ins (60+)

All functions available globally:

```crespi
print("hello")           // I/O
var len = length([1,2])  // Collections
var sq = sqrt(16)        // Math
var upper = uppercase("hi")  // Strings
```

### Problems

1. **Namespace pollution** - All names reserved globally
2. **Discoverability** - Hard to find related functions
3. **Naming conflicts** - User can't define `print`, `length`, etc.
4. **No hierarchy** - Flat structure doesn't scale
5. **Documentation** - No logical grouping

---

## Proposed Structure

```
std
├── io
│   ├── print
│   ├── read
│   └── File (future)
├── math
│   ├── abs, sign, sqrt, cbrt, pow
│   ├── round, floor, ceil, truncate
│   ├── min, max
│   ├── sin, cos, tan, asin, acos, atan, atan2
│   ├── exp, ln, log10, log2
│   ├── hypot
│   ├── random, random_seed
│   ├── PI, E
│   └── (future: Complex, BigInt)
├── string
│   ├── split, trim, join
│   ├── uppercase, lowercase
│   ├── substring, replace
│   ├── starts_with, ends_with, index_of
│   └── (future: Regex)
├── collections
│   ├── length, push, pop
│   ├── keys, values, contains
│   ├── map, filter, reduce
│   ├── sort, reverse, slice
│   ├── find, every, some, flatten
│   └── (future: Set, Queue, Stack)
├── convert
│   ├── str, int, float
│   └── typeof
├── functional
│   ├── memoize
│   └── (future: compose, curry, partial)
├── async (future)
│   ├── Task
│   ├── sleep
│   └── spawn
├── fs (future)
│   ├── read_file, write_file
│   ├── exists, mkdir, rmdir
│   └── Path
├── net (future)
│   ├── http
│   └── tcp, udp
└── json (future)
    ├── parse
    └── stringify
```

---

## Usage Patterns

### Explicit Imports

```crespi
import std.math { sqrt, PI }
import std.string { split, join }

var radius = 5
var area = PI * radius * radius
var circumference = 2 * PI * radius
```

### Module Alias

```crespi
import std.math as m

var result = m.sqrt(16) + m.pow(2, 10)
```

### Wildcard Import

```crespi
import std.math { * }  // Import all from math

var x = sin(PI / 2)
```

### Qualified Access

```crespi
// No import needed
var len = std.collections.length([1, 2, 3])
```

---

## Backward Compatibility

### Phase 1: Dual Access

All current built-ins remain global AND available via `std.*`:

```crespi
// Both work
print("hello")
std.io.print("hello")

sqrt(16)
std.math.sqrt(16)
```

### Phase 2: Deprecation Warnings (Optional)

With `--strict` flag, warn on global access:

```
warning: 'sqrt' is deprecated as a global function
  --> src/main.crespi:5:9
   |
 5 | var x = sqrt(16)
   |         ^^^^ use 'std.math.sqrt' or import from std.math
```

### Phase 3: Future Consideration

Eventually, new additions go to `std.*` only, not global scope.

---

## Implementation Plan

### Phase 1: Module System

Create `std` as a virtual module that maps to built-in registry:

```rust
// In interpreter/compiler
fn resolve_std_module(path: &[String]) -> Option<ModuleExports> {
    match path.as_slice() {
        ["std", "math"] => Some(math_module_exports()),
        ["std", "io"] => Some(io_module_exports()),
        ["std", "string"] => Some(string_module_exports()),
        ["std", "collections"] => Some(collections_module_exports()),
        ["std", "convert"] => Some(convert_module_exports()),
        ["std", "functional"] => Some(functional_module_exports()),
        _ => None,
    }
}
```

### Phase 2: Built-in Registry Reorganization

Group built-ins by module:

```rust
pub struct StdLib {
    pub math: MathModule,
    pub io: IoModule,
    pub string: StringModule,
    pub collections: CollectionsModule,
    pub convert: ConvertModule,
    pub functional: FunctionalModule,
}

impl MathModule {
    pub fn functions() -> Vec<BuiltinFn> {
        vec![
            builtin_fn!("sqrt", math_sqrt),
            builtin_fn!("abs", math_abs),
            builtin_fn!("sin", math_sin),
            // ...
        ]
    }

    pub fn constants() -> Vec<(&'static str, Value)> {
        vec![
            ("PI", Value::Float(std::f64::consts::PI)),
            ("E", Value::Float(std::f64::consts::E)),
        ]
    }
}
```

### Phase 3: Import Resolution

Update import system to handle `std.*`:

```crespi
import std.math { sqrt, PI }
```

Resolves to built-in functions, not file system lookup.

### Phase 4: Documentation Generation

Auto-generate docs from module structure:

```
docs/en/reference/std/
├── index.md
├── math.md
├── io.md
├── string.md
├── collections.md
├── convert.md
└── functional.md
```

### Phase 5: LSP Integration

Provide completions and hover info for `std.*`:

```
std.math.<cursor>
  sqrt(x) -> Float    Square root
  abs(x) -> Number    Absolute value
  sin(x) -> Float     Sine function
  ...
```

---

## Module Details

### std.math

```crespi
// Constants
PI: Float  // 3.14159...
E: Float   // 2.71828...

// Basic
fn abs(x: Number) -> Number
fn sign(x: Number) -> Int
fn min(a: Number, b: Number) -> Number
fn max(a: Number, b: Number) -> Number

// Powers and roots
fn sqrt(x: Float) -> Float
fn cbrt(x: Float) -> Float
fn pow(base: Number, exp: Number) -> Float

// Rounding
fn round(x: Float) -> Int
fn floor(x: Float) -> Int
fn ceil(x: Float) -> Int
fn truncate(x: Float) -> Int

// Trigonometry
fn sin(x: Float) -> Float
fn cos(x: Float) -> Float
fn tan(x: Float) -> Float
fn asin(x: Float) -> Float
fn acos(x: Float) -> Float
fn atan(x: Float) -> Float
fn atan2(y: Float, x: Float) -> Float

// Exponential and logarithmic
fn exp(x: Float) -> Float
fn ln(x: Float) -> Float
fn log10(x: Float) -> Float
fn log2(x: Float) -> Float

// Other
fn hypot(x: Float, y: Float) -> Float
fn random() -> Float
fn random_seed(seed: Int)
```

### std.io

```crespi
fn print(value: Any)
fn read() -> String
```

### std.string

```crespi
fn split(s: String, delimiter: String) -> [String]
fn join(parts: [String], separator: String) -> String
fn trim(s: String) -> String
fn uppercase(s: String) -> String
fn lowercase(s: String) -> String
fn substring(s: String, start: Int, end: Int?) -> String
fn replace(s: String, old: String, new: String) -> String
fn starts_with(s: String, prefix: String) -> Bool
fn ends_with(s: String, suffix: String) -> Bool
fn index_of(s: String, needle: String) -> Int?
```

### std.collections

```crespi
fn length[T](collection: [T]) -> Int
fn push[T](list: [T], item: T)
fn pop[T](list: [T]) -> T?
fn keys[K, V](dict: [K: V]) -> [K]
fn values[K, V](dict: [K: V]) -> [V]
fn contains[T](collection: [T], item: T) -> Bool

// Functional
fn map[T, U](list: [T], f: (T) -> U) -> [U]
fn filter[T](list: [T], predicate: (T) -> Bool) -> [T]
fn reduce[T, U](list: [T], initial: U, f: (U, T) -> U) -> U
fn sort[T](list: [T], comparator: ((T, T) -> Int)?) -> [T]
fn reverse[T](list: [T]) -> [T]
fn slice[T](list: [T], start: Int, end: Int?) -> [T]
fn find[T](list: [T], predicate: (T) -> Bool) -> T?
fn every[T](list: [T], predicate: (T) -> Bool) -> Bool
fn some[T](list: [T], predicate: (T) -> Bool) -> Bool
fn flatten[T](nested: [[T]]) -> [T]
```

### std.convert

```crespi
fn str(value: Any) -> String
fn int(value: Any) -> Int
fn float(value: Any) -> Float
fn typeof(value: Any) -> String
```

### std.functional

```crespi
fn memoize[T, R](f: (T) -> R) -> (T) -> R
```

---

## Future Modules

These would be added as the language matures:

- **std.async** - Task scheduling, sleep, spawn
- **std.fs** - File system operations
- **std.net** - Networking (HTTP, TCP, UDP)
- **std.json** - JSON parsing and serialization
- **std.regex** - Regular expressions
- **std.time** - Date and time utilities
- **std.crypto** - Hashing, encryption (via FFI)

---

## References

- [Built-in Functions](../feature-parity.md#built-in-functions-60)
- [Module Imports](../en/guide/advanced.md)
- [Feature Parity](../feature-parity.md)
