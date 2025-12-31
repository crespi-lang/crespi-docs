# Built-in Functions

> **Language:** [Español](../../es/referencia/funciones.md) | English

---

> **See also:** [Standard Library Modules](std/index.md) for organized module documentation with detailed examples.

Crespi includes built-in functions available globally. English names are canonical; language packs provide localized aliases that are normalized during lexing.

Collection and string helpers are exposed as methods on their receivers (for example `list.length()`, `text.trim()`, `dict.keys()`), not as global functions.

## Reference Table

### Core Functions (Global)

| Function | Spanish Alias | Parameters | Returns | Description |
|----------|---------------|------------|---------|-------------|
| `print` | `mostrar` | value | `null` | Prints a value to output |
| `read` | `leer` | - | `string` | Reads a line from input |
| `typeof` | `tipo_de` | value | `string` | Gets the type name |
| `str` | `texto` | value | `string` | Converts to string |
| `int` | `entero` | value | `int` | Converts to integer |
| `float` | `decimal` | value | `float` | Converts to float |
| `memoize` | `memorizar` | function | `function` | Creates memoized function |
| `inline` | `inline` | function | `function` | Hints compiler to inline (no-op in interpreter) |

### Primitive Methods (Collections and Strings)

| Method | Spanish Alias | Receiver | Parameters | Returns | Description |
|--------|---------------|----------|------------|---------|-------------|
| `length` / `len` | `longitud` | string/list/tuple/dict | - | `int` | Gets the length |
| `push` | `agregar` | list | value | `null` | Appends to end of list |
| `pop` | `quitar` | list | - | value | Removes and returns last |
| `keys` | `claves` | dict | - | `list` | Gets the keys |
| `values` | `valores` | dict | - | `list` | Gets the values |
| `contains` | `contiene` | string/list/dict | value | `bool` | Checks if contains |

### Math Functions

| Function | Spanish Alias | Parameters | Returns | Description |
|----------|---------------|------------|---------|-------------|
| `abs` | `absoluto` | number | `number` | Absolute value |
| `sign` | `signo` | number | `int` | Sign of a number (-1, 0, 1) |
| `sqrt` | `raiz` | number | `float` | Square root |
| `cbrt` | `raiz_cubica` | number | `float` | Cube root |
| `pow` | `potencia` | base, exp | `float` | Power |
| `round` | `redondear` | number | `int` | Round to nearest integer |
| `floor` | `piso` | number | `int` | Round down |
| `ceil` | `techo` | number | `int` | Round up |
| `truncate` | `truncar` | number | `int` | Round toward zero |
| `min` | `minimo` | list or number, number | `number` | Minimum value |
| `max` | `maximo` | list or number, number | `number` | Maximum value |
| `random` | `aleatorio` | - | `float` | Random number (0.0–1.0) |
| `random_seed` | `semilla_aleatoria` | seed | `null` | Seed the RNG for deterministic random |
| `sin` | `seno` | number | `float` | Sine (radians) |
| `cos` | `coseno` | number | `float` | Cosine (radians) |
| `tan` | `tangente` | number | `float` | Tangent (radians) |
| `asin` | `aseno` | number | `float` | Arcsine |
| `acos` | `acoseno` | number | `float` | Arccosine |
| `atan` | `atangente` | number | `float` | Arctangent |
| `atan2` | `atangente2` | y, x | `float` | Two-argument arctangent |
| `exp` | `exponencial` | number | `float` | e^x |
| `ln` | `logaritmo_natural` | number | `float` | Natural log |
| `log10` | `logaritmo10` | number | `float` | Base-10 log |
| `log2` | `logaritmo2` | number | `float` | Base-2 log |
| `hypot` | `hipotenusa` | x, y | `float` | sqrt(x^2 + y^2) |
| `PI` | `PI` | - | `float` | π constant (use directly: `PI`) |
| `E` | `E` | - | `float` | Euler's number (use directly: `E`) |

### String Methods

| Function | Spanish Alias | Parameters | Returns | Description |
|----------|---------------|------------|---------|-------------|
| `split` | `dividir` | delimiter | `list` | Split string by delimiter |
| `trim` | `recortar` | - | `string` | Trim whitespace |
| `uppercase` | `mayusculas` | - | `string` | Uppercase string |
| `lowercase` | `minusculas` | - | `string` | Lowercase string |
| `substring` | `subcadena` | start, end? | `string` | Slice by character index |
| `replace` | `reemplazar` | old, new | `string` | Replace all occurrences |
| `starts_with` | `empieza_con` | prefix | `bool` | Prefix check |
| `ends_with` | `termina_con` | suffix | `bool` | Suffix check |
| `index_of` | `indice_de` | substring | `int` | Character index or -1 |
| `join` | `unir` | separator | `string` | Join list into string (on lists) |

### Collection Methods

