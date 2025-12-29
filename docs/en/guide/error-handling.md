# Error Handling

Crespi provides comprehensive error handling with Swift-style semantics, including try/catch blocks, checked exceptions, defer statements for cleanup, and a Result type for functional-style error handling.

## Try/Catch Blocks

Use `try` and `catch` to handle errors that might occur during execution:

```crespi
try {
    // Code that might throw an error
    var result = riskyOperation()
    print(result)
} catch error {
    // Handle the error
    print("An error occurred: " + error)
}
```

### Multiple Catch Clauses

You can have multiple catch clauses that are matched in order from top to bottom:

```crespi
try {
    processFile("data.txt")
} catch FileError.notFound(path) {
    print("File not found: " + path)
} catch FileError.permissionDenied {
    print("Permission denied")
} catch error {
    print("Unknown error: " + error)
}
```

### Nested Try Blocks

Try blocks can be nested, and inner catches handle errors before outer catches:

```crespi
try {
    try {
        throw "inner error"
    } catch e {
        print("Caught in inner: " + e)
    }
} catch e {
    print("Caught in outer: " + e)
}
```

## Throw Statement

Use `throw` to raise an error. The thrown value must implement the `Error` trait:

```crespi
fn readFile(path) throws {
    if !fileExists(path) {
        throw IOError("File not found: " + path)
    }
    // Read file contents...
}
```

## Throws Annotation (Checked Exceptions)

Functions that can throw errors must be marked with the `throws` keyword in their signature:

```crespi
// Function that can throw
fn divide(a, b) throws -> Int {
    if b == 0 {
        throw ValueError("Division by zero")
    }
    return a / b
}

// Calling a throwing function requires try
fn calculate() throws {
    var result = try divide(10, 0)  // Must use try
    print(result)
}
```

### Rules for Throws

1. Any function containing `throw` must be marked with `throws`
2. Any function calling a throwing function must either:
   - Catch the error with try/catch, OR
   - Also be marked with `throws` to propagate the error
3. Calling a throwing function requires `try` at the call site

## Try Expression Variants

Crespi provides three variants of the `try` expression:

### Basic Try

Propagates the error to the enclosing try/catch or throws declaration:

```crespi
fn process() throws {
    var data = try loadData()  // Propagates error if thrown
    return data
}
```

### Try Optional (try?)

Converts thrown errors to `null`, making the return type nullable:

```crespi
fn safeLoad() {
    var data = try? loadData()  // Returns null if error thrown
    if data == null {
        print("Failed to load data")
    }
}
```

### Try Force (try!)

Forces unwrapping - crashes the program if an error is thrown. Use only when you're certain no error will occur:

```crespi
fn mustSucceed() {
    var data = try! loadData()  // Crashes if error thrown
    print(data)
}
```

## Defer Statement

The `defer` statement schedules cleanup code to run when leaving a scope, regardless of whether the exit is normal or due to an error:

```crespi
fn processFile(path) throws {
    var file = openFile(path)

    defer {
        closeFile(file)  // Always executes when leaving function
    }

    // Process file (might throw)
    var data = try parseData(file)
    return data
}
```

### Defer Execution Order

Multiple defer statements in the same scope execute in **LIFO order** (last declared, first executed):

```crespi
fn example() {
    defer { print("First declared") }
    defer { print("Second declared") }
    defer { print("Third declared") }

    print("Function body")
}

// Output:
// Function body
// Third declared
// Second declared
// First declared
```

### Defer with Errors

Defers execute even when errors are thrown:

```crespi
fn cleanup() throws {
    var resource = acquire()

    defer { release(resource) }  // Runs even if error thrown

    throw RuntimeError("Something went wrong")
    // defer still executes before unwinding
}
```

**Important**: Errors thrown inside defer blocks are logged but do not replace the original error being propagated.

## Error Trait

All throwable types must implement the `Error` trait, which requires a `message()` method:

```crespi
trait Error {
    fn message() -> String
}
```

### Built-in Error Types

Crespi provides four standard error types:

```crespi
// General runtime errors
throw RuntimeError("Something went wrong")

// Type-related errors
throw TypeError("Expected Int, got String")

// Invalid value errors
throw ValueError("Value out of range")

// Input/output errors
throw IOError("File not found")
```

### Custom Error Types

Create custom error types by implementing the Error trait:

```crespi
class FileError implements Error {
    constructor(message) {
        this.msg = message
    }

    fn message() {
        return "File Error: " + this.msg
    }
}

// Use custom error
fn readFile(path) throws {
    if !exists(path) {
        throw FileError("File not found: " + path)
    }
}
```

## Result Type

The `T | E` type provides functional-style error handling as an alternative to exceptions:

```crespi
// Function returning Result instead of throwing
fn divide(a, b) -> Int | String {
    if b == 0 {
        return Result.Err("Division by zero")
    }
    return Result.Ok(a / b)
}
```

### Creating Results

Use `Result.Ok()` and `Result.Err()` to create Result values:

```crespi
var success = Result.Ok(42)
var failure = Result.Err("Something went wrong")
```

### Checking Results

Use `isOk()` and `isErr()` to check which variant you have:

```crespi
var result = divide(10, 2)

if result.isOk() {
    print("Success!")
} else {
    print("Error occurred")
}
```

