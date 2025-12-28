# Keywords

> **Language:** [Español](../../es/referencia/palabras-clave.md) | English

---

Crespi has reserved words that cannot be used as identifiers. English keywords are canonical; language packs provide localized aliases that are normalized during lexing.

## Reference Table

| Keyword | Spanish Alias | Category | Description |
|---------|---------------|----------|-------------|
| `var` | `variable` | Declaration | Declares a mutable variable |
| `let` | `immutable` | Declaration | Declares an immutable constant |
| `static` | `estatico` | Declaration | Declares a static member or static initialization block |
| `public` | `publico` | Declaration | Public visibility modifier |
| `private` | `privado` | Declaration | Private visibility modifier |
| `internal` | `interno` | Declaration | Internal visibility modifier |
| `fileprivate` | `fileprivate` | Declaration | File-private visibility modifier |
| `fn` | `bloque` | Functions | Defines a function |
| `async` | `asincrono` | Async | Marks a function as async (returns a `Task`) |
| `await` | `esperar` | Async | Awaits a `Task` and unwraps its value |
| `extern` | `externo` | Functions | Declares an external (FFI) function |
| `return` | `resultado` | Functions | Returns a value from a function |
| `if` | `si` | Control | Conditional |
| `else` | `o` | Control | Alternative in conditional |
| `guard` | `asegura` | Control | Guard condition with return |
| `when` | `cuando` | Control | Pattern matching |
| `is` | `es` | Control | Match arm |
| `default` | `defecto` | Control | Match fallback |
| `while` | `mientras` | Control | Loop while condition is true |
| `for` | `repetir` | Control | For-each loop |
| `in` | `en` | Control | Iterator (used with `for`) |
| `break` | `salir` | Control | Exits current loop |
| `continue` | `continuar` | Control | Skips to next iteration |
| `class` | `tipo` | OOP | Defines a class |
| `nested` | `anidado` | OOP | Defines a nested (static) class |
| `inner` | `interno` | OOP | Defines an inner class (captures outer instance) |
| `trait` | `trait` | OOP | Defines a trait (interface with optional default implementations) |
| `extends` | `extiende` | OOP | Reserved (use `:` for inheritance) |
| `implements` | `implementa` | OOP | Reserved (use `:` for traits) |
| `this` | `yo` | OOP | Reference to current instance |
| `super` | `super` | OOP | Reference to parent class |
| `operator` | `operador` | OOP | Operator overloading |
| `import` | `importar` | Modules | Imports a module or symbol |
| `extension` | `extension` | OOP | Extends existing types with methods |
| `true` | `verdadero` | Literals | Boolean true value |
| `false` | `falso` | Literals | Boolean false value |
| `null` / `nil` | `nada` | Literals | Null value |
| `and` | `and` | Logical | Logical AND |
| `or` | `or` | Logical | Logical OR |


---

## Declarations

### Visibility modifiers

Visibility controls how top-level symbols can be imported from other files:

- `public` (default): accessible everywhere
- `internal`: accessible only from files in the same directory
- `fileprivate`: accessible only from the current file (Swift-style)
- `private`: same as `fileprivate` (for backward compatibility)

### `var`

Declares a mutable variable that can change its value.

```crespi
var counter = 0
counter = counter + 1    // OK
var name = "Ana"
name = "Luis"            // OK
```

### `let`

Declares an immutable constant. Its value cannot change after initial assignment.

```crespi
let PI = 3.14159
let MAX_ATTEMPTS = 3

// PI = 3.0    // Error: cannot reassign a constant
```

### `static`

Declares a static method, static field, or static initialization block inside a class.

```crespi
class Config {
    static let version = "1.0"
    static { print(Config.version) }
}
```

---

## Functions

### `fn`

Defines a function. Can have parameters and a body with multiple statements.

```crespi
// Basic function
fn greet(name) {
    print("Hello, " + name)
}

// Function with return
fn square(x) {
    return x * x
}

// Single-expression syntax
fn double(x) = x * 2

// With default parameters
fn power(base, exp = 2) {
    var r = 1
    for i in [1, 2, 3] {
        r = r * base
    }
    return r
}
```

### `async`

Marks a function as asynchronous. Async functions execute eagerly for now and return a `Task[T]`.

```crespi
async fn get_answer() -> Int {
    return 42
}

var task = get_answer()
var value = await task
```

Async also works with lambdas: `var f = async x => x + 1`.

### `await`

Unwraps a `Task` and yields its value. Using `await` on a non-task is an error.

```crespi
async fn value() -> String { return "ok" }
var result = await value()
```

### `extern`

