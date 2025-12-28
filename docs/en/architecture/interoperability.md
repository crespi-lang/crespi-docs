# Interoperability Layer (FFI)

The Crespi Foreign Function Interface (FFI) layer enables seamless communication between Crespi code and native host code. The architecture is designed with multi-language interoperability in mind, allowing for future expansion beyond the current Rust implementation.

## Architecture

The FFI system is built on top of the `crespi-runtime` tagged value representation (`CrespiValue`) and the C Application Binary Interface (ABI).

### Key Components

1.  **crespi-ffi**: The core crate providing traits and utilities for marshaling data.
2.  **NativeFn**: The C-compatible function signature for native functions:
    ```rust
    extern "C" fn(&mut GcContext, *const CrespiValue, usize) -> CrespiValue
    ```
3.  **Marshaling Traits**:
    *   `FromCrespi`: Converts a `CrespiValue` to a Rust type.
    *   `ToCrespi`: Converts a Rust type to a `CrespiValue` (may allocate on the heap).

## Current Implementation: Rust FFI

The current FFI implementation provides seamless integration with Rust libraries. This serves as the foundation for future multi-language support.

### Usage

To expose a Rust function to Crespi:

#### 1. Define the Native Function

Wrap your logic in an `extern "C"` function that handles argument marshaling.

```rust
use crespi_ffi::{GcContext, CrespiValue, FromCrespi, ToCrespi};

extern "C" fn my_add(gc: &mut GcContext, args: *const CrespiValue, count: usize) -> CrespiValue {
    // 1. Convert raw pointer to slice
    let args = unsafe { std::slice::from_raw_parts(args, count) };

    // 2. Validate argument count
    if args.len() != 2 {
        return CrespiValue::NULL; // Or handle error
    }

    // 3. Marshal arguments
    let a = i32::from_crespi(&args[0]).unwrap_or(0);
    let b = i32::from_crespi(&args[1]).unwrap_or(0);

    // 4. Perform logic and return
    (a + b).to_crespi(gc)
}
```

#### 2. Register the Function

Register the function in the runtime's `GcContext` to make it available to Crespi code.

```rust
let native_fn = gc.alloc_nativa("add".to_string(), my_add, 2);
gc.set_global("add".to_string(), native_fn);
```

#### 3. Call from Crespi

```crespi
print(add(10, 20)); // Output: 30
```

## Standard Library (Built-ins)

The standard library functions (like `print`, `math` functions, string operations) are implemented using this FFI layer in the `crespi-builtins` crate. This ensures that the core runtime remains minimal and focused on memory management and execution, while the standard library can grow independently.

## Extern Functions (Direct FFI)

For compiled Crespi code, you can call external Rust/C functions directly using `extern fn` declarations. This provides zero-overhead FFI without the marshaling layer.

### Declaration Syntax

```crespi
extern fn my_compute(x: Int, y: Int) -> Int
extern fn my_sin(angle: Float) -> Float
```

### Implementation in Rust

```rust
#[no_mangle]
pub extern "C" fn my_compute(x: i64, y: i64) -> i64 {
    x * y + 42
}
```

### Compilation

```bash
# Build the Rust library as a static library
rustc --crate-type=staticlib -o libmylib.a lib.rs

# Compile Crespi code with the library
crespic main.crespi -L libmylib.a -o main
```

### Type Mapping

| Crespi | LLVM IR | Rust FFI |
|--------|---------|----------|
| `Int` | `i64` | `i64` |
| `Double` | `double` | `f64` |
| `Float` | `float` | `f32` |
| `Bool` | `i8` | `bool` |
| `Unit` | `i8` | `()` |

For non-primitive types (`String`, `List`, `Dict`, classes), the compiler targets
the wrapper ABI used by `crespi-cargo`:

```rust
extern "C" fn(*mut GcContext, *const CrespiValue, usize) -> CrespiValue
```

The marshaling layer understands typed list objects for `List[Int]`,
`List[Float]`/`List[Double]`, and `List[Bool]`, converting them to
`Vec<i64>`, `Vec<f32>`/`Vec<f64>`, and `Vec<bool>` (and back) when crossing
the FFI boundary.

### Implementation Details

Extern functions are:
- Declared as LLVM externs with `Linkage::External`
- Called directly without CrespiValue boxing/unboxing
- Linked at compile time via the system linker

## Multi-Language Interoperability Vision

The FFI architecture is designed to be extensible. While Rust is the current primary supported language, the C ABI foundation enables future support for additional languages. The marshaling layer abstracts language-specific details, allowing the same patterns to be applied to other native code sources.

## Future Work

*   **Plugin System**: Support loading dynamic libraries (`.so`/`.dll`) at runtime.
*   **Procedural Macros**: Automate the boilerplate for `extern "C"` wrappers.
*   **Safe Handles**: Improved safety wrappers for heap objects passed to Rust.
*   **String/Object FFI**: Support passing heap-allocated types (strings, lists) across the FFI boundary.
*   **Additional Language Support**: Expand the FFI layer to support additional native languages through the C ABI.
