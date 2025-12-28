# Data Types

> **Language:** [Español](../../es/referencia/tipos.md) | English

---

Crespi is **dynamically typed** at runtime, with an **optional static type checker** that uses type inference. Types are only enforced when you opt into the checker (for example with `--check`).

## Type Annotations

Crespi supports type annotations with Rust-style syntax. When the optional checker runs, types are inferred from context.

### Variable Type Annotations

```crespi
// With explicit type
var name: String = "Alice"
var age: Int = 25
var active: Bool = true

// Type inference (when running the checker)
var count = 42           // Inferred: Int
var pi = 3.14            // Inferred: Float
var list = [1, 2, 3]     // Inferred: List[Int]

Mixed-type list literals are inferred as `List[Any]`.

With the checker enabled, a variable's inferred or annotated type must remain consistent. Without it, reassignment can use any type at runtime.
```

### Function Type Annotations

```crespi
// Fully typed function
fn add(a: Int, b: Int) -> Int {
    return a + b
}

// With default values
fn greet(name: String = "World") -> String {
    return "Hello, " + name
}

// Generic function with constraints
fn [T: Numeric] max(a: T, b: T) -> T {
    if a > b { return a }
    return b
}
```

### Nullable Types

```crespi
// Nullable type annotation with ?
var result: String? = null

// Null coalescing operator
var value = result ?? "default"
```

### Union Types

```crespi
// Union type annotation with |
fn parse(input: String) -> Int | Error {
    // Can return either Int or Error
}
```
Union types are **order-insensitive** in the static checker, so `Int | String` and
`String | Int` are treated as the same type.
Values of a member type are assignable to the union (for example, `Int` can be
used where `Int | String` is expected).

### Class Type Annotations

```crespi
class Point(let x: Int, let y: Int) {
    fn distance() -> Float {
        return sqrt(float(this.x * this.x + this.y * this.y))
    }
}
```

### Generic Types

```crespi
class Container[T](let value: T) {
    fn get() -> T {
        return this.value
    }
}
```

---

## Type Table

### Static Types (for annotations)

| Type | Description | Example |
|------|-------------|---------|
| `Int` | 64-bit signed integer (default) | `42` |
| `Int32`, `Int16`, `Int8` | Specific width signed integers | `100: Int32` |
| `UInt`, `UInt32`, `UInt16`, `UInt8` | Unsigned integers | `50: UInt` |
| `Double` | 64-bit floating-point (default) | `3.14` |
| `Float` | 32-bit floating-point | `3.14: Float` |
| `String` | UTF-8 string | `"Hello"` |
| `Bool` | True or false value | `true` |
| `Null` | Absence of value | `null` |
| `Unit` | No value (like void) | `fn f() -> Unit` |
| `Any` | Top type (accepts anything) | `var x: Any` |
| `Never` | Bottom type (no values) | `fn fail() -> Never` |
| `List[T]` | Dynamic array of type T | `[1, 2]: List[Int]` |
| `(T1, T2)` | Fixed-size tuple | `(1, "a"): (Int, String)` |
| `Dict[K, V]` | Text-keyed map | `{"a": 1}: Dict[String, Int]` |

### Runtime Type Names (from `typeof()`)

| Name | Values |
|------|--------|
| `"int"` | All signed/unsigned integers |
| `"float"` | `Double` and `Float` |
| `"string"` | `String` |
| `"bool"` | `Bool` |
| `"null"` | `Null` |
| `"list"` | `List[T]` |
| `"tuple"` | `(T1, T2)` |
| `"dict"` | `Dict[K, V]` |
| `"function"` | Functions and lambdas |
| `"instance"` | Class instances |

---

## Numeric Types

Crespi uses explicit-width numeric types and follows Swift's naming convention for floating-point numbers.

### Integers

| Type | Width | Range |
|------|-------|-------|
| `Int` | 64-bit | -9.22e18 to 9.22e18 |
| `Int32` | 32-bit | -2.14e9 to 2.14e9 |
| `Int16` | 16-bit | -32,768 to 32,767 |
| `Int8` | 8-bit | -128 to 127 |
| `UInt` | 64-bit | 0 to 1.84e19 |
| `UInt32` | 32-bit | 0 to 4.29e9 |
| `UInt16` | 16-bit | 0 to 65,535 |
| `UInt8` | 8-bit | 0 to 255 |

