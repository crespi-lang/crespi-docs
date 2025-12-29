# Enums and Algebraic Data Types

> **Language:** [Español](../../es/guia/enums.md) | English

---

Crespi provides Swift-style enums with associated values, enabling type-safe modeling of state machines, protocol handling, and algebraic data types. Enums integrate seamlessly with pattern matching for exhaustive case handling.

## Basic Enums

The simplest enums are simple enumerations without associated values. Use the `case` keyword to declare variants:

```crespi
enum Direction {
    case North, South, East, West
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

Variants can also be declared on separate lines:

```crespi
enum Status {
    case Active
    case Inactive
    case Pending
}
```

### Key Features

- **`case` keyword**: Required before each variant declaration
- **Comma-separated**: Multiple variants can appear on one line with commas
- **PascalCase naming**: Variants use PascalCase (e.g., `North`, `Some`, `Ok`)
- **Dot notation**: Access variants using `EnumName.VariantName`
- **Visibility**: Enums support `public`, `private`, `internal` modifiers

---

## Iterating Over Cases with `allCases`

Simple enums (those without associated values) automatically provide an `allCases` property that returns a list of all variants in declaration order:

```crespi
enum Direction {
    case North, South, East, West
}

// Iterate over all cases
for dir in Direction.allCases {
    print(dir)
}
// Output:
// Direction.North
// Direction.South
// Direction.East
// Direction.West

// Get the count of cases
print(length(Direction.allCases))  // 4
```

### Restrictions

`allCases` is only available for enums where **all variants have no associated values**:

```crespi
enum Option[T] {
    case Some(T)
    case None
}

// ERROR: allCases is not available for enum 'Option' because it has variants with associated values
// var cases = Option.allCases
```

---

## Enums with Associated Values

Variants can carry data using positional or named associated values:

### Positional Associated Values

```crespi
enum Option[T] {
    case Some(T)
    case None
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
    case Quit
    case Move(x: Int, y: Int)
    case Write(text: String)
    case ChangeColor(r: Int, g: Int, b: Int)
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
    case Ok(T)
    case Err(E)
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

## Methods on Enums

Enums can have methods declared inside their body:

```crespi
enum Option[T] {
    case Some(T)
    case None

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
    case Circle(radius: Float)
    case Rectangle(width: Float, height: Float)
    case Triangle(base: Float, height: Float)

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
    case Empty
    case Node(value: T, left: Tree[T], right: Tree[T])

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
    case Nil
    case Cons(head: T, tail: List[T])

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

## Common Patterns

### State Machines

```crespi
enum ConnectionState {
    case Disconnected
    case Connecting
    case Connected(sessionId: String)
    case Error(message: String)
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
    case Some(T)
    case None

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
    case Ok(T)
    case Err(E)

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
    case Active
    case Inactive
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
    case Red, Green, Blue
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

// Or iterate using allCases
for color in Color.allCases {
    print(color)
}
```

### Enums with Extensions

```crespi
enum Direction {
    case North, South, East, West
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
    caso Norte, Sur, Este, Oeste
}

// Indirect keyword: indirecto
indirecto enumerado Arbol[T] {
    caso Vacio
    caso Nodo(valor: T, izquierda: Arbol[T], derecha: Arbol[T])
}
```

---

## See Also

- [Pattern Matching](pattern-matching.md) - Detailed pattern matching guide
- [Control Flow](control-flow.md) - Pattern matching with `when`
- [Classes](classes.md) - Object-oriented programming
- [Generics](generics.md) - Type parameters
- [Extensions](extensions.md) - Adding methods to types
- [Error Handling](error-handling.md) - Using Result type for errors
