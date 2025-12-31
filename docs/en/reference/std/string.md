# std.string

> **Language:** [Espanol](../../../es/referencia/std/string.md) | English

---

String manipulation methods. All string methods are called on a string receiver using dot notation.

## Importing

```crespi
import std.string { split, trim, uppercase }
```

Or use directly without import (globally available).

---

## Quick Reference

| Method | Spanish Alias | Parameters | Returns | Description |
|--------|---------------|------------|---------|-------------|
| `s.split(delim)` | `dividir` | `delim: String` | `[String]` | Split by delimiter |
| `s.trim()` | `recortar` | - | `String` | Remove whitespace |
| `s.uppercase()` | `mayusculas` | - | `String` | Convert to uppercase |
| `s.lowercase()` | `minusculas` | - | `String` | Convert to lowercase |
| `s.substring(start, end?)` | `subcadena` | `start, end?: Int` | `String` | Extract substring |
| `s.replace(old, new)` | `reemplazar` | `old, new: String` | `String` | Replace all |
| `s.starts_with(prefix)` | `empieza_con` | `prefix: String` | `Bool` | Check prefix |
| `s.ends_with(suffix)` | `termina_con` | `suffix: String` | `Bool` | Check suffix |
| `s.index_of(substr)` | `indice_de` | `substr: String` | `Int` | Find position |
| `list.join(sep)` | `unir` | `sep: String` | `String` | Join list elements |

---

## Character Indexing

String indices are **character-based**, not byte-based. This means `substring()` and `index_of()` work correctly with Unicode characters.

```crespi
var emoji = "Hello, World!"
print(emoji.length())        // 13 (characters)
print(emoji.substring(0, 5)) // Hello
```

---

## Methods

### `s.split(delimiter)`

Splits a string into a list by a delimiter.

```crespi
var csv = "apple,banana,cherry"
var fruits = csv.split(",")
print(fruits)  // [apple, banana, cherry]

var words = "Hello World".split(" ")
print(words)  // [Hello, World]

var chars = "abc".split("")
print(chars)  // [a, b, c]
```

---

### `s.trim()`

Removes whitespace from both ends of a string.

```crespi
var text = "  Hello World  "
print(text.trim())  // "Hello World"

var tabs = "\t\n  data  \n\t"
print(tabs.trim())  // "data"
```

---

### `s.uppercase()` / `s.lowercase()`

Converts case.

```crespi
var text = "Hello World"
print(text.uppercase())  // "HELLO WORLD"
print(text.lowercase())  // "hello world"

// Useful for case-insensitive comparison
fn equals_ignore_case(a: String, b: String) -> Bool {
    return a.lowercase() == b.lowercase()
}

print(equals_ignore_case("Hello", "HELLO"))  // true
```

---

### `s.substring(start, end?)`

Extracts a substring from `start` (inclusive) to `end` (exclusive). If `end` is omitted, extracts to the end of the string.

**Indices are character-based.**

```crespi
var text = "Hello, World!"

print(text.substring(0, 5))   // "Hello"
print(text.substring(7))      // "World!"
print(text.substring(7, 12))  // "World"

// Negative indices are not supported
// Use length() to calculate from end
var last3 = text.substring(text.length() - 3)
print(last3)  // "ld!"
```

---

### `s.replace(old, new)`

Replaces all occurrences of `old` with `new`.

```crespi
var text = "Hello, World!"
print(text.replace("World", "Crespi"))  // "Hello, Crespi!"

var spaces = "a b c d"
print(spaces.replace(" ", "-"))  // "a-b-c-d"

// Remove characters
var clean = "a-b-c".replace("-", "")
print(clean)  // "abc"
```

---

### `s.starts_with(prefix)` / `s.ends_with(suffix)`

Checks if a string starts/ends with a given substring.

```crespi
var filename = "document.pdf"

print(filename.starts_with("doc"))   // true
print(filename.starts_with("img"))   // false
print(filename.ends_with(".pdf"))    // true
print(filename.ends_with(".txt"))    // false

// File type detection
fn is_image(filename: String) -> Bool {
    return filename.ends_with(".png") or
           filename.ends_with(".jpg") or
           filename.ends_with(".gif")
}

print(is_image("photo.jpg"))  // true
```

---

### `s.index_of(substring)`

Finds the first occurrence of a substring. Returns the character index, or -1 if not found.

```crespi
var text = "Hello, World!"

print(text.index_of("World"))  // 7
print(text.index_of("o"))      // 4 (first 'o')
print(text.index_of("xyz"))    // -1 (not found)

// Check if contains
if text.index_of("World") != -1 {
    print("Found it!")
}

// Alternative: use contains()
if text.contains("World") {
    print("Found it!")
}
```

---

### `list.join(separator)`

Joins list elements into a string with a separator. Called on a list, not a string.

```crespi
var words = ["Hello", "World"]
print(words.join(" "))   // "Hello World"
print(words.join(", "))  // "Hello, World"
print(words.join(""))    // "HelloWorld"

var numbers = [1, 2, 3]
print(numbers.map { n -> str(n) }.join("-"))  // "1-2-3"
```

---

## Practical Examples

### Parse CSV Line

```crespi
fn parse_csv(line: String) -> [String] {
    return line.split(",").map { s -> s.trim() }
}

var data = "  apple , banana ,  cherry  "
var items = parse_csv(data)
print(items)  // [apple, banana, cherry]
```

### Title Case

```crespi
fn title_case(text: String) -> String {
    var words = text.split(" ")
    var titled = words.map(fn(word) {
        if word.length() == 0 {
            return word
        }
        var first = word.substring(0, 1).uppercase()
        var rest = word.substring(1).lowercase()
        return first + rest
    })
    return titled.join(" ")
}

print(title_case("hello world"))  // "Hello World"
```

### Slug Generator

```crespi
fn slugify(text: String) -> String {
    return text
        .lowercase()
        .replace(" ", "-")
        .replace("'", "")
}

print(slugify("Hello World"))     // "hello-world"
print(slugify("It's a Test"))     // "its-a-test"
```

### Extract Domain from Email

```crespi
fn get_email_domain(email: String) -> String {
    var at_pos = email.index_of("@")
    if at_pos == -1 {
        return ""
    }
    return email.substring(at_pos + 1)
}

print(get_email_domain("user@example.com"))  // "example.com"
```

### Word Count

```crespi
fn word_count(text: String) -> Int {
    var words = text.trim().split(" ")
    return words.filter { w -> w.length() > 0 }.length()
}

print(word_count("Hello  World"))  // 2
```

---

## See Also

- [std.collections](collections.md) - Collection methods including `join`
- [Data Types](../types.md) - String type details
- [Standard Library](index.md) - All modules