### Floating-Point

| Type | Width | Description |
|------|-------|-------------|
| `Double` | 64-bit | Default float type (IEEE 754) |
| `Float` | 32-bit | Single precision float |

### Strict Typing

Crespi **does not** perform implicit numeric coercion. You must use explicit conversion functions or methods if you want to assign an `Int32` to an `Int`, or an `Int` to a `Double`.

```crespi
var i: Int = 42
var d: Double = i.toDouble() // OK
// var d2: Double = i        // Error: Type mismatch
```

---

## Primitive Types

### `int`

Signed 64-bit integers. Range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807.

```crespi
var age = 25
var negative = -100
var zero = 0
var large = 9223372036854775807

print(typeof(age))  // int
```

**Operations:**
- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Comparison: `<`, `>`, `<=`, `>=`, `==`, `!=`

### `float`

64-bit floating-point numbers (IEEE 754 double precision).

```crespi
var pi = 3.14159
var temperature = -5.5
var scientific = 1.5e10  // Scientific notation: 1.5 × 10¹⁰

print(typeof(pi))  // float
```

**Note on division:**
```crespi
print(10 / 3)     // 3 (integer division)
print(10.0 / 3)   // 3.333... (float division)
print(10 / 3.0)   // 3.333...
```

### `string`

Immutable character strings encoded in UTF-8.

```crespi
var greeting = "Hello, World"
var multiline = "Line 1
Line 2"
var with_escape = "Says: \"Hello\""
var with_tabs = "Col1\tCol2"

print(typeof(greeting))   // string
print(greeting.length())   // 12
```

**Escape sequences:**
| Sequence | Meaning |
|----------|---------|
| `\\` | Backslash |
| `\"` | Double quote |
| `\n` | Newline |
| `\t` | Tab |
| `\r` | Carriage return |
| `\$` | Literal dollar sign |

**String interpolation:**
```crespi
var name = "Ana"
var total = 3
print("Hello, $name")            // Hello, Ana
print("Total: ${total + 1}")     // Total: 4
```

**Raw (triple-quoted) strings:**
```crespi
var multiline = """Line 1
Line 2"""

var price = 5
print("""Cost: $$${price}""")   // Cost: $5
```

**Operations:**
```crespi
// Concatenation
var full = "Hello" + " " + "World"

// Character access (iteration)
for letter in "ABC" {
    print(letter)  // A, B, C
}

// Search
print("Hello World".contains("World"))  // true
```

### `bool`

Logical values: `true` or `false`.

```crespi
var active = true
var finished = false

print(typeof(active))  // bool
```

**Truthiness (conversion to boolean):**

| Type | Falsy Value | Truthy Value |
|------|-------------|--------------|
| `bool` | `false` | `true` |
| `int` | `0` | Any other |
| `float` | `0.0` | Any other |
| `string` | `""` (empty) | Non-empty |
| `list` | `[]` (empty) | Non-empty |
| `tuple` | (no empty literal) | Always truthy |
| `null` | Always | - |

```crespi
// In conditions
if 1 { print("true") }      // Executes
if 0 { print("not seen") }  // Does not execute
if "hello" { print("yes") } // Executes
if "" { print("no") }       // Does not execute
```

### `null`

Represents the absence of a value. Similar to `null` or `nil` in other languages.

```crespi
var result = null

fn find(list, target) {
    for item in list {
        if item == target {
            return item
        }
    }
    return null
}

var found = find([1, 2, 3], 5)
if found == null {
    print("Not found")
}
```

---

## Collection Types

### `list`

Dynamic array that can contain elements of any type.

```crespi
// Creation
var empty = []
var numbers = [1, 2, 3, 4, 5]
var mixed = [1, "two", true, null, [1, 2]]

print(typeof(numbers))  // list
```

**Element access:**
```crespi
var list = [10, 20, 30, 40, 50]

// Positive indices (from start)
print(list[0])   // 10 (first element)
print(list[2])   // 30

// Negative indices (from end)
print(list[-1])  // 50 (last element)
print(list[-2])  // 40
```

