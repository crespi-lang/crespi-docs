# Operators

> **Language:** [Español](../../es/referencia/operadores.md) | English

---

Crespi supports operators in symbolic form. With Spanish language pack, textual aliases are also available.

## Arithmetic Operators

| Symbol | Spanish Alias | Description | Example |
|--------|---------------|-------------|---------|
| `+` | `mas` | Addition | `5 + 3` |
| `-` | `menos` | Subtraction | `10 - 4` |
| `*` | `por` | Multiplication | `6 * 7` |
| `/` | `entre` | Division | `20 / 4` |
| `%` | `modulo` | Modulo (remainder) | `17 % 5` |

### Examples

```crespi
var a = 10
var b = 3

print(a + b)       // 13
print(a - b)       // 7
print(a * b)       // 30
print(a / b)       // 3 (integer division if both are integers)
print(a % b)       // 1
```

### Division

Division between integers produces an integer (integer division). To get a decimal, at least one operand must be decimal:

```crespi
print(10 / 3)      // 3 (integer division)
print(10.0 / 3)    // 3.333... (decimal division)
print(10 / 3.0)    // 3.333... (decimal division)
```

---

## Comparison Operators

| Symbol | Spanish Alias | Description | Example |
|--------|---------------|-------------|---------|
| `<` | `menorQue` | Less than | `3 < 5` |
| `>` | `mayorQue` | Greater than | `5 > 3` |
| `<=` | `menorOIgual` | Less or equal | `3 <= 3` |
| `>=` | `mayorOIgual` | Greater or equal | `5 >= 5` |
| `==` | `igualA` | Equal to | `5 == 5` |
| `!=` | `diferenteDe` | Not equal to | `3 != 5` |

### Examples

```crespi
var x = 10
var y = 5

// Numeric comparisons
print(x > y)           // true
print(x < y)           // false
print(x >= 10)         // true
print(x == y)          // false
print(x != y)          // true
```

### Text Comparison

```crespi
var name = "Ana"

print(name == "Ana")   // true
print(name != "Luis")  // true
```

---

## Logical Operators

| Symbol | Description | Example |
|--------|-------------|---------|
| `&&` | Logical AND | `true && false` |
| `\|\|` | Logical OR | `true \|\| false` |
| `!` | Negation | `!true` |
| `??` | Null coalescing (uses right if left is `null`) | `null ?? 5` |

### Short-Circuit Evaluation

The `&&`, `||`, and `??` operators use short-circuit evaluation:
- `&&`: If the first operand is `false`, the second is not evaluated
- `||`: If the first operand is `true`, the second is not evaluated
- `??`: If the first operand is not `null`, the second is not evaluated

### Examples

```crespi
// AND - both must be true
print(true && true)   // true
print(true && false)  // false
print(false && true)  // false

// OR - at least one must be true
print(true || false)   // true
print(false || false)  // false

// NOT - inverts the value
print(!true)           // false
print(!false)          // true

// NULL COALESCING - fallback for null
print(null ?? 5)       // 5
print(0 ?? 5)          // 0
```

---

## Type Checking Operators

Crespi provides Kotlin-style type checking operators for runtime type introspection:

| Operator | Spanish Alias | Description | Example |
|----------|---------------|-------------|---------|
| `is` | `es` | Type check (returns true if value is of type) | `42 is Int` |
| `!is` | `!es` | Negated type check (returns true if value is NOT of type) | `"hello" !is Int` |

### Available Types

- `Int` - Integer numbers
- `Float` - Decimal numbers
- `String` - Text values
- `Bool` - Boolean values (`true`/`false`)
- `List` - Array/list values
- `Dictionary` - Key-value maps
- `Null` - The null value
- Custom class names (e.g., `Point`, `Animal`)

### Examples

```crespi
// Basic type checks
print(42 is Int)           // true
print(3.14 is Float)       // true
print("hello" is String)   // true
print(true is Bool)        // true
print([1, 2, 3] is List)   // true

// Negated type checks
print(42 !is String)       // true
print("text" !is Int)      // true
print(null !is String)     // true

// Class type checks
class Animal(name) {}
class Dog(name) extends Animal {}

var dog = Dog("Rex")
print(dog is Dog)          // true
print(dog is Animal)       // true (inheritance check)
print(dog !is String)      // true
```

### Use Cases

Type checking is useful for:

1. **Runtime validation**: Verify input types before processing
2. **Polymorphic handling**: Different behavior based on actual type
3. **Safe casting**: Check type before accessing type-specific methods

```crespi
fn describe(value) {
    if value is Int {
        return "Integer: " + str(value)
    } else if value is String {
        return "Text: " + value
    } else if value is List {
        return "List with " + str(value.length()) + " elements"
    } else {
        return "Unknown type"
    }
}

print(describe(42))          // Integer: 42
print(describe("hello"))     // Text: hello
print(describe([1, 2, 3]))   // List with 3 elements
```

---

## Bitwise Operators

