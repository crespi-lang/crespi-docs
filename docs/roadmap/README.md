# Crespi Roadmap

This folder contains planned features and enhancements for the Crespi language.

## Status Legend

- **Planned** - Design phase, not yet started
- **In Progress** - Currently being implemented
- **Completed** - Implemented and released

## Features

| Feature | Status | Priority | Description |
|---------|--------|----------|-------------|
| [Dictionary Literals](dictionary-literals.md) | Completed | High | `["key": value]` syntax parsing |
| [Anonymous Functions](anonymous-functions.md) | Completed | Medium | `fn(x: Int = 5) = x * x` syntax |
| [Compile-Time Constants](const.md) | Planned | Medium | `const` keyword for compile-time evaluation |
| [Exhaustive Pattern Matching](exhaustive-pattern-matching.md) | Completed | Medium | Remove mandatory `default` when all cases covered |
| [Standard Library](standard-library.md) | In Progress | Medium | Organize built-ins into `std.*` modules |
| [Compiled REPL](compiled-repl.md) | Planned | Low | REPL using native compiler backend |

## Contributing

When adding a new roadmap item:

1. Create a new markdown file in this folder
2. Include: Summary, Current State, Proposed Solution, Implementation Plan
3. Update this README with the new entry
4. Link to related documentation and issues

## See Also

- [Feature Parity](../feature-parity.md) - Interpreter vs Compiler feature comparison
- [Language Comparison](../language-comparison.md) - Crespi vs other languages
