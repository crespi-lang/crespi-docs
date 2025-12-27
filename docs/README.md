# Crespi - Documentación / Documentation

> Un lenguaje de programación en español / A Spanish programming language

---

## Idioma / Language

| Español | English |
|---------|---------|
| [Documentación en Español](es/README.md) | [English Documentation](en/README.md) |

---

## Inicio Rápido / Quick Start

### Español

```crespi
// Hola Mundo
variable mensaje = "Hola, Mundo"
mostrar(mensaje)

// Función simple
bloque suma(a, b) {
    resultado a + b
}

mostrar(suma(3, 5))  // 8
```

### English

```crespi
// Hello World
var message = "Hello, World"
print(message)

// Simple function
fn add(a, b) {
    return a + b
}

print(add(3, 5))  // 8
```

---

## Instalación / Installation

### Desde Código Fuente / From Source

```bash
# Clonar repositorio / Clone repository
git clone https://github.com/crespi-lang/crespi-lang.git
cd crespi-lang

# Compilar / Build
cargo build --release

# Ejecutar REPL / Run REPL
cargo run
```

### VS Code Extension

Moved to / Movido a: [crespi-ide-support](https://github.com/crespi-lang/crespi-ide-support)

### Plataforma Web / Web Platform

Visita / Visit: [crespi.dev](https://crespi.dev)

---

## Enlaces / Links

- [GitHub Repository](https://github.com/crespi-lang/crespi-lang)
- [IDE Support (VS Code)](https://github.com/crespi-lang/crespi-ide-support)
- [WASM Runtime](https://github.com/crespi-lang/crespi-wasm)
- [Ejemplos / Examples](https://github.com/crespi-lang/crespi-lang/tree/main/examples)