### Unwrapping Results

Several methods are available to extract values from Results:

```crespi
// unwrap() - Get value or crash
var value = result.unwrap()  // Panics if Err

// unwrapOr() - Get value or return default
var value = result.unwrapOr(0)  // Returns 0 if Err

// unwrapOrElse() - Get value or compute from error
var value = result.unwrapOrElse(err => -1)  // Computes fallback

// unwrapErr() - Get error or crash
var error = result.unwrapErr()  // Panics if Ok
```

## Result Combinators

Results support functional programming patterns with combinator methods:

### map() - Transform Success Value

Transform the value inside an Ok, leaving Err unchanged:

```crespi
var result = Result.Ok(21)
var doubled = result.map(x => x * 2)
// doubled is Result.Ok(42)

var error = Result.Err("failed")
var mapped = error.map(x => x * 2)
// mapped is still Result.Err("failed")
```

### mapErr() - Transform Error Value

Transform the error inside an Err, leaving Ok unchanged:

```crespi
var result = Result.Err("not found")
var wrapped = result.mapErr(e => "Error: " + e)
// wrapped is Result.Err("Error: not found")
```

### flatMap() - Chain Operations

Chain multiple Result-returning operations:

```crespi
fn parseNumber(s) -> Int | String {
    // Parse string to number
}

fn divideBy(n) -> Int | String {
    return x => {
        if x == 0 {
            return Result.Err("Division by zero")
        }
        return Result.Ok(n / x)
    }
}

var result = parseNumber("2")
    .flatMap(divideBy(10))
// result is Result.Ok(5)
```

## Error Propagation Operator (?)

The `?` operator provides early return for Result types:

```crespi
fn compute() -> Int | String {
    var a = parseNumber("10")?  // Returns Err if parse fails
    var b = parseNumber("5")?   // Returns Err if parse fails
    return Result.Ok(a + b)
}
```

The `?` operator:
- Unwraps Ok values and continues
- Early-returns Err values from the enclosing function
- Works only in functions that return Result

### Chaining with ?

You can chain multiple operations:

```crespi
var result = getValue()?
    .processData()?
    .finalizeResult()?
```

## Async Integration

Error handling works seamlessly with async functions:

### Async Throwing Functions

Declare async functions that can throw:

```crespi
async fn fetchData(url) throws -> String {
    var response = try await httpGet(url)
    return response.body
}
```

### Call Site

Use both `try` and `await` when calling async throwing functions:

```crespi
async fn main() throws {
    try {
        var data = try await fetchData("https://api.example.com")
        print(data)
    } catch error {
        print("Failed to fetch: " + error)
    }
}
```

**Order matters**: `try` comes before `await` (error handling wraps the await).

## Best Practices

### Use try/catch for recoverable errors

```crespi
try {
    var data = loadConfiguration()
    app.configure(data)
} catch error {
    // Fall back to defaults
    app.configure(defaultConfig())
}
```

### Use defer for cleanup

```crespi
fn processLargeFile(path) throws {
    var file = openFile(path)
    defer { closeFile(file) }

    var reader = createReader(file)
    defer { reader.close() }

    // Process file - all resources cleaned up even if error thrown
    return try reader.readAll()
}
```

### Use Result for functional pipelines

```crespi
var result = parseInput(userInput)
    .map(x => x * 2)
    .flatMap(validate)
    .map(format)

if result.isOk() {
    print(result.unwrap())
} else {
    print("Error: " + result.unwrapErr())
}
```

### Use ? for concise error propagation

```crespi
fn pipeline() -> String | String {
    var data = loadData()?
    var validated = validate(data)?
    var processed = process(validated)?
    return Result.Ok(processed)
}
```

### Avoid try! unless you're certain

```crespi
// Good: only use try! when you're absolutely sure it won't fail
var config = try! loadEmbeddedConfig()  // Embedded config always exists

// Bad: don't use try! for external resources
var data = try! fetchFromNetwork()  // Could fail - use try? or try/catch
```

## Spanish Keywords

Error handling works with Spanish keywords via the language pack:

| English | Spanish |
|---------|---------|
| `try` | `intenta` |
| `catch` | `capturar` |
| `throw` | `lanzar` |
| `throws` | `lanza` |
| `defer` | `diferir` |

Example:

```crespi
bloque leerArchivo(ruta) lanza -> Texto {
    intenta {
        resultado archivo = abrirArchivo(ruta)
        diferir { cerrarArchivo(archivo) }
        resultado archivo.leerTodo()
    } capturar error {
        lanzar ErrorES("No se pudo leer: " + ruta)
    }
}
```

## Summary

- **try/catch**: Handle errors with exception-style control flow
- **throw**: Raise errors (requires `throws` in function signature)
- **defer**: Schedule cleanup code that always runs
- **try?**: Convert errors to null
- **try!**: Force unwrap (crash on error)
- **T | E**: Functional-style error handling
- **?** operator: Early return on Err values
- **Error trait**: All throwable types implement `message()`

Choose the error handling style that best fits your use case:
- **Exceptions**: For recoverable errors with clear recovery paths
- **Result**: For functional pipelines and composable error handling
- **Combination**: Use both where appropriate (Result for data processing, exceptions for resource management)
