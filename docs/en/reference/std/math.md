# std.math

> **Language:** [Espanol](../../../es/referencia/std/math.md) | English

---

Mathematical functions and constants.

## Importing

```crespi
import std.math { sqrt, pow, sin, cos, PI }
```

Or use directly without import (globally available).

---

## Quick Reference

### Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `PI` | 3.14159... | Mathematical constant pi |
| `E` | 2.71828... | Euler's number |

### Basic Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `abs(x)` | `x: Number` | `Number` | Absolute value |
| `sign(x)` | `x: Number` | `Int` | Sign (-1, 0, 1) |
| `sqrt(x)` | `x: Number` | `Float` | Square root |
| `cbrt(x)` | `x: Number` | `Float` | Cube root |
| `pow(base, exp)` | `base, exp: Number` | `Float` | Power |
| `min(a, b?)` | `a, b: Number` or `list` | `Number` | Minimum |
| `max(a, b?)` | `a, b: Number` or `list` | `Number` | Maximum |
| `clamp(x, min, max)` | `x, min, max: Number` | `Number` | Constrain to range |

### Rounding

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `round(x)` | `x: Number` | `Int` | Round to nearest |
| `floor(x)` | `x: Number` | `Int` | Round down |
| `ceil(x)` | `x: Number` | `Int` | Round up |
| `truncate(x)` | `x: Number` | `Int` | Round toward zero |

### Trigonometry

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `sin(x)` | `x: Number` | `Float` | Sine (radians) |
| `cos(x)` | `x: Number` | `Float` | Cosine (radians) |
| `tan(x)` | `x: Number` | `Float` | Tangent (radians) |
| `asin(x)` | `x: Number` | `Float` | Arcsine |
| `acos(x)` | `x: Number` | `Float` | Arccosine |
| `atan(x)` | `x: Number` | `Float` | Arctangent |
| `atan2(y, x)` | `y, x: Number` | `Float` | Two-arg arctangent |

### Exponential & Logarithmic

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `exp(x)` | `x: Number` | `Float` | e^x |
| `ln(x)` | `x: Number` | `Float` | Natural log |
| `log10(x)` | `x: Number` | `Float` | Base-10 log |
| `log2(x)` | `x: Number` | `Float` | Base-2 log |
| `hypot(x, y)` | `x, y: Number` | `Float` | sqrt(x^2 + y^2) |

### Random

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `random()` | - | `Float` | Random 0.0 to 1.0 |
| `random_seed(seed)` | `seed: Int` | `Unit` | Seed the RNG |

---

## Constants

### `PI`

The mathematical constant pi (ratio of circumference to diameter).

```crespi
print(PI)  // 3.141592653589793

var radius = 5.0
var circumference = 2 * PI * radius
var area = PI * radius * radius
print("Circumference: $circumference")  // 31.41592...
print("Area: $area")                     // 78.53981...
```

### `E`

Euler's number (base of natural logarithm).

```crespi
print(E)  // 2.718281828459045

// Compound interest: A = P * e^(rt)
var principal = 1000.0
var rate = 0.05
var time = 10.0
var amount = principal * pow(E, rate * time)
print("Amount: $amount")  // 1648.72...
```

---

## Basic Functions

### `abs(x)`

Returns the absolute value of a number.

```crespi
print(abs(-5))      // 5
print(abs(5))       // 5
print(abs(-3.14))   // 3.14
```

### `sign(x)`

Returns the sign of a number: -1, 0, or 1.

```crespi
print(sign(-10))   // -1
print(sign(0))     // 0
print(sign(10))    // 1
```

### `sqrt(x)`

Returns the square root of a number.

```crespi
print(sqrt(16))    // 4.0
print(sqrt(2))     // 1.4142135...
```

### `cbrt(x)`

Returns the cube root of a number.

```crespi
print(cbrt(27))    // 3.0
print(cbrt(-8))    // -2.0
```

### `pow(base, exp)`

Raises base to the power of exp.

```crespi
print(pow(2, 10))  // 1024.0
print(pow(3, 3))   // 27.0
print(pow(16, 0.5)) // 4.0 (same as sqrt)
```

### `min(a, b?)` / `max(a, b?)`

Returns the minimum/maximum of two values or a list.

```crespi
// Two values
print(min(5, 3))       // 3
print(max(5, 3))       // 5

// List
print(min([4, 1, 7, 2]))  // 1
print(max([4, 1, 7, 2]))  // 7
```

### `clamp(x, min, max)`

Constrains a value to a range.

