# Roadmap: REPL for Compiled Mode

> **Status:** Planned
> **Priority:** Low
> **Affects:** CLI, Compiler, Runtime

---

## Summary

Add a REPL (Read-Eval-Print Loop) that uses the native compiler backend instead of the interpreter. This would provide the interactive development experience with native performance and compiler-specific features.

---

## Current State

### Interpreter REPL (Available)

```bash
$ crespi
Crespi REPL v0.1.0
>>> var x = 42
>>> x * 2
84
>>> fn double(n) = n * 2
>>> double(x)
84
```

Works well for:
- Quick experiments
- Learning the language
- Testing small snippets

### Compiler (No REPL)

```bash
$ crespi compile src/main.crespi -o main
$ ./main
```

File-based only, no interactive mode.

---

## Motivation

### Use Cases

1. **Performance testing** - Test compiled performance interactively
2. **FFI debugging** - Interact with native code in real-time
3. **Compiler feature testing** - Verify compiler-specific optimizations
4. **Educational** - See how code compiles without full build cycle

### Comparison

| Feature | Interpreter REPL | Compiled REPL |
|---------|------------------|---------------|
| Startup time | Fast | Slower (JIT/compile) |
| Execution speed | Slow | Fast |
| FFI support | Limited | Full |
| Debugging | Good | Better (native tools) |
| Memory model | GC | Native |

---

## Implementation Approaches

### Option A: JIT Compilation

Compile each expression to native code on-the-fly.

**Pros:**
- True native performance
- Full compiler features available
- Closest to "compiled" experience

**Cons:**
- Complex implementation
- Requires JIT infrastructure (Cranelift/LLVM ORC)
- Platform-specific challenges

```
>>> var x = 42
[JIT compiles: let x: i64 = 42]
>>> x * 2
[JIT compiles: x * 2, links to x, executes]
84
```

### Option B: Incremental Compilation + Dynamic Loading

Compile to shared libraries and dynamically load.

**Pros:**
- Uses existing compiler
- Simpler than full JIT
- Cross-platform via dlopen/LoadLibrary

**Cons:**
- Overhead per expression
- State management complexity
- Temp file management

```
>>> var x = 42
[Compiles to /tmp/repl_001.so, loads it]
>>> x * 2
[Compiles to /tmp/repl_002.so with extern x, loads it]
84
```

### Option C: Hybrid Interpreter + Compile

Use interpreter for REPL, but allow compiling specific functions.

**Pros:**
- Leverages existing interpreter
- Simpler implementation
- Gradual path to full compiled REPL

**Cons:**
- Not truly "compiled REPL"
- Limited performance benefits

```
>>> var x = 42
[Interpreted]
>>> @compile fn heavy_compute(n) { ... }
[Compiles function to native]
>>> heavy_compute(1000000)
[Native execution]
```

---

## Recommended Approach: Option B (Incremental + Dynamic Loading)

Best balance of feasibility and functionality.

### Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   REPL UI   │────▶│  Compiler    │────▶│  Linker     │
│  (readline) │     │  (LLVM/etc)  │     │  (.so/.dll) │
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────┐
│                    REPL Runtime                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ State   │  │ Symbol  │  │ Module  │             │
│  │ Manager │  │ Table   │  │ Loader  │             │
│  └─────────┘  └─────────┘  └─────────┘             │
└─────────────────────────────────────────────────────┘
```

### State Management

Track REPL state across compilations:

```rust
struct ReplState {
    /// Variables defined in the session
    variables: HashMap<String, ReplVariable>,
    /// Functions defined in the session
    functions: HashMap<String, ReplFunction>,
    /// Loaded shared libraries
    loaded_modules: Vec<LoadedModule>,
    /// Counter for unique module names
    module_counter: u64,
}