| Symbol | Description | Example |
|--------|-------------|---------|
| `&` | Bitwise AND | `5 & 3` (= 1) |
| `\|` | Bitwise OR | `5 \| 3` (= 7) |
| `^` | Bitwise XOR | `5 ^ 3` (= 6) |
| `<<` | Left shift | `1 << 4` (= 16) |
| `>>` | Right shift | `16 >> 2` (= 4) |
| `~` | Bitwise NOT (ones' complement) | `~0` (= -1) |

Bitwise operators work only on integers.

### Examples

```crespi
// Bitwise AND - bits that are 1 in both
print(5 & 3)    // 1  (101 & 011 = 001)
print(15 & 7)   // 7  (1111 & 0111 = 0111)

// Bitwise OR - bits that are 1 in either
print(5 | 3)    // 7  (101 | 011 = 111)
print(8 | 1)    // 9  (1000 | 0001 = 1001)

// Bitwise XOR - bits that differ
print(5 ^ 3)    // 6  (101 ^ 011 = 110)
print(10 ^ 10)  // 0  (a ^ a = 0)

// Left shift - multiply by 2^n
print(1 << 4)   // 16 (1 shifted left 4 = 10000)
print(3 << 2)   // 12 (11 shifted left 2 = 1100)

// Right shift - divide by 2^n
print(16 >> 2)  // 4  (10000 shifted right 2 = 100)
print(15 >> 1)  // 7  (1111 shifted right 1 = 111)

// Bitwise NOT - flip all bits
print(~0)       // -1
print(~(-1))    // 0
print(~~5)      // 5  (double negation returns original)
```

---

## Conditional Operator

The ternary operator chooses between two values based on a condition:

```crespi
var age = 20
var status = age >= 18 ? "adult" : "minor"
print(status)
```

Alternative form (requires `{}` blocks and no parentheses in the condition):

```crespi
var status = if age >= 18 { "adult" } else { "minor" }
```

Block expressions are required for branches. The last statement is the result:

```crespi
var status = if age >= 18 {
    var label = "adult"
    label
} else {
    "minor"
}
```

---

## Guard (`guard`)

`guard` enforces an early return if the condition is false. The `else { ... }` block
is an expression block whose last statement becomes the return value.

```crespi
fn divide(a, b) {
    guard b != 0 else { "division by zero" }
    return a / b
}
```

Guard-let style binds a value only if it is not `null`:

```crespi
fn add_one(value) {
    guard var x = value else { "null" }
    return x + 1
}
```

### Combinations

```crespi
var age = 25
var student = true

if age >= 18 && student {
    print("Adult student")
}

if age < 18 || student {
    print("Minor or student")
}
```

---

## Increment and Decrement Operators

Crespi supports postfix increment (`++`) and decrement (`--`) operators. These are statement-level operators that modify a variable.

| Operator | Description | Example |
|----------|-------------|---------|
| `++` | Postfix increment | `i++` (equivalent to `i += 1`) |
| `--` | Postfix decrement | `i--` (equivalent to `i -= 1`) |

```crespi
var i = 0
i++
print(i) // 1
i--
print(i) // 0
```

---

## Assignment Operators

| Operator | Description | Equivalent |
|----------|-------------|------------|
| `=` | Assignment | - |
| `+=` | Add and assign | `x = x + value` |
| `-=` | Subtract and assign | `x = x - value` |
| `*=` | Multiply and assign | `x = x * value` |
| `/=` | Divide and assign | `x = x / value` |

### Examples

```crespi
var x = 10

x += 5     // x = 15
x -= 3     // x = 12
x *= 2     // x = 24
x /= 4     // x = 6

print(x)   // 6
```

---

## Unary Negation Operator

The `-` operator can be used to negate a number:

```crespi
var positive = 5
var negative = -positive

print(negative)    // -5
print(-10)         // -10
print(--5)         // 5 (double negation)
```

---

## Access Operators

### Index Access `[]`

Accesses elements of lists and dictionaries:

```crespi
var list = [10, 20, 30]
print(list[0])     // 10
print(list[2])     // 30
print(list[-1])    // 30 (last element)

var dict = {"name": "Ana", "age": 25}
print(dict["name"])  // Ana
```

### Property Access `.`

Accesses properties and methods of objects:

```crespi
class Point(let x, let y) {
}

var p = Point(3, 4)
print(p.x)    // 3
print(p.y)    // 4
```

### Function Call `()`

Invokes a function with arguments:

```crespi
fn add(a, b) {
    return a + b
}

print(add(3, 5))   // 8
print(add(1, 2))   // 3
```

---

## Operator Precedence

From lowest to highest precedence:

| Level | Operators | Associativity |
|-------|-----------|---------------|
| 1 | `??` (null coalescing) | Left |
| 2 | `or`, `||` | Left |
| 3 | `and`, `&&` | Left |
| 4 | `|` (bitwise OR) | Left |
| 5 | `^` (bitwise XOR) | Left |
| 6 | `&` (bitwise AND) | Left |
| 7 | `==`, `!=` | Left |
| 8 | `<`, `>`, `<=`, `>=`, `in`, `is`, `!is` | Left |
| 9 | `<<`, `>>` (shift) | Left |
| 10 | `+`, `-` | Left |
| 11 | `*`, `/`, `%` | Left |
| 12 | `!`, `-` (unary), `~` (bitwise NOT) | Right |
| 13 | `.`, `[]`, `()`, `++`, `--` | Left |

### Precedence Examples

```crespi
// Multiplication before addition
print(2 + 3 * 4)     // 14, not 20

// Parentheses to change order
print((2 + 3) * 4)   // 20

// AND before OR
print(true || false && false)  // true
// Equivalent to: true || (false && false)

// Comparison before logical
print(5 > 3 && 2 < 4)  // true
// Equivalent to: (5 > 3) && (2 < 4)
```

---

## Text Concatenation

The `+` operator also concatenates text:

```crespi
var greeting = "Hello, " + "World"
print(greeting)    // Hello, World

var name = "Ana"
print("Welcome, " + name + "!")  // Welcome, Ana!
```

To concatenate numbers with text, use the `str()` function:

```crespi
var age = 25
print("I am " + str(age) + " years old")  // I am 25 years old
```

---

## See Also

- [Keywords](keywords.md)
- [Data Types](types.md)
- [Built-in Functions](functions.md)
