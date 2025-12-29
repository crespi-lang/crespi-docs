# Control Flow

> **Language:** [Español](../../es/guia/control-flujo.md) | English

---

Crespi provides structures to control the execution flow of your program.

## Conditionals

### Basic Syntax: `if`

Executes code only if a condition is true:

```crespi
var age = 18

if age >= 18 {
    print("Adult")
}
```

### With Alternative: `else`

Executes alternative code if the condition is false:

```crespi
var age = 16

if age >= 18 {
    print("Adult")
} else {
    print("Minor")
}
// Output: Minor
```

### Multiple Conditions

Chain several conditions with `else if`:

```crespi
var grade = 75

if grade >= 90 {
    print("Excellent")
} else if grade >= 80 {
    print("Good")
} else if grade >= 70 {
    print("Pass")
} else if grade >= 60 {
    print("Acceptable")
} else {
    print("Fail")
}
// Output: Pass
```

### Nested Conditionals

You can nest conditionals:

```crespi
var age = 25
var hasLicense = true

if age >= 18 {
    if hasLicense {
        print("Can drive")
    } else {
        print("Needs license")
    }
} else {
    print("Too young to drive")
}
```

### Logical Operators

Combine conditions with `&&`, `||`, and `!`:

```crespi
var age = 25
var isStudent = true
var hasDiscount = false

// AND: both must be true
if age >= 18 && isStudent {
    print("Adult student")
}

// OR: at least one must be true
if isStudent || hasDiscount {
    print("Discount applies")
}

// NOT: inverts condition
if !hasDiscount {
    print("No previous discount")
}

// Combinations
if age >= 18 && (isStudent || hasDiscount) {
    print("Adult with benefit")
}
```

---

## Pattern Matching (`when`)

Use `when` to match a value against patterns with destructuring:

```crespi
var output = ""

when [1, 2] {
    is [a, b] => { output = "$a-$b" }
    is {"name": n} => { output = n }
    default => { output = "other" }
}
```

`default` is required to ensure exhaustive matching.

### Class Patterns

Class instances can be matched by name and fields:

```crespi
class Person(let name, let age) {
}

var person = Person("Ana", 30)

when person {
    is Person { name: n, age: e } => { print("$n-$e") }
    default => { print("no") }
}
```

### Enum Patterns

Enums integrate seamlessly with pattern matching:

```crespi
enum Result[T, E] {
    Ok(T)
    Err(E)
}

var result = Result.Ok(42)

when result {
    is Ok(value) => { print("Success: " + str(value)) }
    is Err(msg) => { print("Error: " + msg) }
    default => { print("Unknown") }
}
```

Wildcard patterns (`_`) match without binding:

```crespi
enum Option[T] {
    Some(T)
    None
}

when option {
    is Some(_) => { print("Has value") }
    is None => { print("No value") }
    default => { print("Unknown") }
}
```

For detailed enum usage, see the [Enums Guide](enums.md).

---

## While Loop

### Basic Syntax

Repeats while the condition is true:

```crespi
var i = 0

while i < 5 {
    print(i)
    i += 1
}
// Output: 0, 1, 2, 3, 4
```

### Countdown

```crespi
var count = 5

while count > 0 {
    print(count)
    count -= 1
}
print("Liftoff!")
// Output: 5, 4, 3, 2, 1, Liftoff!
```

### Infinite Loop with Exit

```crespi
var attempts = 0

while true {
    attempts += 1
    print("Attempt " + str(attempts))

    if attempts >= 3 {
        break  // Exit the loop
    }
}
print("Done")
```

---

## For-Each Loop

### Iterating Over Lists

```crespi
var fruits = ["apple", "orange", "pear"]

for fruit in fruits {
    print("I like " + fruit)
}
// Output: I like apple, I like orange, I like pear
```

### Iterating Over Text

```crespi
var word = "Hello"

for letter in word {
    print(letter)
}
// Output: H, e, l, l, o
```

### Iterating with Index

To get the index, use a counter:

```crespi
var colors = ["red", "green", "blue"]
var i = 0

for color in colors {
    print(str(i) + ": " + color)
    i += 1
}
// Output: 0: red, 1: green, 2: blue
```

### Iterating Over Dictionaries

```crespi
var person = {
    "name": "Ana",
    "age": 25,
    "city": "Madrid"
}

for key in person.keys() {
    print(key + ": " + str(person[key]))
}
```

---

## Loop Control

### `break`

Terminates the loop immediately:

```crespi
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

for n in numbers {
    if n == 5 {
        break
    }
    print(n)
}
// Output: 1, 2, 3, 4
```

### `continue`

Skips to the next iteration:

```crespi
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

for n in numbers {
    if n % 2 == 0 {
        continue  // Skip even numbers
    }
    print(n)
}
// Output: 1, 3, 5, 7, 9
```

---

## Truthiness

In Crespi, certain values evaluate to `false` in conditions:

| Value | Evaluation |
|-------|------------|
| `false` | False |
| `0` | False |
| `0.0` | False |
| `""` (empty text) | False |
| `[]` (empty list) | False |
| `null` | False |
| Everything else | True |

```crespi
// Check if list has elements
var list = [1, 2, 3]
if list {
    print("List has elements")
}

// Check if text is not empty
var name = "Ana"
if name {
    print("Hello, " + name)
}

// Check if value exists
var result = null
if !result {
    print("No result")
}
```

---

## Common Patterns

### Search in List

```crespi
fn find(list, target) {
    for item in list {
        if item == target {
            return item
        }
    }
    return null
}

var numbers = [10, 20, 30, 40]
var found = find(numbers, 30)

if found != null {
    print("Found: " + str(found))
} else {
    print("Not found")
}
```

### Filter List

```crespi
fn filter_even(list) {
    var result = []

    for n in list {
        if n % 2 == 0 {
            result.push(n)
        }
    }

    return result
}

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(filter_even(numbers))  // [2, 4, 6, 8, 10]
```

### Find Maximum

```crespi
fn maximum(list) {
    if list.length() == 0 {
        return null
    }

    var max = list[0]

    for n in list {
        if n > max {
            max = n
        }
    }

    return max
}

print(maximum([3, 7, 2, 9, 1]))  // 9
```

### Multiplication Table

```crespi
var n = 5
var i = 1

while i <= 10 {
    print(str(n) + " x " + str(i) + " = " + str(n * i))
    i += 1
}
```

---

## See Also

- [Variables and Constants](variables.md)
- [Functions](functions.md)
- [Operators](../reference/operators.md)
