# std.convert

> **Language:** [Espanol](../../../es/referencia/std/convert.md) | English

---

Type conversion and introspection functions.

## Importing

```crespi
import std.convert { str, int, float, typeof }
```

Or use directly without import (globally available).

---

## Quick Reference

| Function | Spanish Alias | Parameters | Returns | Description |
|----------|---------------|------------|---------|-------------|
| `str` | `texto` | `value: Any` | `String` | Convert to string |
| `int` | `entero` | `value: Any` | `Int` | Convert to integer |
| `float` | `decimal` | `value: Any` | `Float` | Convert to float |
| `typeof` | `tipo_de` | `value: Any` | `String` | Get type name |
| `is_int` | `es_entero` | `value: Any` | `Bool` | Check if integer |
| `is_float` | `es_decimal` | `value: Any` | `Bool` | Check if float |
| `is_string` | `es_texto` | `value: Any` | `Bool` | Check if string |
| `is_bool` | `es_bool` | `value: Any` | `Bool` | Check if boolean |
| `is_list` | `es_lista` | `value: Any` | `Bool` | Check if list |
| `is_dict` | `es_dict` | `value: Any` | `Bool` | Check if dictionary |
| `is_null` | `es_nulo` | `value: Any` | `Bool` | Check if null |
| `is_function` | `es_funcion` | `value: Any` | `Bool` | Check if function |

---

## Functions

### `str(value)`

Converts any value to its string representation.

**Alias:** `string(value)`

**Parameters:**
- `value: Any` - Any value to convert

**Returns:** `String`

**Examples:**

```crespi
print(str(42))              // "42"
print(str(3.14))            // "3.14"
print(str(true))            // "true"
print(str(false))           // "false"
print(str(null))            // "null"
print(str([1, 2, 3]))       // "[1, 2, 3]"
print(str(["a": 1]))        // "{a: 1}"
```

**Common use - string concatenation:**

```crespi
var age = 25
print("I am " + str(age) + " years old")
// I am 25 years old

// Or with string interpolation (automatic conversion)
print("I am $age years old")
```

---

### `int(value)`

Converts a value to an integer.

**Parameters:**
- `value: Any` - String, float, int, or bool

**Returns:** `Int`

**Errors:** Throws if conversion is not possible

**Conversion rules:**

| Input Type | Result |
|------------|--------|
| `String` | Parse as integer (must be valid numeric text) |
| `Float` | Truncate toward zero |
| `Int` | Return as-is |
| `Bool` | `true` -> `1`, `false` -> `0` |

**Examples:**

```crespi
print(int("42"))           // 42
print(int("-17"))          // -17
print(int(3.7))            // 3 (truncates)
print(int(-3.7))           // -3 (truncates toward zero)
print(int(true))           // 1
print(int(false))          // 0

// Error cases
// int("abc")     // Error: Cannot convert 'abc' to integer
// int("3.14")    // Error: Invalid integer format
```

---

### `float(value)`

Converts a value to a floating-point number.

**Parameters:**
- `value: Any` - String, float, or int

**Returns:** `Float`

**Errors:** Throws if conversion is not possible

**Examples:**

```crespi
print(float("3.14"))        // 3.14
print(float("42"))          // 42.0
print(float(42))            // 42.0
print(float(-17))           // -17.0

// Scientific notation
print(float("1.5e3"))       // 1500.0

// Error cases
// float("abc")   // Error: Cannot convert 'abc' to float
```

---

### `typeof(value)`

Gets the type name of a value as a string.

**Alias:** `type_of(value)`

**Parameters:**
- `value: Any` - Any value

**Returns:** `String` - The type name

**Type names:**

| Value | Result |
|-------|--------|
| `42` | `"int"` |
| `3.14` | `"float"` |
| `"hello"` | `"string"` |
| `true`/`false` | `"bool"` |
| `null` | `"null"` |
| `[1, 2]` | `"list"` |
| `["a": 1]` | `"dict"` |
| `(1, 2)` | `"tuple"` |
| function | `"function"` |
| class instance | `"ClassName"` |
| enum value | `"EnumName"` |
| task | `"task"` |

**Examples:**

```crespi
print(typeof(42))           // int
print(typeof(3.14))         // float
print(typeof("hello"))      // string
print(typeof(true))         // bool
print(typeof(null))         // null
print(typeof([1, 2, 3]))    // list
print(typeof(["a": 1]))     // dict

fn add(a, b) { return a + b }
print(typeof(add))          // function

class Person(let name: String)
var p = Person("Ana")
print(typeof(p))            // Person
```

**Type checking:**

```crespi
fn process(value) {
    when typeof(value) {
        case "int" -> print("Integer: $value")
        case "string" -> print("String: $value")
        case "list" -> print("List with ${value.length()} items")
        default -> print("Unknown type")
    }
}

process(42)         // Integer: 42
process("hello")    // String: hello
process([1, 2, 3])  // List with 3 items
```

---

### Type Checking Functions

The `is_*` functions provide a convenient way to check value types. They return `true` if the value is of the specified type.

```crespi
// Type checking examples
print(is_int(42))           // true
print(is_int(3.14))         // false
print(is_float(3.14))       // true
print(is_string("hello"))   // true
print(is_bool(true))        // true
print(is_list([1, 2, 3]))   // true
print(is_dict(d))           // true (where d is a dict)
print(is_null(null))        // true
print(is_function(print))   // true

// Practical use
fn safe_add(a, b) {
    if is_int(a) and is_int(b) {
        return a + b
    }
    if is_float(a) or is_float(b) {
        return float(a) + float(b)
    }
    throw "Arguments must be numbers"
}
```

---

## Practical Examples

### Safe Number Parsing

```crespi
fn parse_int_or_default(s: String, default: Int) -> Int {
    try {
        return int(s)
    } catch e {
        return default
    }
}

var n = parse_int_or_default("abc", 0)
print(n)  // 0
```

### Type-Safe Operations

```crespi
fn add_numbers(a, b) {
    // Ensure both are numbers
    var x = typeof(a) == "int" or typeof(a) == "float"
    var y = typeof(b) == "int" or typeof(b) == "float"

    if x and y {
        return a + b
    }
    throw "Both arguments must be numbers"
}
```

### JSON-like Serialization

```crespi
fn to_json(value) -> String {
    when typeof(value) {
        case "string" -> return "\"$value\""
        case "int", "float", "bool" -> return str(value)
        case "null" -> return "null"
        case "list" -> {
            var items = value.map(v => to_json(v))
            return "[" + items.join(", ") + "]"
        }
        default -> return str(value)
    }
}

print(to_json(["name": "Ana", "age": 25]))
```

---

## See Also

- [std.io](io.md) - Input/output for reading user input
- [Data Types](../types.md) - Crespi type system
- [Standard Library](index.md) - All modules
