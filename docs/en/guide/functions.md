# Functions

> **Language:** [Español](../../es/guia/funciones.md) | English

---

Functions in Crespi allow you to encapsulate and reuse code.

## Basic Declaration

Use `fn` to define a function with type annotations:

```crespi
fn greet() {
    print("Hello!")
}

greet()  // Hello!
```

### With Parameters

```crespi
fn greet(name: String) {
    print("Hello, " + name + "!")
}

greet("Ana")    // Hello, Ana!
greet("Carlos") // Hello, Carlos!
```

### With Multiple Parameters

```crespi
fn add(a: Int, b: Int) -> Int {
    return a + b
}

print(add(3, 5))   // 8
print(add(10, 20)) // 30
```

---

## Return Value

Use `return` to return a value. Specify the return type with `->`:

```crespi
fn square(x: Int) -> Int {
    return x * x
}

var r = square(5)
print(r)  // 25
```

### Early Return

`return` terminates the function immediately:

```crespi
fn absolute(n: Int) -> Int {
    if n < 0 {
        return -n
    }
    return n
}

print(absolute(-5))  // 5
print(absolute(3))   // 3
```

### No Explicit Return

If there's no `return`, the function returns `null`:

```crespi
fn greet(name: String) {
    print("Hello, " + name)
}

var r = greet("Ana")
print(r)  // null
```

---

## Single-Expression Syntax

For simple functions, use the short syntax with `fn` and `=`:

```crespi
// Standard syntax
fn double(x: Int) -> Int {
    return x * 2
}

// Short syntax (equivalent)
fn double(x: Int) -> Int = x * 2
```

### More Examples

```crespi
// Single expression
fn square(x: Int) -> Int = x * x
fn triple(x: Int) -> Int = x * 3

// Multiple parameters
fn sum(a: Int, b: Int) -> Int = a + b
fn average(a: Float, b: Float) -> Float = (a + b) / 2.0

// No parameters
fn getPi() -> Float = 3.14159
fn greeting() -> String = "Hello world"

// Usage
print(square(4))            // 16
print(sum(10, 5))           // 15
print(average(80.0, 90.0))  // 85.0
```

---

## Default Parameters

You can assign default values to parameters:

```crespi
fn greet(name: String = "World") {
    print("Hello, " + name)
}

greet()       // Hello, World
greet("Ana")  // Hello, Ana
```

### Multiple Parameters with Defaults

```crespi
fn createMessage(text: String, repetitions: Int = 1, separator: String = " ") -> String {
    var message = ""
    var i = 0

    while i < repetitions {
        if i > 0 {
            message = message + separator
        }
        message = message + text
        i += 1
    }

    return message
}

print(createMessage("Hello"))           // Hello
print(createMessage("Hello", 3))        // Hello Hello Hello
print(createMessage("Hello", 3, "-"))   // Hello-Hello-Hello
```

---

## Functions as Values

Functions are first-class values:

### Assign to Variables

```crespi
fn duplicate(x: Int) -> Int {
    return x * 2
}

var operation = duplicate
print(operation(5))  // 10
```

### Pass as Argument

```crespi
fn apply(f: (Int) -> Int, value: Int) -> Int {
    return f(value)
}

fn square(x: Int) -> Int = x * x
fn cube(x: Int) -> Int = x * x * x

print(apply(square, 4))  // 16
print(apply(cube, 3))    // 27
```

### Return Functions

```crespi
fn createMultiplier(factor: Int) -> (Int) -> Int {
    fn multiply(x: Int) -> Int {
        return x * factor
    }
    return multiply
}

var double = createMultiplier(2)
var triple = createMultiplier(3)

print(double(5))   // 10
print(triple(5))   // 15
```

---

## Closures

Functions capture variables from their environment:

```crespi
fn createCounter() -> () -> Int {
    var count = 0

    fn increment() -> Int {
        count += 1
        return count
    }

    return increment
}

var counter = createCounter()
print(counter())  // 1
print(counter())  // 2
print(counter())  // 3
```

