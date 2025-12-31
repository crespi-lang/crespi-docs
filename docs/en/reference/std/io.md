# std.io

> **Language:** [Espanol](../../../es/referencia/std/io.md) | English

---

Input and output functions for interacting with the console.

## Importing

```crespi
import std.io { print, read }
```

Or use directly without import (globally available).

---

## Quick Reference

| Function | Spanish Alias | Parameters | Returns | Description |
|----------|---------------|------------|---------|-------------|
| `print` | `mostrar` | `value: Any` | `Unit` | Print to stdout |
| `read` | `leer` | - | `String` | Read line from stdin |
| `time` | `tiempo` | - | `Float` | Unix timestamp in seconds |
| `assert` | `afirmar` | `cond, msg?` | `Unit` | Assert condition |

---

## Functions

### `print(value)`

Prints a value to standard output followed by a newline.

**Parameters:**
- `value: Any` - Any value to display

**Returns:** `Unit` (nothing)

**Examples:**

```crespi
print("Hello, World!")     // Hello, World!
print(42)                  // 42
print(3.14)                // 3.14
print(true)                // true
print([1, 2, 3])           // [1, 2, 3]
print(["name": "Ana"])     // {name: Ana}
```

**Printing multiple values:**

```crespi
var name = "Ana"
var age = 25
print("Name: " + name + ", Age: " + str(age))
// Name: Ana, Age: 25

// Or with string interpolation
print("Name: $name, Age: $age")
// Name: Ana, Age: 25
```

---

### `read()`

Reads a line of text from standard input.

**Alias:** `input()`

**Parameters:** None

**Returns:** `String` - The line read (without trailing newline)

**Examples:**

```crespi
print("What is your name?")
var name = read()
print("Hello, $name!")

// Input: Ana
// Output: Hello, Ana!
```

**Reading numbers:**

```crespi
print("Enter a number:")
var input = read()
var number = int(input)
print("You entered: $number")
```

**Interactive menu:**

```crespi
fn show_menu() {
    print("1. Option A")
    print("2. Option B")
    print("3. Exit")
    print("Choose: ")
    return read()
}

var choice = show_menu()
when choice {
    case "1" -> print("Selected A")
    case "2" -> print("Selected B")
    case "3" -> print("Goodbye!")
    default -> print("Invalid option")
}
```

---

### `time()` / `now()`

Returns the current Unix timestamp in seconds (with fractional milliseconds).

**Alias:** `now()`

**Parameters:** None

**Returns:** `Float` - Seconds since Unix epoch (January 1, 1970)

**Examples:**

```crespi
var t = time()
print(t)  // 1704067200.123456

// Measure execution time
var start = time()
// ... some operation ...
var elapsed = time() - start
print("Took " + str(elapsed) + " seconds")
```

---

### `assert(condition, message?)`

Asserts that a condition is true. Throws an error if the condition is false.

**Parameters:**
- `condition: Bool` - The condition to check
- `message?: String` - Optional error message (default: "Assertion failed")

**Returns:** `Unit` (nothing)

**Errors:** Throws if condition is false

**Examples:**

```crespi
assert(1 + 1 == 2, "Math is broken!")  // passes
assert(true)                            // passes

// These will throw:
// assert(false)                 // Error: Assertion failed
// assert(1 > 2, "1 is not > 2") // Error: 1 is not > 2

// Testing functions
fn test_factorial() {
    assert(factorial(0) == 1, "factorial(0) should be 1")
    assert(factorial(5) == 120, "factorial(5) should be 120")
    print("All tests passed!")
}
```

---

## Practical Examples

### Input Validation

```crespi
fn read_positive_number() -> Int {
    while true {
        print("Enter a positive number: ")
        var input = read()
        var n = int(input)
        if n > 0 {
            return n
        }
        print("Invalid. Try again.")
    }
}

var n = read_positive_number()
print("You entered: $n")
```

### Simple Calculator

```crespi
import std.io { print, read }
import std.convert { int }

print("First number: ")
var a = int(read())

print("Second number: ")
var b = int(read())

print("Operation (+, -, *, /): ")
var op = read()

var result = when op {
    case "+" -> a + b
    case "-" -> a - b
    case "*" -> a * b
    case "/" -> a / b
    default -> 0
}

print("Result: $result")
```

---

## See Also

- [std.convert](convert.md) - Type conversions for parsing input
- [Standard Library](index.md) - All modules
