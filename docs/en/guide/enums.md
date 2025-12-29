# Enums and Algebraic Data Types

> **Language:** [Español](../../es/guia/enums.md) | English

---

Crespi provides Swift-style enums with associated values, enabling type-safe modeling of state machines, protocol handling, and algebraic data types. Enums integrate seamlessly with pattern matching for exhaustive case handling.

## Basic Enums

The simplest enums are simple enumerations without associated values:

```crespi
enum Direction {
    North
    South
    East
    West
}

var dir = Direction.North

when dir {
    is North => { print("Going north") }
    is South => { print("Going south") }
    is East => { print("Going east") }
    is West => { print("Going west") }
    default => { print("Unknown direction") }
}
```

### Key Features

- **PascalCase naming**: Variants use PascalCase (e.g., `North`, `Some`, `Ok`)
- **No commas**: Variants are declared on separate lines without commas
- **Dot notation**: Access variants using `EnumName.VariantName`
- **Visibility**: Enums support `public`, `private`, `internal` modifiers

---

## Enums with Associated Values

Variants can carry data using positional or named associated values:

### Positional Associated Values

```crespi
enum Option[T] {
    Some(T)
    None
}

var value = Option.Some(42)
var empty = Option.None

when value {
    is Some(v) => { print("Value: " + str(v)) }
    is None => { print("No value") }
    default => { print("Unknown") }
}
```

### Named Associated Values

Named fields provide better documentation and allow flexible construction:

```crespi
enum Message {
    Quit
    Move(x: Int, y: Int)
    Write(text: String)
    ChangeColor(r: Int, g: Int, b: Int)
}

// Construction with named arguments
var msg1 = Message.Move(10, 20)
var msg2 = Message.Write("Hello")
var msg3 = Message.ChangeColor(255, 0, 0)

when msg1 {
    is Move(x, y) => {
        print("Move to (" + str(x) + ", " + str(y) + ")")
    }
    is Write(text) => {
        print("Write: " + text)
    }
    is ChangeColor(r, g, b) => {
        print("Color RGB(" + str(r) + ", " + str(g) + ", " + str(b) + ")")
    }
    is Quit => {
        print("Quit")
    }
    default => {
        print("Unknown message")
    }
}
```

---

## Generic Enums

Enums can have type parameters using square bracket syntax:

```crespi
enum Result[T, E] {
    Ok(T)
    Err(E)
}

fn divide(a: Int, b: Int) -> Result[Int, String] {
    if b == 0 {
        return Result.Err("Division by zero")
    }
    return Result.Ok(a / b)
}

var result = divide(10, 2)

when result {
    is Ok(value) => {
        print("Result: " + str(value))
    }
    is Err(msg) => {
        print("Error: " + msg)
    }
    default => {
        print("Unknown")
    }
}
```

### Type Inference

Type arguments are inferred from usage:

```crespi
var some = Option.Some(42)  // Inferred as Option[Int]
var none = Option.None       // Inferred from context
```

---

## Pattern Matching

Enums integrate with the `when` statement for powerful pattern matching.

### Basic Matching

```crespi
enum Status {
    Active
    Inactive
    Pending
}

var status = Status.Active

when status {
    is Active => { print("Active") }
    is Inactive => { print("Inactive") }
    is Pending => { print("Pending") }
    default => { print("Unknown") }
}
```

### Destructuring Values

Extract associated values directly in patterns:

```crespi
enum Shape {
    Circle(radius: Float)
    Rectangle(width: Float, height: Float)
}

var shape = Shape.Rectangle(10.0, 20.0)

when shape {
    is Circle(r) => {
        print("Circle with radius " + str(r))
    }
    is Rectangle(w, h) => {
        print("Rectangle: " + str(w) + " x " + str(h))
    }
    default => {
        print("Unknown shape")
    }
}
```

### Wildcard Patterns

Use `_` to match without binding:

