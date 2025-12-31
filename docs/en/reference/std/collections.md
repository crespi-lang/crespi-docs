# std.collections

> **Language:** [Espanol](../../../es/referencia/std/collections.md) | English

---

Collection manipulation methods for lists, dictionaries, and tuples. All methods are called on a collection receiver using dot notation.

## Importing

```crespi
import std.collections { length, map, filter, reduce }
```

Or use directly without import (globally available).

---

## List Creation

### `range(end)` / `range(start, end)` / `range(start, end, step)`

Creates a list of integers.

**Forms:**
- `range(end)` - 0 to end-1
- `range(start, end)` - start to end-1
- `range(start, end, step)` - with custom step

```crespi
print(range(5))           // [0, 1, 2, 3, 4]
print(range(2, 7))        // [2, 3, 4, 5, 6]
print(range(0, 10, 2))    // [0, 2, 4, 6, 8]
print(range(10, 0, -2))   // [10, 8, 6, 4, 2]

// Common patterns
for i in range(5) {
    print(i)  // 0, 1, 2, 3, 4
}

var squares = range(1, 6).map { n -> n * n }
print(squares)  // [1, 4, 9, 16, 25]
```

---

## Quick Reference

### List Creation

| Function | Spanish Alias | Parameters | Returns | Description |
|----------|---------------|------------|---------|-------------|
| `range(end)` | `rango` | `end: Int` | `[Int]` | List 0 to end-1 |
| `range(start, end)` | `rango` | `start, end: Int` | `[Int]` | List start to end-1 |
| `range(start, end, step)` | `rango` | `start, end, step: Int` | `[Int]` | List with step |

### Basic Operations

| Method | Spanish Alias | Receiver | Parameters | Returns | Description |
|--------|---------------|----------|------------|---------|-------------|
| `c.length()` | `longitud` | any | - | `Int` | Get length |
| `list.push(v)` | `agregar` | list | `v: Any` | `Unit` | Append to list |
| `list.pop()` | `quitar` | list | - | `Any` | Remove last |
| `dict.keys()` | `claves` | dict | - | `[String]` | Get keys |
| `dict.values()` | `valores` | dict | - | `[Any]` | Get values |
| `c.contains(v)` | `contiene` | any | `v: Any` | `Bool` | Check membership |

### Functional Operations

| Method | Spanish Alias | Receiver | Parameters | Returns | Description |
|--------|---------------|----------|------------|---------|-------------|
| `list.map(fn)` | `mapear` | list | `fn: (T) -> U` | `[U]` | Transform each |
| `list.filter(fn)` | `filtrar` | list | `fn: (T) -> Bool` | `[T]` | Keep matching |
| `list.reduce(fn, init?)` | `reducir` | list | `fn: (A, T) -> A` | `A` | Aggregate |
| `list.sort(cmp?)` | `ordenar` | list | `cmp?: (T, T) -> Int` | `[T]` | Sort |
| `list.reverse()` | `invertir` | list | - | `[T]` | Reverse order |
| `list.slice(start, end?)` | `cortar` | list | `start, end?: Int` | `[T]` | Extract range |
| `list.find(fn)` | `encontrar` | list | `fn: (T) -> Bool` | `T?` | First match |
| `list.every(fn)` | `cada` | list | `fn: (T) -> Bool` | `Bool` | All match |
| `list.some(fn)` | `alguno` | list | `fn: (T) -> Bool` | `Bool` | Any match |
| `list.flatten()` | `aplanar` | list | - | `[T]` | Flatten one level |

---

## Basic Operations

### `c.length()`

Gets the number of elements in a collection. `len()` is an alias.

**Works on:** list, dict, tuple, string

```crespi
print([1, 2, 3].length())     // 3
print(["a": 1, "b": 2].length())  // 2
print((1, 2, 3).length())     // 3
print("Hello".length())       // 5
print([].len())               // 0
```

---

### `list.push(value)`

Appends an element to the end of a list. **Modifies the original list.**

