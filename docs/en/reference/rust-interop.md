# Rust Interoperability

> **Language:** [Español](../../es/referencia/interoperabilidad-rust.md) | English

---

Crespi provides seamless integration with Rust libraries, allowing you to leverage the entire Rust ecosystem from your Crespi programs. This is achieved through the `crespigen` tool, which automatically generates FFI bindings for any Rust crate.

## Overview

The Rust interop system works by:

1. Analyzing the public API of a Rust crate using rustdoc JSON
2. Generating wrapper functions that bridge between Crespi's value system and native Rust types
3. Producing a Crespi facade file (`.crespi`) with class and function definitions
4. Compiling everything into a static library that links with your Crespi program

## Quick Start

### 1. Create a Project Structure

```
my_project/
├── main.crespi          # Your Crespi program
├── Cargo.toml           # Rust dependencies
└── src/
    └── lib.rs           # (Optional) Your Rust library code
```

### 2. Configure Cargo.toml

For using existing crates from crates.io:

```toml
[package]
name = "my_project"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["rlib"]

[workspace]

[dependencies]
# Add any Rust crate
regex = "1.10"
```

For a local library:

```toml
[package]
name = "my_math_lib"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["rlib"]

[workspace]
```

> **Note:** The empty `[workspace]` section is required to prevent Cargo workspace inheritance issues.

### 3. Write Rust Code (Optional)

If you're creating your own library:

```rust
// src/lib.rs

/// A 2D point
#[derive(Clone)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

impl Point {
    pub fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }

    pub fn distance(&self, other: &Point) -> f64 {
        ((other.x - self.x).powi(2) + (other.y - self.y).powi(2)).sqrt()
    }
}

pub fn add(a: i64, b: i64) -> i64 {
    a + b
}

pub fn midpoint(p1: &Point, p2: &Point) -> Point {
    Point {
        x: (p1.x + p2.x) / 2.0,
        y: (p1.y + p2.y) / 2.0,
    }
}
```

### 4. Generate Bindings

```bash
crespigen my_project/
```

This generates:
- `my_project/target/crespi-gen/bindings.crespi` - Crespi facade file
- `my_project/target/crespi-gen/target/release/lib_crespi_bindings.a` - Static library

### 5. Use in Crespi

```crespi
// main.crespi

fn main() {
    // Primitive functions work directly
    var sum = add(10, 20)
    print(sum)  // 30

    // Structs become classes
    var p1 = Point(0.0, 0.0)
    var p2 = Point(3.0, 4.0)

    // Methods work naturally
    var dist = p1.distance(p2)
    print(dist)  // 5.0

    // Free functions with struct parameters
    var mid = midpoint(p1, p2)
    print(mid.x())  // 1.5
    print(mid.y())  // 2.0
}
```

## Type Mapping

### Primitive Types (Direct FFI)

Primitive types are passed directly without conversion overhead.

| Rust Type | Crespi Type | Notes |
|-----------|-------------|-------|
| `i64`, `isize` | `Int` | 64-bit signed integer |
| `i32` | `Int32` | 32-bit signed integer |
| `i16` | `Int16` | 16-bit signed integer |
| `i8` | `Int8` | 8-bit signed integer |
| `u64`, `usize` | `UInt` | 64-bit unsigned integer |
| `u32` | `UInt32` | 32-bit unsigned integer |
| `u16` | `UInt16` | 16-bit unsigned integer |
| `u8` | `UInt8` | 8-bit unsigned integer |
| `f64` | `Double` | 64-bit floating point |
| `f32` | `Float` | 32-bit floating point |
| `bool` | `Bool` | Direct mapping |
| `()` | `Unit` | Void/unit type |

### Complex Types (Wrapper Generation)

Complex types require wrapper functions for marshaling.

| Rust Type | Crespi Type | Notes |
|-----------|-------------|-------|
| `String`, `&str` | `String` | Automatic conversion |
| `Vec<T>` | `List[T]` | List with element type |
| `HashMap<K, V>` | `Dict[K, V]` | Dictionary mapping |
| `Option<T>` | `T?` | Nullable type |
| `Result<T, E>` | `T?` | Errors become null |
| Custom `struct` | `class` | Auto-generated class |
| Custom `enum` | `class` | Variant constructors |

### Smart Pointers

Smart pointers are automatically unwrapped to their inner type.

| Rust Type | Crespi Type |
|-----------|-------------|
| `Box<T>` | `T` |
| `Rc<T>` | `T` |
| `Arc<T>` | `T` |
| `Cow<T>` | `T` |

## Generated Bindings

### Struct Mapping

Rust structs become Crespi classes with:

- **Constructor**: Uses field names as parameters
- **Field getters**: Methods returning field values
- **Methods**: Instance methods from `impl` blocks

