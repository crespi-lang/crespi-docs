# Quick Start

> **Language:** [Español](../es/inicio-rapido.md) | English

---

This guide will help you write your first Crespi program in just a few minutes.

## Hello World

The simplest program in Crespi:

```crespi
print("Hello, World!")
```

Save this to a file `hello.crespi` and run it.

Crespi offers two ways to execute your code:

- **[Interpreter](guide/interpreter.md)** - Run directly, supports all features
- **[Compiler](guide/compiler.md)** - Compile to native executable

**Output:**
```
Hello, World!
```

---

## Variables and Constants

Use `var` for values that can change and `let` for fixed values:

```crespi
var name = "Maria"
let PI = 3.14159

print(name)     // Maria
print(PI)       // 3.14159

name = "Carlos"   // OK - var can change
// PI = 3.0       // Error! - let cannot change
```

---

## Basic Data Types

```crespi
// Numbers
var integer = 42
var decimal = 3.14

// Text
var message = "Hello"

// Booleans
var active = true
var inactive = false

// Null
var empty = null
```

---

## Operators

Crespi uses standard symbolic operators:

```crespi
// Arithmetic
var sum = 5 + 3
var difference = 10 - 4
var product = 6 * 7
var quotient = 20 / 4

// Comparison
var greater = 10 > 5
var equal = 5 == 5

// Logical
var both = true && false   // false
var either = true || false  // true
```

---

## Conditionals

```crespi
var age = 18

if age >= 18 {
    print("Adult")
} else {
    print("Minor")
}
```

With multiple conditions:

```crespi
var grade = 85

if grade >= 90 {
    print("Excellent")
} else if grade >= 70 {
    print("Pass")
} else {
    print("Fail")
}
```

---

## Loops

### While

```crespi
var counter = 0

while counter < 5 {
    print(counter)
    counter += 1
}
// Output: 0, 1, 2, 3, 4
```

### For-each

```crespi
var numbers = [1, 2, 3, 4, 5]

for n in numbers {
    print(n * 2)
}
// Output: 2, 4, 6, 8, 10
```

---

## Functions

### Basic Syntax

```crespi
fn greet(name) {
    print("Hello, " + name + "!")
}

greet("Ana")  // Hello, Ana!
```

### With Return Value

```crespi
fn square(x) {
    return x * x
}

var r = square(5)
print(r)  // 25
```

### Short Syntax (single expression)

```crespi
fn double(x) = x * 2
fn sum(a, b) = a + b

print(double(7))     // 14
print(sum(3, 4))     // 7
```

### Default Parameters

```crespi
fn greet(name = "World") {
    print("Hello, " + name)
}

greet()         // Hello, World
greet("Ana")    // Hello, Ana
```

---

## Lists and Dictionaries

### Lists

```crespi
var fruits = ["apple", "orange", "pear"]

print(fruits[0])           // apple
print(fruits.length())     // 3

fruits.push("grape")
print(fruits)              // [apple, orange, pear, grape]
```

### Dictionaries

```crespi
var person = {
    "name": "Luis",
    "age": 30
}

print(person["name"])   // Luis
person["city"] = "Madrid"
print(person.keys())     // [name, age, city]
```

---

## Classes

```crespi
class Rectangle(let width, let height) {
    fn area() {
        return this.width * this.height
    }
}

var rect = Rectangle(5, 3)
print(rect.area())  // 15
```

---

## Next Steps

- [Keywords Reference](reference/keywords.md)
- [Built-in Functions](reference/functions.md)
- [Examples](https://github.com/crespi-lang/crespi-lang/tree/main/examples)