```crespi
var numbers = [1, 2, 3]
numbers.push(4)
numbers.push(5)
print(numbers)  // [1, 2, 3, 4, 5]

// Build a list dynamically
var result = []
for i in 1..5 {
    result.push(i * i)
}
print(result)  // [1, 4, 9, 16]
```

---

### `list.pop()`

Removes and returns the last element. **Modifies the original list.**

**Errors:** Throws if the list is empty.

```crespi
var stack = [1, 2, 3]
var last = stack.pop()
print(last)   // 3
print(stack)  // [1, 2]

// Stack operations
var ops = ["a", "b", "c"]
while ops.length() > 0 {
    print(ops.pop())
}
// Prints: c, b, a
```

---

### `dict.keys()` / `dict.values()`

Gets all keys or values from a dictionary as a list.

```crespi
var person = ["name": "Ana", "age": 25, "city": "Madrid"]

print(person.keys())    // [name, age, city]
print(person.values())  // [Ana, 25, Madrid]

// Iterate over entries
for key in person.keys() {
    print("$key: ${person[key]}")
}
```

---

### `c.contains(value)`

Checks if a collection contains a value.

- **Lists:** Checks if value is in the list
- **Dicts:** Checks if value is a **key** (not a value)
- **Strings:** Checks if substring exists

```crespi
var nums = [1, 2, 3, 4, 5]
print(nums.contains(3))    // true
print(nums.contains(10))   // false

var dict = ["a": 1, "b": 2]
print(dict.contains("a"))  // true (checks keys)
print(dict.contains("c"))  // false

var text = "Hello World"
print(text.contains("World"))  // true
```

---

## Functional Operations

### `list.map(fn)`

Applies a function to each element, returning a new list.

```crespi
var nums = [1, 2, 3, 4]

// Double each number
print(nums.map { n -> n * 2 })  // [2, 4, 6, 8]

// Convert to strings
print(nums.map { n -> str(n) })  // ["1", "2", "3", "4"]

// With named function
fn square(n: Int) -> Int { return n * n }
print(nums.map(square))  // [1, 4, 9, 16]
```

---

### `list.filter(fn)`

Keeps only elements where the predicate returns true.

```crespi
var nums = [1, 2, 3, 4, 5, 6]

// Keep even numbers
print(nums.filter { n -> n % 2 == 0 })  // [2, 4, 6]

// Keep numbers greater than 3
print(nums.filter { n -> n > 3 })  // [4, 5, 6]

// Remove empty strings
var words = ["hello", "", "world", ""]
print(words.filter { w -> w.length() > 0 })  // [hello, world]
```

---

### `list.reduce(fn, initial?)`

Reduces a list to a single value by applying a function cumulatively.

**Parameters:**
- `fn: (accumulator, current) -> accumulator` - Reducer function
- `initial?` - Optional initial value (uses first element if omitted)

```crespi
var nums = [1, 2, 3, 4, 5]

// Sum
print(nums.reduce({ a, b -> a + b }, 0))  // 15

// Product
print(nums.reduce({ a, b -> a * b }, 1))  // 120

// Max (without initial)
print(nums.reduce { a, b -> if a > b { a } else { b } })  // 5

// Build string
var words = ["Hello", "World"]
print(words.reduce { a, b -> a + " " + b })  // "Hello World"
```

---

### `list.sort(comparator?)`

Sorts a list. Optionally provide a comparator function.

**Comparator:** `(a, b) -> Int`
- Return negative if `a < b`
- Return zero if `a == b`
- Return positive if `a > b`

```crespi
var nums = [3, 1, 4, 1, 5]
print(nums.sort())  // [1, 1, 3, 4, 5]

// Descending order
print(nums.sort { a, b -> b - a })  // [5, 4, 3, 1, 1]

// Sort strings
var words = ["banana", "apple", "cherry"]
print(words.sort())  // [apple, banana, cherry]

// Sort by length
print(words.sort { a, b -> a.length() - b.length() })
// [apple, banana, cherry]
```

---

### `list.reverse()`

Returns a new list with elements in reverse order.

