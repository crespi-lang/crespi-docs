# Crespi LLVM ABI

Status: Draft (LLVM backend target)

This document defines the calling convention and type mapping used by the
LLVM backend. It is the source of truth for codegen and runtime interop.

## Calling Convention

- All compiled Crespi functions (user functions, methods, closures, and the
  synthetic `main`) use C ABI and take a hidden first parameter:
  `gc_ctx: *mut GcContext`.
- Methods receive the receiver (`this`) as the first explicit parameter
  after `gc_ctx`.
- Closures are represented as an opaque runtime object and are invoked
  either directly (when the function pointer is known) or via the runtime
  helper `crespi_rt_call_closure(gc_ctx, closure, args_ptr, arg_count)`.
- `extern fn` declarations map directly to C ABI functions and do NOT
  include `gc_ctx` when all parameter/return types are primitives.
- If an `extern fn` uses non-primitive types, the compiler lowers the call
  to the native wrapper ABI:
  `extern "C" fn(*mut GcContext, *const CrespiValue, usize) -> CrespiValue`.

## Type Mapping (Crespi -> LLVM -> Rust)

Primitives:

| Crespi | LLVM | Rust | Notes |
| --- | --- | --- | --- |
| Int | i64 | i64 | default integer |
| Int32 | i32 | i32 | 32-bit signed |
| Int16 | i16 | i16 | 16-bit signed |
| Int8 | i8 | i8 | 8-bit signed |
| UInt | i64 | u64 | 64-bit unsigned |
| UInt32 | i32 | u32 | 32-bit unsigned |
| UInt16 | i16 | u16 | 16-bit unsigned |
| UInt8 | i8 | u8 | 8-bit unsigned |
| Double | f64 | f64 | default float |
| Float | f32 | f32 | 32-bit float |
| Bool | i8 | bool | 0/1 |
| Unit | i8 | () | value 0 |

Note: the LLVM backend currently lowers `Float` to f64 for internal Crespi
functions to match interpreter semantics. Extern signatures still use f32.

Heap / reference types use LLVM opaque pointers (`ptr`) in the default
address space (pointer size is target-dependent, 64-bit on supported hosts):

| Crespi | LLVM | Rust |
| --- | --- | --- |
| String | ptr | *mut String / runtime string object |
| List[T] | ptr | *mut Vec<T> (typed) or *mut ListObject |
| Dict[K,V] | ptr | *mut DictObject |
| class Foo | ptr | *mut Foo (runtime instance) |

## Boxed Values (`CrespiValue`)

When the type is unknown or erased (Union, TypeVar, dynamic paths), codegen
uses `CrespiValue`, a `#[repr(C)]` tagged struct defined in
`crates/crespi-runtime/src/value.rs`.

`CrespiValue` layout (64-bit target):

```
#[repr(C)]
struct CrespiValue {
    tag: u8,
    _padding: [u8; 7],
    payload: u64,
}
```

In LLVM IR, the Rust ABI for the struct above is represented as:

```
%CrespiValue = type [2 x i64]
```

The LLVM backend therefore uses `[2 x i64]` as the in-IR representation:

- element 0: tag stored in the low 8 bits (remaining bytes reserved/padding)
- element 1: payload bits

Tag values:
- Null = 0
- Missing = 1
- Bool = 2
- Int = 3
- Float = 4
- Object = 5
- Opaque = 6

Payload encoding:
- Bool: 0 or 1
- Int: i64 bits (two's complement)
- Float: f64 bits (`to_bits`)
- Object/Opaque: pointer value cast to `u64`

Size/alignment (64-bit targets): 16 bytes, align 8.

Use runtime helpers to box/unbox values at ABI boundaries when needed.

## Nullables and Unions

- `Nullable`, `Union`, and `TypeVar` are represented as `CrespiValue` until
  specialized in codegen.
- Pointer-typed `T?` may use null pointers only when the type is explicitly
  nullable; otherwise nulls are boxed.

## Runtime Helper ABI

- Pure numeric helpers are plain C ABI functions (no `gc_ctx`), e.g.:
  `crespi_rt_add_int(i64, i64) -> i64`.
- LLVM codegen prefers typed helpers for `Int`/`Double` when type information
  is available, and falls back to boxed helpers otherwise.
- Helpers that allocate (strings, lists, objects) take `gc_ctx` as the first
  parameter.

## Notes

- This ABI is shared by `crespic` (LLVM backend) and `crespi-runtime`.