| Function | Spanish Alias | Parameters | Returns | Description |
|----------|---------------|------------|---------|-------------|
| `map` | `mapear` | fn | `list` | Map items |
| `filter` | `filtrar` | fn | `list` | Filter items |
| `reduce` | `reducir` | fn, initial? | value | Reduce to a single value |
| `sort` | `ordenar` | comparator? | `list` | Sort list |
| `reverse` | `invertir` | - | `list` | Reverse list |
| `slice` | `cortar` | start, end? | `list` | Slice list |
| `find` | `encontrar` | fn | value | First match or null |
| `every` | `cada` | fn | `bool` | All match predicate |
| `some` | `alguno` | fn | `bool` | Any match predicate |
| `flatten` | `aplanar` | - | `list` | Flatten one level |

---

## Input/Output

### `print(value)`

Prints a value to standard output.

**Parameters:**
- `value` - Any value to display

**Returns:** `null`

```crespi
print("Hello, World!")     // Hello, World!
print(42)                   // 42
print(3.14)                 // 3.14
print(true)                 // true
print([1, 2, 3])            // [1, 2, 3]
print({"a": 1})             // {a: 1}
```

### `read()`

Reads a line of text from standard input.

**Parameters:** None

**Returns:** `string` - The line read (without trailing newline)

```crespi
print("What is your name?")
var name = read()
print("Hello, " + name + "!")

// Input: Ana
// Output: Hello, Ana!
```

---

## Types and Conversions

### `typeof(value)`

Gets the type name of a value as text.

**Parameters:**
- `value` - Any value

**Returns:** `string` - Type name

| Value | Result |
|-------|--------|
| `42` | `"int"` |
| `3.14` | `"float"` |
| `"hello"` | `"string"` |
| `true` | `"bool"` |
| `null` | `"null"` |
| `[1, 2]` | `"list"` |
| `{"a": 1}` | `"dict"` |
| function | `"function"` |
| instance | `"instance"` |
| task | `"task"` |

```crespi
print(typeof(42))           // int
print(typeof("hello"))      // string
print(typeof([1, 2, 3]))    // list

fn add(a, b) { return a + b }
print(typeof(add))          // function
```

### `str(value)`

Converts any value to its string representation.

**Parameters:**
- `value` - Any value

**Returns:** `string`

```crespi
print(str(42))              // "42"
print(str(3.14))            // "3.14"
print(str(true))            // "true"
print(str([1, 2, 3]))       // "[1, 2, 3]"

// Useful for concatenation
var age = 25
print("I am " + str(age) + " years old")
```

### `int(value)`

Converts a value to integer.

**Parameters:**
- `value` - Value to convert (`string`, `float`, `int`, `bool`)

**Returns:** `int`

**Errors:** If conversion is not possible

String values must be valid numeric text (no extra characters).

```crespi
print(int("42"))           // 42
print(int(3.7))            // 3 (truncates)
print(int(true))           // 1
print(int(false))          // 0

// Error
// int("abc")  // Error: Cannot convert 'abc' to integer
```

### `float(value)`

Converts a value to float (floating-point number).

**Parameters:**
- `value` - Value to convert (`string`, `float`, `int`)

**Returns:** `float`

**Errors:** If conversion is not possible

String values must be valid numeric text (no extra characters).

```crespi
print(float("3.14"))        // 3.14
print(float(42))            // 42.0
print(float("42"))          // 42.0

// Error
// float("abc")  // Error: Cannot convert 'abc' to float
```

---

## Collections

### `collection.length()`

Gets the number of elements in a collection. `len()` is an alias.

For strings, counts Unicode characters (not bytes). ASCII strings use a fast path.
`substring()` and `index_of()` also use character indices.

**Receiver:** `list`, `dict`, `tuple`, or `string`

**Returns:** `int` - Number of elements

**Errors:** If type is not supported

```crespi
print([1, 2, 3, 4, 5].length())     // 5
print("Hello".length())             // 5
print({"a": 1, "b": 2}.length())    // 2
print([].len())                      // 0
```

### `list.push(value)`

Appends an element to the end of a list. Modifies the original list.

**Receiver:** `list`

**Parameters:**
- `value` - The value to add

**Returns:** `null`

**Errors:** If receiver is not a list

```crespi
var numbers = [1, 2, 3]
numbers.push(4)
numbers.push(5)
print(numbers)   // [1, 2, 3, 4, 5]

var mixed = []
mixed.push("text")
mixed.push(42)
mixed.push(true)
print(mixed)     // [text, 42, true]
```

### `list.pop()`

Removes and returns the last element of a list. Modifies the original list.

**Receiver:** `list`

**Returns:** The removed element

**Errors:** If the list is empty or receiver is not a list

```crespi
var numbers = [1, 2, 3, 4, 5]
var last = numbers.pop()
print(last)    // 5
print(numbers) // [1, 2, 3, 4]

// Simulate a stack
var stack = []
stack.push("first")
stack.push("second")
print(stack.pop())   // second
print(stack.pop())   // first
```