**Rust:**
```rust
pub struct Person {
    pub name: String,
    pub age: i32,
}

impl Person {
    pub fn new(name: String, age: i32) -> Self {
        Person { name, age }
    }

    pub fn greet(&self) -> String {
        format!("Hello, I'm {} and I'm {} years old", self.name, self.age)
    }
}
```

**Generated Crespi:**
```crespi
class Person {
    private var _ptr: Any

    fn init(name: String, age: Int) {
        this._ptr = __crespi_Person_new(name, age)
    }

    fn name() -> String {
        return __crespi_Person_get_name(this._ptr)
    }

    fn age() -> Int {
        return __crespi_Person_get_age(this._ptr)
    }

    fn greet() -> String {
        return __crespi_Person_greet(this._ptr)
    }
}
```

### Free Functions

Free functions are wrapped with the same name:

**Rust:**
```rust
pub fn calculate_area(width: f64, height: f64) -> f64 {
    width * height
}
```

**Generated Crespi:**
```crespi
extern fn __crespi_calculate_area(width: Double, height: Double) -> Double

fn calculate_area(width: Double, height: Double) -> Double {
    return __crespi_calculate_area(width, height)
}
```

### Enum Mapping

Rust enums become classes with static constructors for each variant:

**Rust:**
```rust
pub enum Color {
    Red,
    Green,
    Blue,
    Rgb(u8, u8, u8),
}
```

**Generated Crespi:**
```crespi
class Color {
    private var _tag: Int
    private var _data: Any

    fn Red() -> Color { ... }
    fn Green() -> Color { ... }
    fn Blue() -> Color { ... }
    fn Rgb(r: Int, g: Int, b: Int) -> Color { ... }

    fn is_red() -> Bool { return this._tag == 0 }
    fn is_green() -> Bool { return this._tag == 1 }
    fn is_blue() -> Bool { return this._tag == 2 }
    fn is_rgb() -> Bool { return this._tag == 3 }
}
```

## crespigen Command

### Usage

```bash
crespigen [OPTIONS] <PROJECT_DIR>
```

### Arguments

| Argument | Description |
|----------|-------------|
| `<PROJECT_DIR>` | Path to the Rust project (directory containing Cargo.toml) |

### Options

| Option | Description |
|--------|-------------|
| `-o, --output <DIR>` | Output directory for generated bindings (default: `<project>/target/crespi-gen`) |
| `--no-build` | Only generate bindings, don't compile |
| `-h, --help` | Print help |
| `-V, --version` | Print version |

### Output Files

After running `crespigen`, you'll find:

```
my_project/
└── target/
    └── crespi-gen/
        ├── Cargo.toml           # Wrapper crate manifest
        ├── src/
        │   └── lib.rs           # Generated Rust wrappers
        ├── bindings.crespi      # Crespi facade file
        └── target/
            └── release/
                └── lib_crespi_bindings.a  # Static library
```

## Requirements

### Rust Nightly

The `crespigen` tool requires Rust nightly for rustdoc JSON output:

```bash
# Install nightly
rustup install nightly

# Make nightly available
rustup default nightly
# OR use +nightly flag
cargo +nightly ...
```

### PATH Configuration

Ensure `cargo` is available in your PATH. Add to your shell configuration:

```bash
# ~/.zshrc or ~/.bashrc
export PATH="$HOME/.cargo/bin:$PATH"
```

## How It Works

### Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Rust Crate    │────▶│  crespigen   │────▶│  bindings.crespi│
│   (Cargo.toml)  │     │              │     │  lib_crespi_*.a │
└─────────────────┘     └──────────────┘     └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
               ┌────▼────┐       ┌──────▼──────┐
               │ rustdoc │       │ Embedded    │
               │  JSON   │       │ crespi-ffi  │
               │         │       │ crespi-runtime
               └─────────┘       └─────────────┘