```crespi
var nums = [1, 2, 3, 4, 5]
print(nums.reverse())  // [5, 4, 3, 2, 1]

var words = ["a", "b", "c"]
print(words.reverse())  // [c, b, a]
```

---

### `list.slice(start, end?)`

Extracts a portion of the list from `start` (inclusive) to `end` (exclusive).

```crespi
var nums = [0, 1, 2, 3, 4, 5]

print(nums.slice(2, 5))  // [2, 3, 4]
print(nums.slice(3))     // [3, 4, 5]
print(nums.slice(0, 2))  // [0, 1]

// Last n elements
var last2 = nums.slice(nums.length() - 2)
print(last2)  // [4, 5]
```

---

### `list.find(fn)`

Returns the first element matching the predicate, or `null` if none.

```crespi
var nums = [1, 2, 3, 4, 5]

print(nums.find { n -> n > 3 })   // 4
print(nums.find { n -> n > 10 })  // null

// Find in objects
var users = [
    ["name": "Ana", "age": 25],
    ["name": "Bob", "age": 30]
]
var found = users.find { u -> u["name"] == "Bob" }
print(found)  // {name: Bob, age: 30}
```

---

### `list.every(fn)` / `list.some(fn)`

Checks if all/any elements satisfy a predicate.

```crespi
var nums = [2, 4, 6, 8]

// All even?
print(nums.every { n -> n % 2 == 0 })  // true

// Any greater than 5?
print(nums.some { n -> n > 5 })  // true

// Validation example
var ages = [18, 25, 30, 16]
print(ages.every { a -> a >= 18 })  // false (16 is under 18)
print(ages.some { a -> a < 18 })    // true
```

---

### `list.flatten()`

Flattens nested lists one level deep.

```crespi
var nested = [[1, 2], [3, 4], [5]]
print(nested.flatten())  // [1, 2, 3, 4, 5]

var deep = [[[1, 2]], [[3, 4]]]
print(deep.flatten())  // [[1, 2], [3, 4]] (one level only)

// Flatten + map (flat_map pattern)
var words = ["hello", "world"]
var chars = words.map { w -> w.split("") }.flatten()
print(chars)  // [h, e, l, l, o, w, o, r, l, d]
```

---

## Chaining Methods

Methods can be chained for powerful data transformations:

```crespi
var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Get sum of squares of even numbers
var result = data
    .filter { n -> n % 2 == 0 }           // [2, 4, 6, 8, 10]
    .map { n -> n * n }                    // [4, 16, 36, 64, 100]
    .reduce({ a, b -> a + b }, 0)          // 220

print(result)  // 220
```

---

## Practical Examples

### Group By

```crespi
fn group_by(list, key_fn) {
    var groups = []
    for item in list {
        var key = key_fn(item)
        if not groups.contains(key) {
            groups[key] = []
        }
        groups[key].push(item)
    }
    return groups
}

var people = [
    ["name": "Ana", "city": "Madrid"],
    ["name": "Bob", "city": "Paris"],
    ["name": "Cara", "city": "Madrid"]
]

var by_city = group_by(people) { p -> p["city"] }
print(by_city["Madrid"])  // [Ana, Cara]
```

### Unique Values

```crespi
fn unique(list) {
    var seen = []
    var result = []
    for item in list {
        if not seen.contains(item) {
            seen.push(item)
            result.push(item)
        }
    }
    return result
}

print(unique([1, 2, 2, 3, 3, 3]))  // [1, 2, 3]
```

### Partition

```crespi
fn partition(list, predicate) {
    var pass = list.filter(predicate)
    var fail = list.filter { x -> not predicate(x) }
    return (pass, fail)
}

var nums = [1, 2, 3, 4, 5, 6]
var (evens, odds) = partition(nums) { n -> n % 2 == 0 }
print(evens)  // [2, 4, 6]
print(odds)   // [1, 3, 5]
```

---

## See Also

- [std.string](string.md) - String methods including `join`
- [Data Types](../types.md) - List, Dict, Tuple types
- [Standard Library](index.md) - All modules