### `dict.keys()`

Gets all keys of a dictionary as a list.

**Receiver:** `dict`

**Returns:** `list` of `string` - The keys

**Errors:** If receiver is not a dictionary

```crespi
var person = {
    "name": "Ana",
    "age": 25,
    "city": "Madrid"
}

var k = person.keys()
print(k)   // [name, age, city]

// Iterate over keys
for key in person.keys() {
    print(key + ": " + str(person[key]))
}
```

### `dict.values()`

Gets all values of a dictionary as a list.

**Receiver:** `dict`

**Returns:** `list` - The values

**Errors:** If receiver is not a dictionary

```crespi
var grades = {
    "math": 85,
    "physics": 90,
    "chemistry": 78
}

var v = grades.values()
print(v)   // [85, 90, 78]

// Calculate average
var sum = 0
for grade in grades.values() {
    sum += grade
}
var average = sum / grades.length()
print(average)  // 84
```

### `collection.contains(value)`

Checks if a collection contains a value.

**Receiver:** `list`, `dict`, or `string`

**Parameters:**
- `value` - The value to search for (for dictionaries, searches keys)

**Returns:** `bool`

**Errors:** If receiver type is not supported

```crespi
// In lists
var numbers = [1, 2, 3, 4, 5]
print(numbers.contains(3))      // true
print(numbers.contains(10))     // false

// In dictionaries (searches keys)
var person = {"name": "Ana", "age": 25}
print(person.contains("name"))  // true
print(person.contains("height"))  // false

// In strings (searches substring)
var message = "Hello World"
print(message.contains("World"))   // true
print(message.contains("Goodbye")) // false
```

---

## Advanced Functions

### `memoize(function)`

Creates a memoized version of a function. The memoized function caches results to avoid repeated calculations.

**Parameters:**
- `function` - The function to memoize

**Returns:** A new function with cache

**Errors:** If argument is not a function

```crespi
// Fibonacci without memoization (slow for large numbers)
fn fib(n) {
    if n <= 1 {
        return n
    }
    return fib(n - 1) + fib(n - 2)
}

// Fibonacci with memoization (fast)
var fib_memo = memoize(fib)

print(fib_memo(40))  // Fast thanks to cache
```

### `@memoize` Decorator

You can also use the `@memoize` decorator to apply memoization automatically:

```crespi
@memoize
fn fibonacci(n) {
    if n <= 1 {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

print(fibonacci(50))  // Efficient thanks to memoization
```

---

## Compiler Hints

### `inline(function)`

Hints to the native compiler that a function should be inlined at call sites. This is a no-op in the interpreter but can improve performance in compiled code for small, frequently called functions.

**Parameters:**
- `function` - The function to inline

**Returns:** The function itself

### `@inline` Decorator

The standard way to use this feature is via the decorator:

```crespi
@inline
fn add(a, b) {
    return a + b
}

// In compiled code, this call is replaced by the addition instruction directly
var sum = add(10, 20)
```

---

## Math Functions

Math builtins accept integers or floats. `min`/`max` accept either two numbers or a list. `PI` and `E` are constants.

```crespi
print(sqrt(9))        // 3
print(min([3, 1, 2])) // 1
print(PI)             // 3.14159...
var circumference = 2 * PI * radius
```

## String Methods

String indices are character-based. `substring()` and `index_of()` use character indices.

```crespi
print("hola".substring(1, 3))   // "ol"
print("cafe".index_of("fe"))    // 2
print("cafe".starts_with("ca")) // true
```

## Collection Methods

Collection helpers take a function or lambda. `reduce()` accepts an optional initial value and `sort()` accepts an optional comparator.

```crespi
var numbers = [1, 2, 3, 4]
print(numbers.map { n -> n * 2 })         // [2, 4, 6, 8]
print(numbers.filter { n -> n % 2 == 0 }) // [2, 4]
print(numbers.reduce({ a, b -> a + b }, 0)) // 10
```

---

## Practical Examples

### Input Validation

```crespi
fn read_number() {
    print("Enter a number:")
    var input = read()
    return int(input)
}

fn read_option(options) {
    var option = read()
    if options.contains(option) {
        return option
    } else {
        print("Invalid option")
        return null
    }
}
```

### List Processing

```crespi
fn sum_list(list) {
    var total = 0
    for n in list {
        total += n
    }
    return total
}

fn filter_even(list) {
    var result = []
    for n in list {
        if n % 2 == 0 {
            result.push(n)
        }
    }
    return result
}

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(sum_list(numbers))        // 55
print(filter_even(numbers))     // [2, 4, 6, 8, 10]
```

---

## See Also

- [Data Types](types.md)
- [Keywords](keywords.md)
- [Operators](operators.md)