```crespi
print(clamp(5, 0, 10))     // 5 (within range)
print(clamp(-5, 0, 10))    // 0 (clamped to min)
print(clamp(15, 0, 10))    // 10 (clamped to max)
print(clamp(0.5, 0.0, 1.0)) // 0.5 (works with floats)
```

---

## Rounding Functions

### `round(x)`

Rounds to the nearest integer (0.5 rounds to nearest even).

```crespi
print(round(3.4))   // 3
print(round(3.5))   // 4
print(round(3.6))   // 4
print(round(-2.5))  // -2
```

### `floor(x)`

Rounds down (toward negative infinity).

```crespi
print(floor(3.7))   // 3
print(floor(-3.2))  // -4
```

### `ceil(x)`

Rounds up (toward positive infinity).

```crespi
print(ceil(3.2))    // 4
print(ceil(-3.7))   // -3
```

### `truncate(x)`

Rounds toward zero.

```crespi
print(truncate(3.7))   // 3
print(truncate(-3.7))  // -3
```

---

## Trigonometric Functions

All trigonometric functions work with radians.

### `sin(x)`, `cos(x)`, `tan(x)`

```crespi
print(sin(0))           // 0.0
print(sin(PI / 2))      // 1.0
print(cos(0))           // 1.0
print(cos(PI))          // -1.0
print(tan(PI / 4))      // 1.0
```

### `asin(x)`, `acos(x)`, `atan(x)`

Inverse trigonometric functions.

```crespi
print(asin(1))          // 1.5707... (PI/2)
print(acos(0))          // 1.5707... (PI/2)
print(atan(1))          // 0.7853... (PI/4)
```

### `atan2(y, x)`

Two-argument arctangent (angle from x-axis to point (x, y)).

```crespi
print(atan2(1, 1))      // 0.7853... (PI/4 = 45 degrees)
print(atan2(0, -1))     // 3.1415... (PI = 180 degrees)
```

---

## Exponential & Logarithmic

### `exp(x)`

Returns e^x.

```crespi
print(exp(0))    // 1.0
print(exp(1))    // 2.71828... (E)
print(exp(2))    // 7.38905...
```

### `ln(x)`

Natural logarithm (base e).

```crespi
print(ln(1))     // 0.0
print(ln(E))     // 1.0
print(ln(10))    // 2.302585...
```

### `log10(x)`, `log2(x)`

Base-10 and base-2 logarithms.

```crespi
print(log10(100))   // 2.0
print(log10(1000))  // 3.0
print(log2(8))      // 3.0
print(log2(1024))   // 10.0
```

### `hypot(x, y)`

Returns sqrt(x^2 + y^2) without overflow.

```crespi
print(hypot(3, 4))  // 5.0 (3-4-5 triangle)
print(hypot(5, 12)) // 13.0
```

---

## Random Numbers

### `random()`

Returns a random float between 0.0 (inclusive) and 1.0 (exclusive).

```crespi
print(random())  // 0.123456... (varies)

// Random integer in range [0, n)
fn random_int(n: Int) -> Int {
    return floor(random() * n)
}

print(random_int(100))  // 0-99
```

### `random_seed(seed)`

Seeds the random number generator for reproducible results.

```crespi
random_seed(42)
print(random())  // Always same value with seed 42
print(random())  // Next deterministic value
```

---

## Practical Examples

### Distance Between Points

```crespi
fn distance(x1: Float, y1: Float, x2: Float, y2: Float) -> Float {
    return hypot(x2 - x1, y2 - y1)
}

print(distance(0, 0, 3, 4))  // 5.0
```

### Degrees to Radians

```crespi
fn deg_to_rad(degrees: Float) -> Float {
    return degrees * PI / 180
}

fn rad_to_deg(radians: Float) -> Float {
    return radians * 180 / PI
}

print(deg_to_rad(90))   // 1.5707... (PI/2)
print(rad_to_deg(PI))   // 180.0
```

### Quadratic Formula

```crespi
fn solve_quadratic(a: Float, b: Float, c: Float) -> (Float, Float) {
    var discriminant = b * b - 4 * a * c
    var sq = sqrt(discriminant)
    var x1 = (-b + sq) / (2 * a)
    var x2 = (-b - sq) / (2 * a)
    return (x1, x2)
}

var (r1, r2) = solve_quadratic(1, -5, 6)
print("x = $r1 or x = $r2")  // x = 3 or x = 2
```

---

## See Also

- [Standard Library](index.md) - All modules
- [Operators](../operators.md) - Arithmetic operators