Declares an external function from a native (Rust/C) library. Used for FFI (Foreign Function Interface).

```crespi
// Bind to a different native symbol name
#[link_name = "my_add_impl"]
extern fn my_add(a: Int, b: Int) -> Int
extern fn my_sin(x: Float) -> Float

fn main() {
    print(my_add(10, 32))  // 42
}
```

Compile with library: `crespic program.crespi -L libmylib.a`

### `return`

Returns a value from a function and terminates its execution.

```crespi
fn max(a, b) {
    if a > b {
        return a
    }
    return b
}

fn factorial(n) {
    if n <= 1 {
        return 1
    }
    return n * factorial(n - 1)
}
```

---

## Control Flow

### `if` / `else`

Conditional structure to execute code based on a condition.

```crespi
var age = 18

// Simple conditional
if age >= 18 {
    print("Adult")
}

// With alternative
if age >= 18 {
    print("Adult")
} else {
    print("Minor")
}

// Multiple conditions
if age >= 65 {
    print("Retired")
} else if age >= 18 {
    print("Adult")
} else if age >= 13 {
    print("Teenager")
} else {
    print("Child")
}
```

### `while`

Loop that executes while the condition is true.

```crespi
var i = 0

while i < 5 {
    print(i)
    i += 1
}
// Output: 0, 1, 2, 3, 4
```

### `for` / `in`

Loop to iterate over elements of a collection.

```crespi
// Iterate over list
var numbers = [1, 2, 3, 4, 5]
for n in numbers {
    print(n * 2)
}

// Iterate over text
var word = "Hello"
for letter in word {
    print(letter)
}
```

### `break`

Terminates the current loop immediately.

```crespi
var numbers = [1, 2, 3, 4, 5]

for n in numbers {
    if n == 3 {
        break
    }
    print(n)
}
// Output: 1, 2
```

### `continue`

Skips to the next loop iteration.

```crespi
var numbers = [1, 2, 3, 4, 5]

for n in numbers {
    if n == 3 {
        continue
    }
    print(n)
}
// Output: 1, 2, 4, 5
```

---

## Object-Oriented Programming

### `class`

Defines a class with properties and methods.

```crespi
class Person(let name, let age) {
    fn introduce() {
        print("I am " + this.name + ", " + str(this.age) + " years old")
    }
}

var p = Person("Ana", 25)
p.introduce()  // I am Ana, 25 years old
```

### `:` (inheritance)

Indicates that a class inherits from another class or implements traits.

```crespi
class Animal(let name) {
    fn speak() {
        print(this.name + " makes a sound")
    }
}

class Dog(let name, let breed) : Animal(name) {
    fn speak() {
        print(this.name + " barks")
    }
}

var fido = Dog("Fido", "Labrador")
fido.speak()  // Fido barks
```

### `this`

Reference to the current instance within a method.

```crespi
class Counter {
    constructor() {
        this.value = 0
    }

    fn increment() {
        this.value += 1
    }

    fn get() {
        return this.value
    }
}
```

### `super`

Accesses methods of the parent class.

```crespi
class Vehicle(let brand) {
}

class Car(let brand, let model) : Vehicle(brand) {  // Calls Vehicle's constructor
}
```

### `operator`

Defines operator overloading for custom types.

```crespi
class Vector(let x, let y) {
    operator +(other) {
        return Vector(this.x + other.x, this.y + other.y)
    }

    operator ==(other) {
        return this.x == other.x && this.y == other.y
    }
}

var v1 = Vector(1, 2)
var v2 = Vector(3, 4)
var v3 = v1 + v2  // Vector(4, 6)
```

---

## Modules and Extensions

### `import`

Imports a module and optionally brings specific symbols into scope. Use `{ ... }` for direct access without the module prefix.

```crespi
import Math.Vector
import Helper { double, Point }
import Helper as H { double }
import fn Utils.format
import class Math.Point
```

### `extension`

Adds methods to existing types. Extension targets use runtime type names; English is canonical and language packs may provide aliases like `Texto`, `Entero`, `Lista`.

```crespi
extension Texto {
    fn shout() = uppercase(this) + "!"
}
```

---

## Literals

### `true` / `false`

Boolean values.

```crespi
var active = true
var finished = false

if active && !finished {
    print("In progress")
}
```

### `null`

Represents the absence of a value. `nil` is an alias.

```crespi
var result = null

fn find(list, value) {
    for item in list {
        if item == value {
            return item
        }
    }
    return null
}

var found = find([1, 2, 3], 5)
if found == null {
    print("Not found")
}
```

---

## See Also

- [Operators](operators.md)
- [Built-in Functions](functions.md)
- [Data Types](types.md)
