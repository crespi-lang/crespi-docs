# Advanced Features

> **Language:** [Español](../../es/guia/avanzado.md) | English

---

This chapter covers Crespi's advanced features: memoization, tail-call optimization, and more.

## Memoization

Memoization caches function results to avoid repeated calculations.

### The `@memoize` Decorator

Apply automatic memoization to a function:

```crespi
@memoize
fn fibonacci(n: Int) -> Int {
    if n <= 1 {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

print(fibonacci(40))  // Fast thanks to cache
```

### Without Memoization (Slow)

Without memoization, Fibonacci calculates the same values many times:

```crespi
// Without @memoize - very slow for large n
fn fib_slow(n: Int) -> Int {
    if n <= 1 {
        return n
    }
    return fib_slow(n - 1) + fib_slow(n - 2)
}

// fib_slow(40) would take a very long time
```

### The `memoize()` Function

You can also use the `memoize()` function directly:

```crespi
fn factorial(n: Int) -> Int {
    if n <= 1 {
        return 1
    }
    return n * factorial(n - 1)
}

var factorial_memo = memoize(factorial)

print(factorial_memo(100))  // Uses cache
print(factorial_memo(100))  // Retrieves from cache instantly
```

### When to Use Memoization

- Recursive functions with repeated subproblems
- Pure functions (no side effects)
- Expensive calculations with the same arguments

```crespi
// Good case: expensive calculation, repeated arguments
@memoize
fn calculate_route(origin: String, destination: String) -> String {
    // Simulate expensive calculation
    return origin + " -> " + destination
}

// Bad case: function with side effects
// Do not use @memoize here
fn get_time() -> String {
    // This would return the same cached value forever
    return "current time"
}
```

### With Short Syntax

```crespi
@memoize
fn square(n: Int) -> Int = n * n

@memoize
fn cube(n: Int) -> Int = n * n * n

print(square(1000))  // Calculated
print(square(1000))  // From cache
```

---

## Function Inlining

Function inlining replaces function calls with the function body, eliminating call overhead.

### The `@inline` Decorator

Mark functions for inlining at compile time:

```crespi
@inline
fn double(x: Int) -> Int {
    return x * 2
}

fn main() {
    // The compiler replaces this with: result = 21 * 2
    var result = double(21)
    print(result)
}
```

### When to Use `@inline`

- Small utility functions called frequently
- Functions in performance-critical loops
- Simple getters/setters

```crespi
@inline
fn square(n: Int) -> Int = n * n

@inline
fn isPositive(n: Int) -> Bool = n > 0

// Good candidates: small, frequently called
for i in range(1000000) {
    if isPositive(i) {
        total = total + square(i)
    }
}
```

### Limitations

- Recursive functions are never inlined (would cause infinite expansion)
- Functions with closures are not inlined
- The decorator has no effect on the interpreter (runtime behavior unchanged)

### Auto-Inlining (at -O2)

At optimization level `-O2`, the compiler automatically inlines small functions (≤5 statements) even without the decorator:

```crespi
// This function is auto-inlined at -O2
fn add(a: Int, b: Int) -> Int {
    return a + b
}
```