```

### Process Flow

1. **Rustdoc JSON Generation**: `crespigen` runs `cargo +nightly doc` with JSON output to extract the public API
2. **API Parsing**: The rustdoc JSON is parsed to discover functions, structs, enums, and methods
3. **Type Mapping**: Rust types are mapped to Crespi types
4. **Wrapper Generation**: Rust wrapper functions are generated that:
   - Accept `CrespiValue` arguments
   - Marshal values to native Rust types
   - Call the original functions
   - Convert results back to `CrespiValue`
5. **Facade Generation**: A `.crespi` file is generated with:
   - `extern fn` declarations for the FFI functions
   - Class definitions for structs
   - Wrapper functions for ergonomic API
6. **Compilation**: The wrapper crate is compiled to a static library

### Opaque Pointers

Custom structs are handled as opaque pointers:

- Struct instances are boxed and stored as raw pointers in `CrespiValue`
- Methods receive the pointer, dereference it, and call the method
- Return values that are structs are boxed and returned as opaque pointers

This approach:
- Avoids copying large structs
- Preserves Rust ownership semantics
- Allows calling methods on instances

## Limitations

### Current Limitations

#### Fully Supported
- Primitive numeric types (signed/unsigned ints, `f32`/`f64`, `bool`) in functions and struct fields
- Structs with primitive fields only
- Methods with `&self` receiver
- Methods taking `&StructType` references as parameters
- Methods returning `Self` or other struct types
- Free functions with primitive parameters
- Free functions with `&StructType` parameters

#### Not Yet Supported (Planned)

| Feature | Issue | Workaround |
|---------|-------|------------|
| **Static factory methods** | Methods without `&self` (e.g., `Point::origin()`) are incorrectly generated as instance methods | Use constructors with default values: `Point(0.0, 0.0)` instead of `Point::origin()` |
| **Struct fields containing other structs** | Fields like `center: Point` in a `Circle` struct fail to marshal | Use primitive fields: `cx: f64, cy: f64` instead of `center: Point` |
| **Methods taking owned struct parameters** | `fn move_to(self, center: Point)` expects owned value, not reference | Use references: `fn move_to(&self, center: &Point)` |
| **Enums** | Rust enums are not yet generated | Use structs with tag fields as workaround |
| **Generics** | Generic functions and structs have limited support | Use concrete types in public APIs |
| **Traits** | Trait objects (`dyn Trait`) are treated as opaque `Any` | Avoid trait objects in FFI boundaries |
| **Lifetimes** | References with explicit lifetimes may not work correctly | Use owned types or `&T` without explicit lifetimes |
| **Async** | Async functions are not yet supported | Use synchronous APIs |
| **Callbacks** | Passing Crespi functions to Rust is not supported | Design APIs without callbacks |
| **String/Vec returns** | Complex return types need marshaling | Currently limited - use primitives when possible |

### Design Recommendations

1. **Use concrete types** in public APIs when possible
2. **Prefer `&self`** methods over consuming `self` methods
3. **Return `Result` or `Option`** for fallible operations
4. **Derive `Clone`** for structs that need to be copied
5. **Keep public APIs simple** - internal complexity is fine

## Examples

### Using a crates.io Library

```toml
# Cargo.toml
[package]
name = "regex_example"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["rlib"]

[workspace]

[dependencies]
regex = "1.10"
```

```crespi
// main.crespi
fn main() {
    var pattern = Regex("[0-9]+")

    if pattern.is_match("abc123") {
        print("Found digits!")
    }

    var matches = pattern.find_all("a1b2c3")
    for m in matches {
        print(m)  // "1", "2", "3"
    }
}
```

### Local Math Library

```rust
// src/lib.rs
pub fn factorial(n: i64) -> i64 {
    if n <= 1 { 1 } else { n * factorial(n - 1) }
}

pub fn fibonacci(n: i64) -> i64 {
    if n <= 1 { n } else { fibonacci(n - 1) + fibonacci(n - 2) }
}

pub struct Complex {
    pub real: f64,
    pub imag: f64,
}

impl Complex {
    pub fn new(real: f64, imag: f64) -> Self {
        Complex { real, imag }
    }

    pub fn magnitude(&self) -> f64 {
        (self.real * self.real + self.imag * self.imag).sqrt()
    }

    pub fn add(&self, other: &Complex) -> Complex {
        Complex {
            real: self.real + other.real,
            imag: self.imag + other.imag,
        }
    }
}
```

```crespi
// main.crespi
fn main() {
    // Using free functions
    print(factorial(10))    // 3628800
    print(fibonacci(10))    // 55

    // Using Complex class
    var c1 = Complex(3.0, 4.0)
    var c2 = Complex(1.0, 2.0)

    print(c1.magnitude())   // 5.0

    var sum = c1.add(c2)
    print(sum.real())       // 4.0
    print(sum.imag())       // 6.0
}
```

## Troubleshooting

### "Nightly Rust Required"

```
Error: cargo +nightly failed
```

**Solution:** Install and configure Rust nightly:
```bash
rustup install nightly
rustup default nightly
```

### "Package believes it's in a workspace"

```
Error: current package believes it's in a workspace when it's not
```

**Solution:** Add an empty `[workspace]` section to your Cargo.toml:
```toml
[workspace]
```

### "Type X does not implement FromCrespi"

This occurs when the generator tries to use a type that can't be automatically marshaled.

**Solution:** Ensure your structs use supported field types, or file an issue for the unsupported type.

### Missing Functions in Generated Bindings

Only `pub` functions and items are included in the generated bindings.

**Solution:** Mark items as `pub` that you want to expose to Crespi.

## See Also

- [Types Reference](types.md) - Crespi type system
- [Functions Reference](functions.md) - Built-in functions
- [Keywords Reference](keywords.md) - Language keywords including `extern`
