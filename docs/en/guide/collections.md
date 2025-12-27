# Lists and Dictionaries

> **Language:** [Español](../../es/guia/colecciones.md) | English

---

Crespi provides three collection types: lists (arrays), tuples, and dictionaries (maps).

## Lists

Lists are ordered collections that can contain elements of any type.

### Creating Lists

```crespi
// Empty list
var empty = []

// List with elements
var numbers = [1, 2, 3, 4, 5]
var names = ["Ana", "Luis", "Maria"]

// Mixed list
var mixed = [1, "two", true, null, [1, 2]]
```

### Accessing Elements

Indices start at 0:

```crespi
var fruits = ["apple", "orange", "pear", "grape"]

print(fruits[0])   // apple (first)
print(fruits[1])   // orange
print(fruits[3])   // grape (last)
```

### Negative Indices

Use negative indices to access from the end:

```crespi
var fruits = ["apple", "orange", "pear", "grape"]

print(fruits[-1])  // grape (last)
print(fruits[-2])  // pear (second to last)
print(fruits[-4])  // apple (first)
```

### Modifying Elements

```crespi
var numbers = [10, 20, 30]

numbers[0] = 100
numbers[2] = 300

print(numbers)  // [100, 20, 300]
```

### Length

```crespi
var list = [1, 2, 3, 4, 5]
print(list.length())  // 5

var empty = []
print(empty.length())  // 0
```

---

## Tuples

Tuples are fixed-size ordered collections. They use parentheses and commas; a single-element tuple
requires a trailing comma.

```crespi
var point = (3, 4)
var single = (1,)

print(point[0])       // 3
print(point[-1])      // 4
print(point.length())  // 2
```

Tuples are immutable, so element assignment is not allowed.

---

## List Operations

List mutation requires a `var` binding. Lists stored in `let` are immutable.

### Adding Elements

`list.push(value)` appends to the end:

```crespi
var numbers = [1, 2, 3]

numbers.push(4)
numbers.push(5)

print(numbers)  // [1, 2, 3, 4, 5]
```

### Removing Elements

`list.pop()` removes and returns the last element:

```crespi
var numbers = [1, 2, 3, 4, 5]

var last = numbers.pop()
print(last)     // 5
print(numbers)  // [1, 2, 3, 4]
```

### Checking Content

`list.contains(value)` checks if an element exists:

```crespi
var fruits = ["apple", "orange", "pear"]

print(fruits.contains("orange"))  // true
print(fruits.contains("grape"))   // false
```

---

## Iterating Over Lists

### For-Each Loop

```crespi
var colors = ["red", "green", "blue"]

for color in colors {
    print("Color: " + color)
}
// Color: red
// Color: green
// Color: blue
```

### With Index

```crespi
var elements = ["a", "b", "c"]
var i = 0

for elem in elements {
    print(str(i) + ": " + elem)
    i += 1
}
// 0: a
// 1: b
// 2: c
```

---

## Dictionaries

Dictionaries store key-value pairs. Keys are always text.

### Creating Dictionaries

```crespi
// Empty dictionary
var empty = {}

// Dictionary with data
var person = {
    "name": "Ana",
    "age": 25,
    "city": "Madrid"
}

// Values of any type
var config = {
    "debug": true,
    "max_items": 100,
    "users": ["admin", "user"]
}
```

### Accessing Values

```crespi
var person = {
    "name": "Ana",
    "age": 25
}

print(person["name"])  // Ana
print(person["age"])   // 25
```

### Modifying Values

Dictionary mutation requires a `var` binding. Dictionaries stored in `let` are immutable.

```crespi
var person = {
    "name": "Ana",
    "age": 25
}

// Modify existing
person["age"] = 26

// Add new
person["city"] = "Barcelona"

print(person)
// {name: Ana, age: 26, city: Barcelona}
```

---

## Dictionary Operations

### Getting Keys

```crespi
var person = {
    "name": "Ana",
    "age": 25,
    "city": "Madrid"
}

var k = person.keys()
print(k)  // [name, age, city]
```

### Getting Values

```crespi
var grades = {
    "math": 90,
    "physics": 85,
    "chemistry": 78
}

var v = grades.values()
print(v)  // [90, 85, 78]
```

### Checking Keys

`dict.contains(key)` checks if a key exists:

```crespi
var config = {
    "debug": true,
    "timeout": 5000
}

print(config.contains("debug"))    // true
print(config.contains("verbose"))  // false
```

---

## Iterating Over Dictionaries

### By Keys

```crespi
var person = {
    "name": "Ana",
    "age": 25,
    "city": "Madrid"
}

for key in person.keys() {
    print(key + ": " + str(person[key]))
}
// name: Ana
// age: 25
// city: Madrid
```

### By Values

```crespi
var prices = {
    "apple": 1.50,
    "orange": 2.00,
    "pear": 1.75
}

var total = 0
for price in prices.values() {
    total += price
}
print("Total: " + str(total))  // Total: 5.25
```

---

## Nested Lists

```crespi
// 3x3 matrix
var matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

// Access
print(matrix[0][0])  // 1
print(matrix[1][1])  // 5
print(matrix[2][2])  // 9

// Iterate
for row in matrix {
    for cell in row {
        print(cell)
    }
}
```

---

## Nested Dictionaries

```crespi
var company = {
    "name": "TechCorp",
    "employees": {
        "manager": {
            "name": "Ana",
            "salary": 50000
        },
        "developer": {
            "name": "Luis",
            "salary": 35000
        }
    }
}

// Nested access
print(company["employees"]["manager"]["name"])  // Ana
```

---

## Common Patterns

### Find in List

```crespi
fn [T] find_index(list: List[T], target: T) -> Int {
    var i = 0

    for item in list {
        if item == target {
            return i
        }
        i += 1
    }

    return -1  // Not found
}

var fruits = ["apple", "orange", "pear"]
print(find_index(fruits, "orange"))  // 1
print(find_index(fruits, "grape"))   // -1
```

### Count Frequencies

```crespi
fn [T] count_frequencies(list: List[T]) -> Dict[String, Int] {
    var frequencies = {}

    for item in list {
        var key = str(item)
        if frequencies.contains(key) {
            frequencies[key] += 1
        } else {
            frequencies[key] = 1
        }
    }

    return frequencies
}

var votes = ["A", "B", "A", "C", "B", "A"]
print(count_frequencies(votes))
// {A: 3, B: 2, C: 1}
```

### Stack

```crespi
var stack = []

// Push
stack.push("first")
stack.push("second")
stack.push("third")

// Pop
print(stack.pop())  // third
print(stack.pop())  // second
print(stack.pop())  // first
```

---

## See Also

- [Data Types](../reference/types.md)
- [Built-in Functions](../reference/functions.md)
- [Control Flow](control-flow.md)