See [Compiler Documentation](compiler.md#optimization-levels) for more details.

---

## Tail-Call Optimization (TCO)

Crespi automatically optimizes tail-recursive functions, allowing deep recursion without stack overflow.

### What is Tail Recursion?

A recursive call is "tail" when it's the last operation of the function:

```crespi
// Tail recursion - optimizable
fn factorial_tail(n: Int, acc: Int = 1) -> Int {
    if n <= 1 {
        return acc
    }
    return factorial_tail(n - 1, n * acc)  // Last operation
}

// NOT tail recursion
fn factorial_normal(n: Int) -> Int {
    if n <= 1 {
        return 1
    }
    return n * factorial_normal(n - 1)  // Multiplication after
}
```

### Benefits of TCO

```crespi
// Without TCO, this would cause stack overflow
// With TCO, it works for very large values

fn sum_to(n: Int, acc: Int = 0) -> Int {
    if n <= 0 {
        return acc
    }
    return sum_to(n - 1, acc + n)
}

print(sum_to(10000))  // 50005000 - Works thanks to TCO
```

### Converting to Tail Recursion

General pattern: use an accumulator:

```crespi
// Fibonacci with accumulators (TCO)
fn fibonacci_tail(n: Int, a: Int = 0, b: Int = 1) -> Int {
    if n == 0 {
        return a
    }
    if n == 1 {
        return b
    }
    return fibonacci_tail(n - 1, b, a + b)
}

print(fibonacci_tail(50))  // Fast and efficient
```

### Conversion Examples

**Power:**

```crespi
// Normal
fn power(base: Int, exp: Int) -> Int {
    if exp == 0 {
        return 1
    }
    return base * power(base, exp - 1)  // Not tail
}

// With TCO
fn power_tail(base: Int, exp: Int, acc: Int = 1) -> Int {
    if exp == 0 {
        return acc
    }
    return power_tail(base, exp - 1, acc * base)  // Is tail
}

print(power_tail(2, 20))  // 1048576
```

---

## Single-Expression Functions

Compact syntax for simple functions:

```crespi
// Standard form
fn double(x: Int) -> Int {
    return x * 2
}

// Single expression (equivalent)
fn double(x: Int) -> Int = x * 2
```

### Multiple Parameters

```crespi
fn sum(a: Int, b: Int) -> Int = a + b
fn average(a: Float, b: Float) -> Float = (a + b) / 2.0

// For complex logic, use standard form
fn maximum(a: Int, b: Int) -> Int {
    if a > b {
        return a
    }
    return b
}
```

### In Classes

```crespi
class Vector(let x: Float, let y: Float) {
    fn magnitude() -> Float = (this.x * this.x + this.y * this.y)
    fn scale(factor: Float) -> Vector = Vector(this.x * factor, this.y * factor)
}
```

---

## Automatic Semicolon Insertion (ASI)

Crespi automatically inserts semicolons at the end of lines when appropriate.

### When It Works

```crespi
// Semicolons are optional at end of line
var x = 10
var y = 20
print(x + y)

// Equivalent to:
var x = 10;
var y = 20;
print(x + y);
```

### When to Use Explicit Semicolons

For multiple statements on one line:

```crespi
var a = 1; var b = 2; print(a + b)
```

---

## Advanced Closures

### Encapsulated State

```crespi
fn create_module() -> Dict[String, () -> Int | (Int) -> ()] {
    var _private = 0

    fn increment() {
        _private += 1
    }

    fn get() -> Int {
        return _private
    }

    fn set(value: Int) {
        _private = value
    }

    return {
        "increment": increment,
        "get": get,
        "set": set
    }
}

var module = create_module()
module["increment"]()
module["increment"]()
print(module["get"]())  // 2
```

### Currying

```crespi
fn curry_add(a: Int) -> (Int) -> Int {
    fn add_b(b: Int) -> Int {
        return a + b
    }
    return add_b
}

var add_5 = curry_add(5)
print(add_5(3))   // 8
print(add_5(10))  // 15
```

### Manual Memoization

```crespi
fn [T, U] create_cache(fn: (T) -> U) -> (T) -> U {
    var cache = {}

    fn cached(arg: T) -> U {
        var key = str(arg)

        if cache.contains(key) {
            return cache[key]
        }

        var result = fn(arg)
        cache[key] = result
        return result
    }

    return cached
}

fn expensive_calc(n: Int) -> Int {
    // Simulate expensive calculation
    return n * n
}

var cached_calc = create_cache(expensive_calc)
print(cached_calc(100))  // Calculates
print(cached_calc(100))  // From cache
```

---

## Higher-Order Functions

### Function Composition

```crespi
fn [T, U, V] compose(f: (U) -> V, g: (T) -> U) -> (T) -> V {
    fn composed(x: T) -> V {
        return f(g(x))
    }
    return composed
}

fn double(x: Int) -> Int = x * 2
fn increment(x: Int) -> Int = x + 1

var double_then_increment = compose(increment, double)
print(double_then_increment(5))  // 11 (5*2 + 1)

var increment_then_double = compose(double, increment)
print(increment_then_double(5))  // 12 ((5+1) * 2)
```

### Partial Application

```crespi
fn [A, B, R] partial(fn: (A, B) -> R, first_arg: A) -> (B) -> R {
    fn applied(second_arg: B) -> R {
        return fn(first_arg, second_arg)
    }
    return applied
}

fn power(base: Int, exp: Int) -> Int {
    var r = 1
    var i = 0
    while i < exp {
        r = r * base
        i += 1
    }
    return r
}

var power_of_2 = partial(power, 2)  // base = 2
print(power_of_2(3))  // 2^3 = 8
print(power_of_2(4))  // 2^4 = 16
```

### Pipeline

```crespi
fn [T] pipe(value: T, functions: List[(T) -> T]) -> T {
    var result = value

    for fn in functions {
        result = fn(result)
    }

    return result
}

fn double(x: Int) -> Int = x * 2
fn increment(x: Int) -> Int = x + 1
fn square(x: Int) -> Int = x * x

var result = pipe(3, [double, increment, square])
print(result)  // ((3*2)+1)^2 = 49
```

---

## Design Patterns

### Custom Iterator

```crespi
fn create_range(start: Int, end: Int) -> Dict[String, () -> Bool | () -> Int] {
    var current = start

    fn has_next() -> Bool {
        return current < end
    }

    fn next() -> Int {
        var value = current
        current += 1
        return value
    }

    return {
        "has_next": has_next,
        "next": next
    }
}

var range = create_range(1, 5)

while range["has_next"]() {
    print(range["next"]())
}
// 1, 2, 3, 4
```

### Observer (Simplified)

```crespi
fn [T] create_observable() -> Dict[String, Any] {
    var _observers = []
    var _value: T? = null

    fn subscribe(observer: (T) -> ()) {
        _observers.push(observer)
    }

    fn notify() {
        for obs in _observers {
            obs(_value)
        }
    }

    fn set(new_value: T) {
        _value = new_value
        notify()
    }

    fn get() -> T? {
        return _value
    }

    return {
        "subscribe": subscribe,
        "set": set,
        "get": get
    }
}

var state = create_observable()

state["subscribe"](fn(value: Int) {
    print("Observer 1: " + str(value))
})

state["subscribe"](fn(value: Int) {
    print("Observer 2: " + str(value))
})

state["set"](42)
// Observer 1: 42
// Observer 2: 42
```

---

## See Also

- [Functions](functions.md)
- [Classes and Objects](classes.md)
- [Built-in Functions Reference](../reference/functions.md)
