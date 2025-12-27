# Extensions

> **Language:** [Español](../../es/guia/extensiones.md) | English

---

Extensions allow you to add new methods to existing types without modifying their original definition. This is similar to Swift's extension feature.

## Basic Syntax

Use the `extension` keyword followed by the type name:

```crespi
extension Entero {
    fn isEven() {
        return this % 2 == 0
    }
}

var n = 10
print(n.isEven())  // true
```

You can also declare a single extension function inline:

```crespi
fn Entero.isOdd() = this % 2 != 0

print((7).isOdd())  // true
print(isOdd(7))     // true (call as a plain function)
```

Extension functions are also exposed as plain functions that take the receiver as the first argument, which makes them easy to import and use in DSL-style code.

## Extension Methods

Extension methods work like regular methods with access to `this`:

```crespi
extension Texto {
    fn reverse() {
        var result = ""
        var i = this.length() - 1
        while i >= 0 {
            result = result + this.substring(i, i + 1)
            i = i - 1
        }
        return result
    }

    fn repeatN(times) {
        var result = ""
        var i = 0
        while i < times {
            result = result + this
            i = i + 1
        }
        return result
    }
}

var text = "Hello"
print(text.reverse())      // "olleH"
print("ab".repeatN(3))     // "ababab"
```

---

## Supported Types

Extensions can be added to the following built-in runtime types (English names are canonical; language packs can provide aliases like `Texto`):

| Type Name     | Description    |
|--------------|----------------|
| `Texto`      | String         |
| `Entero`     | Integer        |
| `Decimal`    | Float          |
| `Lista`      | Array/List     |
| `Diccionario`| Dictionary/Map |
| `Tupla`      | Tuple          |
| `Booleano`   | Boolean        |

You can also extend user-defined classes:

```crespi
class Point(let x, let y)

extension Point {
    fn magnitude() {
        return sqrt(this.x * this.x + this.y * this.y)
    }
}

var p = Point(3, 4)
print(p.magnitude())  // 5.0
```

---

## Integer Extensions

```crespi
extension Entero {
    fn isPositive() {
        return this > 0
    }

    fn square() {
        return this * this
    }

    fn factorial() {
        if this <= 1 {
            return 1
        }
        return this * (this - 1).factorial()
    }
}

print((5).square())      // 25
print((5).factorial())   // 120
print((-3).isPositive()) // false
```

---

## Float Extensions

```crespi
extension Decimal {
    fn isWhole() {
        return this == floor(this)
    }

    fn toPercentage() {
        return str(this * 100) + "%"
    }
}

print((3.14).isWhole())      // false
print((4.0).isWhole())       // true
print((0.75).toPercentage()) // "75%"
```

---

## List Extensions

```crespi
extension Lista {
    fn sum() {
        var total = 0
        for item in this {
            total = total + item
        }
        return total
    }

    fn average() {
        return this.sum() / this.length()
    }

    fn isEmpty() {
        return this.length() == 0
    }
}

var numbers = [1, 2, 3, 4, 5]
print(numbers.sum())      // 15
print(numbers.average())  // 3
print([].isEmpty())       // true
```

---

## Multiple Extensions for Same Type

You can define multiple extension blocks for the same type:

```crespi
extension Entero {
    fn double() {
        return this * 2
    }
}

extension Entero {
    fn triple() {
        return this * 3
    }
}

var n = 5
print(n.double())  // 10
print(n.triple())  // 15
```

---

## Method Chaining

Extension methods can be chained:

```crespi
extension Entero {
    fn add(n) {
        return this + n
    }

    fn multiply(n) {
        return this * n
    }
}

var result = (2).add(3).multiply(4)
print(result)  // 20
```

---

## Extension Behavior

- Methods use `this` to access the receiver value
- Extensions are registered at parse time
- Multiple extensions for the same type are merged
- Instance methods take precedence over extension methods
- Extensions work in both the interpreter and native compilation

---

## See Also

- [Classes and Objects](classes.md)
- [Functions](functions.md)
- [Generics](generics.md)
