# Contributing to Crespi

> **Language:** [Español](../../es/contribuir/CONTRIBUTING.md) | English

---

Thank you for your interest in contributing to Crespi! This guide will help you get started.

## Development Environment

### Prerequisites

- **Rust 1.70+** with Cargo
- **Git**

### Clone and Build

```bash
git clone https://github.com/crespi-lang/crespi-lang.git
cd crespi-lang

# Build the language
cd lang
cargo build

# Run tests
cargo test
```

---

## Project Structure

```
crespi-lang/
├── crates/
│   ├── crespi-core/     # Parser, interpreter, AST
│   ├── crespi-codegen/  # HIR lowering + optimization
│   ├── crespi-llvm/     # Native compiler (LLVM)
│   ├── crespi-runtime/  # Runtime library
│   ├── crespi-cli/      # Command-line interface
│   ├── crespi-i18n/     # Internationalization
│   ├── crespi-langpack/ # Language packs
│   ├── crespi-schema/   # Schema definitions
│   ├── crespi-cargo/    # Cargo integration logic
│   └── crespi-bindgen/  # FFI binding generator
├── examples/             # Example programs (scripts + Cargo projects)
├── docs/                # Documentation
└── Cargo.toml           # Workspace configuration
```

---

## Common Commands

### Rust (Language Core)

```bash
# Build
cargo build                    # Debug build
cargo build --release          # Release build

# Test
cargo test                     # Run all tests
cargo test -p crespi-core      # Test specific crate

# Lint and Format
cargo fmt                      # Format code
cargo clippy --workspace --all-targets -- -D warnings

# Run
cargo run --bin crespi         # Start REPL
cargo run --bin crespi -- file.crespi    # Interpret file
cargo run --bin crespic -- file.crespi   # Compile to native

# Debug output
cargo run --bin crespi -- hir file.crespi   # Show HIR
cargo run --bin crespi -- llvm file.crespi  # Show LLVM IR
```

---

## Testing

### Running Tests

```bash
# All tests
cargo test

# Specific crate
cargo test -p crespi-core
cargo test -p crespi-codegen
cargo test -p crespi-runtime

# Specific test
cargo test test_name

# With output
cargo test -- --nocapture
```

### Test Organization

- **Unit tests**: In `src/` files with `#[cfg(test)]` modules
- **Integration tests**: In `crates/crespi-core/tests/`
- **Sample programs**: `examples/simple_scripts/*.crespi` serve as documentation and test cases; Cargo-based demos live in `examples/cargo_projects/`
- **Locale-sensitive tests**: If tests use localized syntax (e.g., Spanish keywords), set locale in helpers via `crespi_i18n::set_locale(Locale::Spanish)`
- **Schema parity tests**: Builtin lists are validated against `crespi-schema` in interpreter/runtime/codegen tests

### Adding Tests

1. For new language features, add a sample in `examples/simple_scripts/`
2. Add integration tests in the appropriate `tests/` directory
3. Ensure both interpreter and compiler handle the feature

---

## Pull Request Process

### Before Submitting

1. **Run all checks locally:**
   ```bash
   cargo fmt
   cargo clippy --workspace --all-targets -- -D warnings
   cargo test
   ```

2. **Ensure documentation is updated** if you changed behavior

3. **Add tests** for new features or bug fixes

### PR Guidelines

- **One feature/fix per PR** - Keep changes focused
- **Descriptive title** - Summarize the change
- **Link related issues** - Reference with `Fixes #123` or `Closes #123`
- **Update AGENTS.md** if you change language syntax or commands

### Commit Messages

Use clear, descriptive commit messages:

```
Add support for guard statements

- Implement `guard` keyword for early returns
- Add tests for guard with pattern matching
- Update documentation
```

---

## Code Review

All PRs require review before merging. Reviewers will check:

- [ ] Code follows project style (see [Code Style](code-style.md))
- [ ] Tests pass and new tests added where appropriate
- [ ] Documentation updated
- [ ] No breaking changes without discussion
- [ ] Commit history is clean

---

## Areas to Contribute

### Good First Issues

Look for issues labeled `good first issue` on GitHub.

### Feature Ideas

- Additional built-in functions
- Performance optimizations
- Better error messages
- IDE integrations
- Documentation improvements

### Documentation

- Fix typos or unclear explanations
- Add examples
- Translate to other languages

---

## Language Design Principles

When proposing language changes, keep in mind:

1. **English-first**: Core syntax uses English; Spanish via language pack
2. **Readable**: Prefer clarity over brevity
3. **Consistent**: Follow existing patterns
4. **Practical**: Features should solve real problems
5. **Compatible**: Avoid breaking existing code

---

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and ideas

---

## See Also

- [Code Style Guide](code-style.md)
- [Architecture Overview](../architecture/overview.md)
