# Variables and Constants

> **Language:** [Español](../../es/guia/variables.md) | English

---

In Crespi, you can store values using mutable variables or immutable constants.

## Variables

Use `var` to declare values that can change:

```crespi
var name = "Ana"
var age = 25
var active = true

print(name)  // Ana
print(age)   // 25
```

### Reassignment

Variables can change their value at any time:

```crespi
var counter = 0
print(counter)    // 0

counter = 1
print(counter)    // 1

counter = counter + 1
print(counter)    // 2
```

### Type Inference

When the optional static type checker runs, Crespi uses type inference to determine variable types from their initial values:

```crespi
var x = 42        // inferred as Int
var y = "hello"   // inferred as String
var z = [1, 2, 3] // inferred as List[Int]

// You can also add explicit type annotations
var count: Int = 0
var name: String = "Alice"
```

With the checker enabled, a variable's inferred or annotated type must remain consistent. Without it, reassignment can use any type at runtime.

---

## Constants

Use `let` for values that should not change:

```crespi
let PI = 3.14159
let MAX_ATTEMPTS = 3
let APP_NAME = "My Application"

print(PI)  // 3.14159
```

Note: `PI` and `E` are built-in constants. In native-compiled code they are lowered to `pi()` and `e()` built-ins.

### Immutability

Attempting to reassign a constant produces an error:

```crespi
let LIMIT = 100

// LIMIT = 200  // Error: cannot reassign a let constant
```

`let` also freezes collections. Lists and dictionaries bound to `let` cannot be mutated (no index assignment, `push`, or `pop`), and tuples are always immutable:

```crespi
let ids = [1, 2, 3]
// ids[0] = 9     // Error: cannot modify a let list
// ids.push(4)   // Error: cannot modify a let list

let profile = { "name": "Ana" }
// profile["name"] = "Bea"  // Error: cannot modify a let dictionary
```

### When to Use Constants

Use constants for:
- Mathematical values (PI, E)
- Fixed configurations
- Threshold or limit values
- Any value that should not change

```crespi
let GRAVITY = 9.81
let TAX_RATE = 0.21
let DAYS_PER_WEEK = 7

fn calculate_weight(mass) {
    return mass * GRAVITY
}

fn calculate_price_with_tax(price) {
    return price * (1 + TAX_RATE)
}
```

---

## Assignment Operators

### Simple Assignment

```crespi
var x = 10
```

### Compound Assignment

Crespi supports compound assignment operators:

| Operator | Equivalent | Description |
|----------|------------|-------------|
| `+=` | `x = x + value` | Add and assign |
| `-=` | `x = x - value` | Subtract and assign |
| `*=` | `x = x * value` | Multiply and assign |
| `/=` | `x = x / value` | Divide and assign |

```crespi
var points = 100

points += 50    // points = 150
print(points)   // 150

points -= 30    // points = 120
print(points)   // 120

points *= 2     // points = 240
print(points)   // 240

points /= 4     // points = 60
print(points)   // 60
```

### Use in Loops

Compound operators are useful in loops:

```crespi
var sum = 0
var numbers = [1, 2, 3, 4, 5]

for n in numbers {
    sum += n
}

print(sum)  // 15
```

---

## Variable Scope

Variables have lexical scope. A variable declared inside a block only exists in that block:

```crespi
var global = "I am global"

if true {
    var local = "I am local"
    print(local)   // OK: I am local
    print(global)  // OK: I am global
}

print(global)  // OK: I am global
// print(local)  // Error: undefined variable
```

### Shadowing

An inner variable can "shadow" an outer one with the same name:

```crespi
var x = 10

if true {
    var x = 20  // New variable, shadows outer
    print(x)    // 20
}

print(x)  // 10 (original unchanged)
```

### Closures

Functions capture variables from their environment:

```crespi
var factor = 2

fn multiply(x) {
    return x * factor  // Uses 'factor' from outer scope
}

print(multiply(5))  // 10

factor = 3
print(multiply(5))  // 15 (uses new value)
```

---

## Naming Conventions

- Use `camelCase` for both variables and constants so naming stays consistent.
- Choose descriptive names that indicate an identifier's purpose.

```crespi
var userName = "ana123"
let maxAttempts = 3
let connectionTimeout = 30
```

---

## Initialization

### With Literal Value

```crespi
var integer = 42
var decimal = 3.14
var text = "Hello"
var boolean = true
var list = [1, 2, 3]
var dictionary = {"key": "value"}
```

### With Expression

```crespi
var sum = 10 + 20
var len = "Hello World".length()
var doubled = [1, 2, 3][0] * 2
```

### With Function Result

```crespi
fn calculate() {
    return 42
}

var result = calculate()
print(result)  // 42
```

### With Null Value

```crespi
var pending = null

// Later...
pending = fetch_data()
```

---

## Practical Examples

### Counter

```crespi
var counter = 0

fn increment() {
    counter += 1
}

fn get() {
    return counter
}

increment()
increment()
increment()
print(get())  // 3
```

### Accumulator

```crespi
var total = 0
var prices = [10.50, 25.00, 8.75, 12.25]

for price in prices {
    total += price
}

print("Total: " + str(total))  // Total: 56.5
```

### Value Swap

```crespi
var a = 10
var b = 20

// Swap using temporary variable
var temp = a
a = b
b = temp

print(a)  // 20
print(b)  // 10
```

---

## Visibility

Top-level declarations (variables, constants, functions, and classes) can use visibility modifiers to control how they are accessed from other modules:

- `public` (default): Accessible from any other module.
- `internal`: Accessible only from modules in the same directory.
- `fileprivate`: Accessible only from within the same file.
- `private`: Same as `fileprivate` (for backward compatibility).

```crespi
public var siteName = "Crespi"
internal var localCount = 0
fileprivate fn helper() { ... }
```

---

## See Also

- [Control Flow](control-flow.md)
- [Functions](functions.md)
- [Keywords](../reference/keywords.md)