```crespi
when shape {
    is Circle(_) => { print("It's a circle") }
    is Rectangle(_, h) => { print("Height: " + str(h)) }
    default => { print("Unknown") }
}
```

### Nested Patterns

Sequential `when` statements handle nested enums:

```crespi
enum Option[T] {
    Some(T)
    None
}

enum Result[T, E] {
    Ok(T)
    Err(E)
}

var nested = Option.Some(Result.Ok(42))

when nested {
    is Some(result) => {
        when result {
            is Ok(value) => { print("Value: " + str(value)) }
            is Err(msg) => { print("Error: " + msg) }
            default => { print("Unknown result") }
        }
    }
    is None => { print("No value") }
    default => { print("Unknown") }
}
```

---

## Methods on Enums

Enums can have methods declared inside their body:

```crespi
enum Option[T] {
    Some(T)
    None

    fn isSome() -> Bool {
        when this {
            is Some(_) => { return true }
            is None => { return false }
            default => { return false }
        }
    }

    fn isNone() -> Bool {
        when this {
            is Some(_) => { return false }
            is None => { return true }
            default => { return false }
        }
    }

    fn unwrapOr(defaultValue: T) -> T {
        when this {
            is Some(value) => { return value }
            is None => { return defaultValue }
            default => { return defaultValue }
        }
    }
}

var some = Option.Some(42)
var none = Option.None

print(some.isSome())         // true
print(none.isSome())         // false
print(some.unwrapOr(0))      // 42
print(none.unwrapOr(99))     // 99
```

### Methods with Pattern Matching

Methods can use `when this` to match on the enum value:

```crespi
enum Shape {
    Circle(radius: Float)
    Rectangle(width: Float, height: Float)
    Triangle(base: Float, height: Float)

    fn area() -> Float {
        when this {
            is Circle(r) => {
                return 3.14159 * r * r
            }
            is Rectangle(w, h) => {
                return w * h
            }
            is Triangle(b, h) => {
                return 0.5 * b * h
            }
            default => {
                return 0.0
            }
        }
    }

    fn scale(factor: Float) -> Shape {
        when this {
            is Circle(r) => {
                return Shape.Circle(r * factor)
            }
            is Rectangle(w, h) => {
                return Shape.Rectangle(w * factor, h * factor)
            }
            is Triangle(b, h) => {
                return Shape.Triangle(b * factor, h * factor)
            }
            default => {
                return this
            }
        }
    }
}

var circle = Shape.Circle(5.0)
print(circle.area())           // ~78.54
print(circle.scale(2.0).area()) // ~314.16
```

---

## Recursive Enums

Use the `indirect` keyword for recursive enum types:

```crespi
indirect enum Tree[T] {
    Empty
    Node(value: T, left: Tree[T], right: Tree[T])

    fn size() -> Int {
        when this {
            is Empty => { return 0 }
            is Node(_, left, right) => {
                return 1 + left.size() + right.size()
            }
            default => { return 0 }
        }
    }
}

// Build a tree:
//       5
//      / \
//     3   7
//    /
//   1
var tree = Tree.Node(
    5,
    Tree.Node(3, Tree.Node(1, Tree.Empty, Tree.Empty), Tree.Empty),
    Tree.Node(7, Tree.Empty, Tree.Empty)
)

print(tree.size())  // 4
```

### Linked Lists

```crespi
indirect enum List[T] {
    Nil
    Cons(head: T, tail: List[T])

    fn length() -> Int {
        when this {
            is Nil => { return 0 }
            is Cons(_, tail) => { return 1 + tail.length() }
            default => { return 0 }
        }
    }
}

var list = List.Cons(1, List.Cons(2, List.Cons(3, List.Nil)))
print(list.length())  // 3
```

---

## Exhaustiveness Checking

The compiler verifies that all enum variants are handled in `when` statements:

```crespi
enum Color {
    Red
    Green
    Blue
}

var color = Color.Red

// Error: Missing cases for Green and Blue
when color {
    is Red => { print("red") }
    default => { print("other") }  // 'default' makes it valid
}
```