### Multiple Closures

```crespi
fn createCounterWithStep(step: Int) -> () -> Int {
    var count = 0

    fn next() -> Int {
        count += step
        return count
    }

    return next
}

var byOne = createCounterWithStep(1)
var byFive = createCounterWithStep(5)

print(byOne())    // 1
print(byOne())    // 2
print(byFive())   // 5
print(byFive())   // 10
```

---

## Recursion

Functions can call themselves:

### Factorial

```crespi
fn factorial(n: Int) -> Int {
    if n <= 1 {
        return 1
    }
    return n * factorial(n - 1)
}

print(factorial(5))  // 120 (5 * 4 * 3 * 2 * 1)
```

### Fibonacci

```crespi
fn fibonacci(n: Int) -> Int {
    if n <= 1 {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

print(fibonacci(10))  // 55
```

### Tail Recursion

For deep recursion, use accumulators:

```crespi
fn factorialTail(n: Int, acc: Int = 1) -> Int {
    if n <= 1 {
        return acc
    }
    return factorialTail(n - 1, n * acc)
}

print(factorialTail(5))  // 120
```

---

## Inlining

Hint to the native compiler to inline a function's body at call sites using the `@inline` decorator. This can improve performance for small, frequently called functions by avoiding function call overhead.

```crespi
@inline
fn add(a: Int, b: Int) -> Int = a + b

// This call is replaced by the actual addition instruction in the binary
var sum = add(5, 10)
```

---

## Nested Functions

Define functions inside other functions:

```crespi
fn calculateTaxes(price: Float) -> Float {
    let RATE = 0.16

    fn applyRate(amount: Float) -> Float {
        return amount * RATE
    }

    var tax = applyRate(price)
    return price + tax
}

print(calculateTaxes(100.0))  // 116.0
```

---

## Generic Functions

Functions can have type parameters. Type parameters go **before** the function name:

```crespi
fn [T] identity(x: T) -> T {
    return x
}

print(identity(42))      // 42
print(identity("hello")) // hello

fn [T, U] transform(value: T, f: (T) -> U) -> U {
    return f(value)
}

var doubled = transform(5, { x -> x * 2)
print(doubled)  // 10
```

---

## Async Lambdas

Async lambdas use the same `async` prefix as functions and return `Task[T]`.

```crespi
var increment = async { x -> x + 1
var result = await increment(41)
print(result)  // 42
```

---

## Common Patterns

### Map (Transform List)

```crespi
fn [T, U] myMap(list: List[T], transform: (T) -> U) -> List[U] {
    var result = []

    for item in list {
        result.push(transform(item))
    }

    return result
}

fn double(x: Int) -> Int = x * 2

var numbers = [1, 2, 3, 4, 5]
print(myMap(numbers, double))  // [2, 4, 6, 8, 10]
```

### Filter

```crespi
fn [T] myFilter(list: List[T], predicate: (T) -> Bool) -> List[T] {
    var result = []

    for item in list {
        if predicate(item) {
            result.push(item)
        }
    }

    return result
}

fn isEven(n: Int) -> Bool = n % 2 == 0

var numbers = [1, 2, 3, 4, 5, 6]
print(myFilter(numbers, isEven))  // [2, 4, 6]
```

### Reduce (Accumulate)

```crespi
fn [T, U] myReduce(list: List[T], accumulator: (U, T) -> U, initial: U) -> U {
    var result = initial

    for item in list {
        result = accumulator(result, item)
    }

    return result
}

fn add(a: Int, b: Int) -> Int = a + b

var numbers = [1, 2, 3, 4, 5]
print(myReduce(numbers, add, 0))  // 15
```

---

## See Also

- [Variables and Constants](variables.md)
- [Advanced Features](advanced.md) - Memoization and TCO
- [Classes and Objects](classes.md)