struct ReplVariable {
    name: String,
    ty: Type,
    /// Pointer to value in loaded module
    ptr: *mut c_void,
}
```

### Compilation Unit Generation

For each REPL input, generate a compilation unit:

```rust
fn generate_repl_module(input: &str, state: &ReplState) -> String {
    let mut code = String::new();

    // Declare external symbols from previous inputs
    for (name, var) in &state.variables {
        code.push_str(&format!("extern var {}: {}\n", name, var.ty));
    }

    // Add the new input
    code.push_str(input);

    // Export new definitions
    code.push_str("\n// REPL exports\n");
    // ... generate export table

    code
}
```

### Module Loading

```rust
fn load_repl_module(path: &Path, state: &mut ReplState) -> Result<Value> {
    // Load shared library
    let lib = unsafe { libloading::Library::new(path)? };

    // Get the REPL entry point
    let entry: Symbol<fn() -> ReplResult> = unsafe {
        lib.get(b"__repl_entry")?
    };

    // Execute and get result
    let result = entry();

    // Update state with new symbols
    if let Some(exports) = result.exports {
        for export in exports {
            state.variables.insert(export.name, export.into());
        }
    }

    // Keep library loaded
    state.loaded_modules.push(LoadedModule { lib, path: path.to_owned() });

    Ok(result.value)
}
```

---

## Implementation Plan

### Phase 1: Basic Infrastructure

1. Create `crespi repl --compiled` CLI command
2. Implement `ReplState` structure
3. Set up temp directory for compiled modules
4. Basic readline integration

### Phase 2: Expression Evaluation

1. Parse single expressions
2. Generate wrapper module with `__repl_entry`
3. Compile to shared library
4. Load and execute
5. Display result

```
>>> 1 + 2
3
>>> "hello".length()
5
```

### Phase 3: Variable Persistence

1. Track variable declarations
2. Generate external declarations for subsequent modules
3. Share memory between modules

```
>>> var x = 42
>>> x + 8
50
>>> var y = x * 2
>>> y
84
```

### Phase 4: Function Definitions

1. Support function definitions
2. Export functions for later calls
3. Handle function redefinition

```
>>> fn square(n) = n * n
>>> square(5)
25
>>> fn square(n) = n * n * n  // Redefine
>>> square(5)
125
```

### Phase 5: Class and Complex Types

1. Support class definitions
2. Handle instance creation and method calls
3. Manage object lifetimes

```
>>> class Point(x: Int, y: Int) { fn sum() = this.x + this.y }
>>> var p = Point(3, 4)
>>> p.sum()
7
```

### Phase 6: Polish

1. History and tab completion
2. `:help`, `:quit`, `:clear` commands
3. Multi-line input support
4. Error recovery (don't crash on bad input)

---

## CLI Interface

```bash
# Start compiled REPL
$ crespi repl --compiled
Crespi Compiled REPL v0.1.0 (LLVM backend)
Type :help for assistance, :quit to exit

>>> var x = 42
>>> x * 2
84

# Special commands
>>> :help        # Show help
>>> :quit        # Exit REPL
>>> :clear       # Clear session state
>>> :type x      # Show type of x
>>> :asm x * 2   # Show generated assembly
>>> :ir x * 2    # Show LLVM IR
```

---

## Challenges

### Symbol Resolution Across Modules

Each compiled module is independent. Need to:
- Export symbols from each module
- Import symbols in subsequent modules
- Handle address relocation

### Memory Management

- Variables must persist across module boundaries
- Need stable addresses for external references
- GC integration if applicable

### Platform Differences

- macOS: `.dylib`, `dlopen`
- Linux: `.so`, `dlopen`
- Windows: `.dll`, `LoadLibrary`

Abstract behind platform layer.

### Compilation Latency

Each input requires full compile cycle:
- Parse → HIR → LLVM IR → Machine code → Link → Load

Mitigations:
- Cache compiled modules
- Use faster linker (lld)
- Consider Cranelift for faster codegen

---

## Future Enhancements

1. **Debugger integration** - Step through compiled code
2. **Profiling** - Time individual expressions
3. **Assembly view** - Show generated machine code
4. **Notebook mode** - Save/load REPL sessions
5. **Remote REPL** - Connect to running compiled process

---

## References

- [Compiler Guide](../en/guide/compiler.md)
- [Interpreter Guide](../en/guide/interpreter.md)
- [Feature Parity](../feature-parity.md)