### `tuple`

Fixed-size ordered collection. Tuples use parentheses with commas, and a single-element
tuple requires a trailing comma.

```crespi
var point = (3, 4)
var single = (1,)

print(typeof(point))    // tuple
print(point.length())    // 2
print(point[0])         // 3
print(point[-1])        // 4
```

**Modification:**
```crespi
var list = [1, 2, 3]

// Modify element
list[0] = 100
print(list)  // [100, 2, 3]

// Append to end
list.push(4)
print(list)  // [100, 2, 3, 4]

// Remove from end
var last = list.pop()
print(last)  // 4
print(list)  // [100, 2, 3]
```

**Iteration:**
```crespi
var colors = ["red", "green", "blue"]

for color in colors {
    print(color)
}
```

### `dict`

Text-keyed map to values of any type.

```crespi
// Creation
var empty = {}
var person = {
    "name": "Ana",
    "age": 25,
    "active": true
}

print(typeof(person))  // dict
```

**Value access:**
```crespi
var dict = {"a": 1, "b": 2, "c": 3}

print(dict["a"])    // 1
print(dict["b"])    // 2
```

**Modification:**
```crespi
var config = {"theme": "dark"}

// Modify existing value
config["theme"] = "light"

// Add new key
config["language"] = "en"

print(config)  // {theme: light, language: en}
```

**Iteration:**
```crespi
var grades = {"math": 90, "physics": 85, "chemistry": 78}

// Iterate over keys
for subject in grades.keys() {
    print(subject + ": " + str(grades[subject]))
}

// Get values
var vals = grades.values()
print(vals)  // [90, 85, 78]
```

---

## Callable Types

### `function`

User-defined functions.

```crespi
// Standard declaration
fn add(a, b) {
    return a + b
}

// Short syntax (single expression)
fn double(x) = x * 2

// With default values
fn greet(name = "World") {
    print("Hello, " + name)
}

print(typeof(add))  // function
```

**Functions as values:**
```crespi
// Assign to variable
var operation = add
print(operation(3, 4))  // 7

// Pass as argument
fn apply(fn, value) {
    return fn(value)
}
print(apply(double, 5))  // 10

// Return function
fn create_multiplier(factor) {
    fn multiply(x) {
        return x * factor
    }
    return multiply
}
var triple = create_multiplier(3)
print(triple(4))  // 12
```

### `class`

Definition of a type with constructor and methods.

```crespi
class Counter(var value = 0) {
    fn increment() {
        this.value += 1
    }

    fn get() {
        return this.value
    }
}

print(typeof(Counter))  // class
```

### `instance`

Object created from a class.

```crespi
class Point(let x, let y) {
}

var p = Point(3, 4)
print(typeof(p))  // instance

// Property access
print(p.x)  // 3
print(p.y)  // 4
```

---

## Type Checking

Use `typeof()` to check a value's type:

```crespi
fn is_number(value) {
    var t = typeof(value)
    return t == "int" || t == "float"
}

fn is_collection(value) {
    var t = typeof(value)
    return t == "list" || t == "dict"
}

print(is_number(42))         // true
print(is_number(3.14))       // true
print(is_number("42"))       // false

print(is_collection([1,2]))   // true
print(is_collection({"a":1})) // true
```

---

## Type Conversion

| Function | Accepted Types | Result |
|----------|----------------|--------|
| `str()` | Any | `string` |
| `int()` | `string`, `float`, `int`, `bool` | `int` |
| `float()` | `string`, `float`, `int` | `float` |

```crespi
// To string
print(str(42))           // "42"
print(str(3.14))         // "3.14"
print(str(true))         // "true"
print(str([1, 2]))       // "[1, 2]"

// To integer
print(int("42"))         // 42
print(int(3.7))          // 3 (truncates)
print(int(true))         // 1
print(int(false))        // 0

// To float
print(float("3.14"))     // 3.14
print(float(42))         // 42.0
```

---

## See Also

- [Keywords](keywords.md)
- [Operators](operators.md)
- [Built-in Functions](functions.md)