### Default Branch

A `default` branch satisfies exhaustiveness:

```crespi
when color {
    is Red => { print("red") }
    default => { print("not red") }
}
```

---

## Common Patterns

### State Machines

```crespi
enum ConnectionState {
    Disconnected
    Connecting
    Connected(sessionId: String)
    Error(message: String)
}

class Connection {
    constructor() {
        this.state = ConnectionState.Disconnected
    }

    fn connect(id: String) {
        this.state = ConnectionState.Connecting
        // ... connection logic ...
        this.state = ConnectionState.Connected(id)
    }

    fn getStatus() -> String {
        when this.state {
            is Disconnected => { return "Not connected" }
            is Connecting => { return "Connecting..." }
            is Connected(id) => { return "Connected: " + id }
            is Error(msg) => { return "Error: " + msg }
            default => { return "Unknown" }
        }
    }
}
```

### Option Type

```crespi
enum Option[T] {
    Some(T)
    None

    fn map(f) -> Option {
        when this {
            is Some(value) => { return Option.Some(f(value)) }
            is None => { return Option.None }
            default => { return Option.None }
        }
    }

    fn flatMap(f) -> Option {
        when this {
            is Some(value) => { return f(value) }
            is None => { return Option.None }
            default => { return Option.None }
        }
    }
}

var value = Option.Some(5)
var doubled = value.map(x => x * 2)  // Option.Some(10)
```

### Result Type

```crespi
enum Result[T, E] {
    Ok(T)
    Err(E)

    fn isOk() -> Bool {
        when this {
            is Ok(_) => { return true }
            is Err(_) => { return false }
            default => { return false }
        }
    }

    fn unwrap() -> T {
        when this {
            is Ok(value) => { return value }
            is Err(msg) => {
                throw RuntimeError("unwrap on Err: " + str(msg))
            }
            default => {
                throw RuntimeError("unwrap on invalid Result")
            }
        }
    }
}

fn parseNumber(s: String) -> Result[Int, String] {
    var n = int(s)
    if typeof(n) == "Int" {
        return Result.Ok(n)
    }
    return Result.Err("Invalid number: " + s)
}
```

---

## Integration with Other Features

### Enums in Classes

```crespi
enum Status {
    Active
    Inactive
}

class User(name, status) {
    fn isActive() -> Bool {
        when this.status {
            is Active => { return true }
            default => { return false }
        }
    }
}

var user = User("Alice", Status.Active)
print(user.isActive())  // true
```

### Enums in Collections

```crespi
enum Color {
    Red
    Green
    Blue
}

var colors = [Color.Red, Color.Green, Color.Blue]

for color in colors {
    when color {
        is Red => { print("red") }
        is Green => { print("green") }
        is Blue => { print("blue") }
        default => { print("unknown") }
    }
}
```

### Enums with Extensions

```crespi
enum Direction {
    North
    South
    East
    West
}

extension Direction {
    fn opposite() -> Direction {
        when this {
            is North => { return Direction.South }
            is South => { return Direction.North }
            is East => { return Direction.West }
            is West => { return Direction.East }
            default => { return this }
        }
    }
}

var dir = Direction.North
print(dir.opposite())  // Direction.South
```

---

## Spanish Language Support

Enums support Spanish aliases via the language pack:

```crespi
// Spanish keyword: enumerado
enumerado Direccion {
    Norte
    Sur
    Este
    Oeste
}

// Indirect keyword: indirecto
indirecto enumerado Arbol[T] {
    Vacio
    Nodo(valor: T, izquierda: Arbol[T], derecha: Arbol[T])
}
```

---

## See Also

- [Control Flow](control-flow.md) - Pattern matching with `when`
- [Classes](classes.md) - Object-oriented programming
- [Generics](generics.md) - Type parameters
- [Extensions](extensions.md) - Adding methods to types
- [Error Handling](error-handling.md) - Using Result type for errors
