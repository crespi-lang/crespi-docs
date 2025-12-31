# FFI (Foreign Function Interface)

> **Language:** [Espanol](../../es/referencia/ffi.md) | English

---

Crespi provides a Foreign Function Interface (FFI) for seamless integration with native libraries. Currently, Rust is the primary supported language, with the architecture designed to support additional languages in the future.

The Rust FFI integration allows you to leverage the entire Rust ecosystem from your Crespi programs. This is achieved through the `crespi-bindgen` tool, which automatically generates FFI bindings for any Rust crate.

## Overview

The FFI system works by:

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
crespi-bindgen my_project/
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

If a Rust type cannot be mapped, crespi-cargo falls back to `Any` so the item remains available.

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
- **Tuple structs**: Positional fields are exposed as `field0`, `field1`, ...

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

Rust enums become classes with static constructors for each variant. Tuple variants use positional
parameters like `field0`, `field1`, and so on.

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

## crespi-bindgen Command

### Usage

```bash
crespi-bindgen [OPTIONS] <PROJECT_DIR>
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

After running `crespi-bindgen`, you'll find:

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

The `crespi-bindgen` tool requires Rust nightly for rustdoc JSON output:

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
│   Rust Crate    │────>│crespi-bindgen│────>│  bindings.crespi│
│   (Cargo.toml)  │     │              │     │  lib_crespi_*.a │
└─────────────────┘     └──────────────┘     └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
               ┌────v────┐       ┌──────v──────┐
               │ rustdoc │       │ Embedded    │
               │  JSON   │       │ crespi-ffi  │
               │         │       │ crespi-runtime
               └─────────┘       └─────────────┘
```

### Process Flow

1. **Rustdoc JSON Generation**: `crespi-bindgen` runs `cargo +nightly doc` with JSON output to extract the public API
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
| **Enum marshalling** | Enum values are still treated as opaque pointers in FFI calls | Use wrapper functions that return primitives/structs where possible |
| **Generics** | Generic functions and structs have limited support | Use concrete types in public APIs |
| **Traits** | Trait objects (`dyn Trait`) are treated as opaque `Any` | Avoid trait objects in FFI boundaries |
| **Lifetimes** | References with explicit lifetimes may not work correctly | Use owned types or `&T` without explicit lifetimes |
| **Async** | Crespi supports `async`/`await`, but Rust `async fn` (Future) interop is not supported | Expose sync wrappers or use blocking APIs |
| **Callbacks** | Passing Crespi functions to Rust is not supported | Design APIs without callbacks |
| **String/Vec returns** | Complex return types need marshaling | Currently limited - use primitives when possible |

### Design Recommendations

1. **Use concrete types** in public APIs when possible
2. **Prefer `&self`** methods over consuming `self` methods
3. **Return `Result` or `Option`** for fallible operations
4. **Derive `Clone`** for structs that need to be copied
5. **Keep public APIs simple** - internal complexity is fine

### Tokio helper crate

`crespi-tokio` provides a small, blocking wrapper over Tokio for Crespi-friendly use. It exposes
`sleep_ms`, `join_sleep_ms`, `race_sleep_ms`, and a `Runtime` wrapper that can be used via `crespi-cargo`.

```crespi
extern fn sleep_ms(ms: Int)
extern fn join_sleep_ms(a: Int, b: Int) -> Int

sleep_ms(50)
print(join_sleep_ms(10, 30))
```

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

## C and Swift Interoperability

In addition to calling Rust from Crespi, you can also expose Crespi functions to C, C++, Objective-C, and Swift using the `crespi-c-ffi` crate.

### Generating C Headers

Generate a C header file from Crespi source code:

```rust
use crespi_c_ffi::generate_c_header;

let source = r#"
    fn add(a: Int, b: Int) -> Int {
        return a + b
    }
"#;

let header = generate_c_header(source, "my_module").unwrap();
println!("{}", header);
```

This generates a C header with function declarations like:

```c
#ifndef MY_MODULE_H
#define MY_MODULE_H

#include <stdint.h>
#include <stdbool.h>

typedef struct GcContext GcContext;
typedef struct CrespiValue CrespiValue;

extern "C" {
    int64_t add(GcContext* gc, int64_t a, int64_t b);
}

#endif // MY_MODULE_H
```

### Type Mapping

| Crespi Type | C Type |
|-------------|--------|
| `Int` | `int64_t` |
| `Int32` | `int32_t` |
| `Int16` | `int16_t` |
| `Int8` | `int8_t` |
| `UInt` | `uint64_t` |
| `UInt32` | `uint32_t` |
| `Double` | `double` |
| `Float` | `float` |
| `Bool` | `bool` |
| `String` | `CrespiValue` |
| `List<T>` | `CrespiValue` |
| `Dict<K,V>` | `CrespiValue` |

### Swift Module Maps

Generate Swift module maps for iOS/macOS integration:

```rust
use crespi_c_ffi::{generate_swift_modulemap, SwiftModuleOptions};

let opts = SwiftModuleOptions {
    module_name: "MyCrespiLib".to_string(),
    header_path: "crespi_module.h".to_string(),
    link_library: Some("crespi_module".to_string()),
    ..Default::default()
};

let modulemap = generate_swift_modulemap(&opts);
```

This generates a `module.modulemap` file:

```
module MyCrespiLib {
    header "crespi_module.h"
    link "crespi_module"
    export *
}
```

### Swift Wrapper Generation

For type-safe Swift access, generate wrapper code:

```rust
use crespi_c_ffi::generate_swift_wrapper;

let swift_code = generate_swift_wrapper("MyModule", &functions);
```

This generates Swift classes and structs:

