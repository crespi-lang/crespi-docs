# Pattern Matching

> **Language:** [Español](../../es/guia/pattern-matching.md) | English

---

Pattern matching is a powerful feature that allows you to match values against patterns and extract data. Crespi uses the `when` statement for pattern matching, which integrates seamlessly with enums, types, and data structures.

## Basic Syntax

The `when` statement matches a value against patterns using `is` clauses:

```crespi
when value {
    is Pattern1 => { /* code */ }
    is Pattern2 => { /* code */ }
    default => { /* fallback */ }
}
```

---

## Matching Enum Variants

The most common use of pattern matching is with enums:

```crespi
enum Status {
    case Active
    case Inactive
    case Pending
}

var status = Status.Active

when status {
    is Active => { print("Active") }
    is Inactive => { print("Inactive") }
    is Pending => { print("Pending") }
    default => { print("Unknown") }
}
```

### Matching Variants Without Qualified Names

Inside a `when` statement, you can use variant names without the enum prefix:

```crespi
enum Direction {
    case North, South, East, West
}

var dir = Direction.North

// No need for "Direction.North", just use "North"
when dir {
    is North => { print("Going north") }
    is South => { print("Going south") }
    is East => { print("Going east") }
    is West => { print("Going west") }
    default => { print("Unknown") }
}
```

---

## Destructuring Associated Values

Pattern matching allows you to extract values from enum variants:

### Positional Destructuring

```crespi
enum Option[T] {
    case Some(T)
    case None
}

var value = Option.Some(42)

when value {
    is Some(v) => { print("Value: " + str(v)) }
    is None => { print("No value") }
    default => { print("Unknown") }
}
```

### Named Field Destructuring

```crespi
enum Shape {
    case Circle(radius: Float)
    case Rectangle(width: Float, height: Float)
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

### Multiple Associated Values

```crespi
enum Message {
    case Move(x: Int, y: Int)
    case ChangeColor(r: Int, g: Int, b: Int)
}

var msg = Message.ChangeColor(255, 128, 0)

when msg {
    is Move(x, y) => {
        print("Move to (" + str(x) + ", " + str(y) + ")")
    }
    is ChangeColor(r, g, b) => {
        print("RGB(" + str(r) + ", " + str(g) + ", " + str(b) + ")")
    }
    default => {
        print("Unknown message")
    }
}
```

---

## Wildcard Patterns

Use `_` to match without binding:

### Ignore Entire Value

```crespi
enum Option[T] {
    case Some(T)
    case None
}

fn hasValue(opt: Option) -> Bool {
    when opt {
        is Some(_) => { return true }
        is None => { return false }
        default => { return false }
    }
}
```

### Partial Wildcards

Ignore specific fields while binding others:

```crespi
enum Shape {
    case Circle(radius: Float)
    case Rectangle(width: Float, height: Float)
    case Triangle(base: Float, height: Float)
}

var rect = Shape.Rectangle(10.0, 20.0)

when rect {
    is Circle(_) => { print("It's a circle (radius ignored)") }
    is Rectangle(w, _) => { print("Rectangle width: " + str(w)) }
    is Triangle(_, h) => { print("Triangle height: " + str(h)) }
    default => { print("Unknown shape") }
}
```

---

## Nested Patterns

Handle nested enum structures with sequential `when` statements:

```crespi
enum Option[T] {
    case Some(T)
    case None
}

enum Result[T, E] {
    case Ok(T)
    case Err(E)
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

## The `default` Branch

The `default` branch handles any patterns not explicitly matched:

```crespi
enum Color {
    case Red, Green, Blue
}

var color = Color.Red

// Without default, the compiler would require all variants
when color {
    is Red => { print("red") }
    default => { print("not red") }  // Handles Green, Blue
}
```

### Exhaustiveness

Without a `default` branch, the compiler verifies all enum variants are handled:

```crespi
enum Status {
    case Active
    case Inactive
}

var status = Status.Active

// Error: Missing case for 'Inactive'
// when status {
//     is Active => { print("active") }
// }

// Valid with default
when status {
    is Active => { print("active") }
    default => { print("not active") }
}
```

---

## Pattern Matching in Methods

Enum methods commonly use `when this` to match on the current instance:

```crespi
enum Temperature {
    case Celsius(Float)
    case Fahrenheit(Float)
    case Kelvin(Float)

    fn toKelvin() -> Float {
        when this {
            is Celsius(c) => {
                return c + 273.15
            }
            is Fahrenheit(f) => {
                return (f - 32.0) * 5.0 / 9.0 + 273.15
            }
            is Kelvin(k) => {
                return k
            }
            default => {
                return 0.0
            }
        }
    }

    fn isFreezing() -> Bool {
        var kelvin = this.toKelvin()
        return kelvin <= 273.15
    }
}

var temp = Temperature.Celsius(0.0)
print(temp.toKelvin())     // 273.15
print(temp.isFreezing())   // true
```

---

## Pattern Matching with Generic Enums

Generic enums work seamlessly with pattern matching:

```crespi
enum Result[T, E] {
    case Ok(T)
    case Err(E)

    fn map(f) -> Result {
        when this {
            is Ok(value) => { return Result.Ok(f(value)) }
            is Err(e) => { return Result.Err(e) }
            default => { return this }
        }
    }
}

fn divide(a: Int, b: Int) -> Result[Int, String] {
    if b == 0 {
        return Result.Err("Division by zero")
    }
    return Result.Ok(a / b)
}

var result = divide(10, 2)

when result {
    is Ok(value) => { print("Result: " + str(value)) }
    is Err(msg) => { print("Error: " + msg) }
    default => { print("Unknown") }
}
```

---

## Best Practices

### 1. Prefer Exhaustive Matching

When possible, match all variants explicitly rather than using `default`:

```crespi
enum Status {
    case Active, Inactive
}

// Good: All cases explicit
when status {
    is Active => { /* ... */ }
    is Inactive => { /* ... */ }
    default => { /* required for now */ }
}
```

### 2. Use Wildcards for Unused Values

Don't bind values you won't use:

```crespi
// Good: Use _ for unused values
when opt {
    is Some(_) => { print("has value") }
    is None => { print("empty") }
    default => { /* ... */ }
}

// Unnecessary binding
when opt {
    is Some(unused) => { print("has value") }  // unused variable
    is None => { print("empty") }
    default => { /* ... */ }
}
```

### 3. Handle Nested Structures Clearly

For deeply nested enums, use sequential `when` statements with clear variable names:

```crespi
when outerOption {
    is Some(result) => {
        when result {
            is Ok(data) => {
                when data {
                    is Valid(value) => { /* use value */ }
                    default => { /* ... */ }
                }
            }
            default => { /* ... */ }
        }
    }
    default => { /* ... */ }
}
```

---

## See Also

- [Enums](enums.md) - Enum types and associated values
- [Control Flow](control-flow.md) - Other control flow constructs
- [Error Handling](error-handling.md) - Using Result type for errors