```swift
/// Crespi garbage collection context
public class CrespiGC {
    private var context: OpaquePointer?

    public init() {
        context = crespi_rt_gc_create()
    }

    deinit {
        if let ctx = context {
            crespi_rt_gc_destroy(ctx)
        }
    }
}

/// Wrapper for CrespiValue
public struct CrespiVal {
    internal var raw: CrespiValue

    public static var null: CrespiVal {
        CrespiVal(raw: crespi_value_null())
    }

    public init(_ value: Int64) {
        raw = crespi_value_from_int(value)
    }

    // ... additional initializers and accessors
}
```

### GC Context Requirement

All exported Crespi functions require a `GcContext*` as their first parameter. This context manages memory allocation and garbage collection for Crespi values.

```c
// C usage
GcContext* gc = crespi_rt_gc_create();
int64_t result = add(gc, 10, 20);
crespi_rt_gc_destroy(gc);
```

```swift
// Swift usage
let gc = CrespiGC()
let result = add(gc: gc, a: 10, b: 20)
// gc is automatically destroyed when it goes out of scope
```

## Java and Kotlin Interoperability

Crespi supports JVM integration through JNI (Java Native Interface) using the `crespi-jvm-ffi` crate.

### Generating Java Classes

Generate Java native method declarations from Crespi source:

```rust
use crespi_jvm_ffi::generate_java_class;

let source = r#"
    fn add(a: Int, b: Int) -> Int {
        return a + b
    }
"#;

let java = generate_java_class(source, "com.example", "MathLib").unwrap();
```

This generates a Java class:

```java
package com.example;

public class MathLib {
    static {
        System.loadLibrary("mathlib");
        initGC();
    }

    private static native void initGC();
    private static native void destroyGC();

    /**
     * Calls Crespi function 'add'.
     * @param a long
     * @param b long
     * @return long
     */
    public static native long add(long a, long b);
}
```

### Type Mapping (Java)

| Crespi Type | Java Type | JNI Type |
|-------------|-----------|----------|
| `Int` | `long` | `jlong` |
| `Int32` | `int` | `jint` |
| `Int16` | `short` | `jshort` |
| `Int8` | `byte` | `jbyte` |
| `Double` | `double` | `jdouble` |
| `Float` | `float` | `jfloat` |
| `Bool` | `boolean` | `jboolean` |
| `String` | `String` | `jstring` |
| `List<T>` | `java.util.List<T>` | `jobject` |
| `Dict<K,V>` | `java.util.Map<K,V>` | `jobject` |

### Generating Kotlin Wrappers

Generate idiomatic Kotlin code that wraps the Java native methods:

```rust
use crespi_jvm_ffi::generate_kotlin_wrapper;

let kotlin = generate_kotlin_wrapper(source, "com.example", "MathLib").unwrap();
```

This generates a Kotlin object:

```kotlin
package com.example

/**
 * Crespi native library bindings for Kotlin.
 */
object MathLib {
    private val native = MathLib

    /**
     * Calls Crespi function 'add'.
     * @param a [Long]
     * @param b [Long]
     * @return [Long]
     */
    fun add(a: Long, b: Long): Long {
        return MathLib.add(a, b)
    }
}
```

### Type Mapping (Kotlin)

| Crespi Type | Kotlin Type |
|-------------|-------------|
| `Int` | `Long` |
| `Int32` | `Int` |
| `UInt` | `ULong` |
| `UInt32` | `UInt` |
| `Double` | `Double` |
| `Float` | `Float` |
| `Bool` | `Boolean` |
| `String` | `String` |
| `List<T>` | `List<T>` |
| `Dict<K,V>` | `Map<K, V>` |
| `T?` | `T?` |

### JNI Header Generation

Generate JNI C headers for implementing the native methods:

```rust
use crespi_jvm_ffi::generate_jni_header;

let header = generate_jni_header(&hir_program, &java_opts).unwrap();
```

This generates a JNI-compatible C header:

```c
#include <jni.h>

JNIEXPORT jlong JNICALL Java_com_example_MathLib_add(
    JNIEnv *env,
    jclass clazz,
    jlong a,
    jlong b
);
```

### Android Integration

For Android projects, use the generated Java classes with Gradle:

```groovy
// build.gradle
android {
    defaultConfig {
        ndk {
            abiFilters 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
        }
    }
    externalNativeBuild {
        cmake {
            path "CMakeLists.txt"
        }
    }
}
```

## Future Work

The FFI system is designed with multi-language interoperability in mind. Rust is the primary supported language for calling native code from Crespi, while C, Swift, Java, and Kotlin support enables embedding Crespi in native applications across all major platforms.

## Examples

Runnable examples demonstrating FFI interoperability with each language are available in the repository:

| Language | Location | Description |
|----------|----------|-------------|
| **Rust** | `examples/cargo_projects/rust_ffi/` | Native Rust integration via `cargo crespi` |
| **C** | `examples/ffi_examples/c_example/` | GC context pattern and function signatures |
| **Swift** | `examples/ffi_examples/swift_example/` | Swift Package Manager integration (macOS) |
| **Java** | `examples/ffi_examples/java_example/` | JNI bindings with Gradle |
| **Kotlin** | `examples/ffi_examples/kotlin_example/` | Idiomatic Kotlin wrappers + extensions |

All FFI examples share a common Crespi library (`examples/ffi_examples/shared/mathlib.crespi`) with math functions demonstrating various type mappings.

## See Also

- [Types Reference](types.md) - Crespi type system
- [Functions Reference](functions.md) - Built-in functions
- [Keywords Reference](keywords.md) - Language keywords including `extern`
