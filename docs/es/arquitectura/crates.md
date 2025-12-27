# Estructura de Crates

> **Idioma:** Español | [English](../../en/architecture/crates.md)

---

El lenguaje Crespi está organizado como un workspace de Cargo con crates especializados para diferentes responsabilidades.

## Grafo de Dependencias de Crates

```
                    ┌─────────────┐
                    │ crespi-cli  │  (Binario: crespi)
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
      ┌─────────────┐ ┌─────────┐
      │ crespi-llvm │ │crespi-  │
      │ (crespic)   │ │  core   │
      └──────┬──────┘ └────┬────┘
             │             │
             ▼             │
      ┌─────────────┐      │
      │crespi-codegen│     │
      └──────┬──────┘      │
             │             │
             ▼             │
      ┌─────────────┐      │
      │crespi-runtime│◄────┴
      └─────────────┘

      ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
      │ crespi-i18n │  │crespi-schema│  │crespi-langpack│
      └─────────────┘  └─────────────┘  └─────────────┘
            (Crates de soporte para internacionalización)
```

---

## Crates Principales

### crespi-core

**El corazón de la implementación del lenguaje.**

| Módulo | Propósito |
|--------|-----------|
| `lexer/scanner.rs` | Tokenización con Inserción Automática de Punto y Coma (ASI) |
| `lexer/token.rs` | Tipos de token, mapeo de palabras clave (inglés primario, español alias) |
| `parser/parser.rs` | Parser de descenso recursivo con precedencia ascendente |
| `parser/ast.rs` | Tipos AST (Stmt, Expr) con Span para ubicación de errores |
| `interpreter/eval.rs` | Intérprete tree-walking |
| `interpreter/environment.rs` | Ámbito léxico con `Rc<RefCell<Environment>>` |
| `interpreter/builtins.rs` | 60 funciones integradas |
| `interpreter/value.rs` | Valores del runtime del intérprete (basados en Rc) |
| `module/` | Sistema de módulos para compilación multi-archivo |

**Características principales:**
- Parsing e interpretación completa del lenguaje
- Soporte para métodos de extensión
- Genéricos (duck-typed)
- Resolución de módulos multi-archivo

---

### crespi-codegen

**Reducción y optimización de HIR compartidas por backends.**

| Módulo | Propósito |
|--------|-----------|
| `hir.rs` | Tipos de IR de alto nivel entre AST y el backend |
| `lowering.rs` | Conversión AST → HIR, resolución de variables, análisis de closures |
| `optimizer.rs` | Pasadas de optimización sobre HIR |

**Pipeline de compilación:**
```
AST → HIR (reducción) → [Optimizador]
```

**Responsabilidades principales:**
- Análisis de variables libres para closures
- Traducción de nombres de builtins español → inglés
- Metadatos de contexto GC
- Validación de firma de punto de entrada

---

### crespi-llvm

**Generación de código nativo vía LLVM (Inkwell).**

| Módulo | Propósito |
|--------|-----------|
| `compiler.rs` | Traducción HIR → LLVM IR, emisión de código objeto |
| `types.rs` | Mapeo de tipos y firmas Crespi → LLVM |
| `passes.rs` | Pipeline de optimización LLVM |

**Pipeline de compilación:**
```
AST → HIR (reducción) → LLVM IR → Código Nativo
```

---

### crespi-runtime

**Biblioteca de soporte en tiempo de ejecución para programas compilados.**

| Módulo | Propósito |
|--------|-----------|
| `value.rs` | Representación con etiquetas (tag + payload) usada por LLVM |
| `gc.rs` | Conteo de referencias con detección de ciclos |
| `builtins.rs` | Funciones integradas compatibles con C |

**Convención de llamada:**
- Todas las funciones reciben `gc_ctx: *mut GcContext` como primer parámetro oculto
- El punto de entrada crea el contexto GC, lo pasa a todas las llamadas, lo destruye al salir

Ver `docs/llvm/abi.md` para la ABI actual.

---

### crespi-cli

**Interfaz de línea de comandos para intérprete y compilador.**

| Binario | Propósito |
|---------|-----------|
| `crespi` | Intérprete con REPL |
| `crespic` | Compilador nativo |

**Modos de depuración:**
- `crespi hir <archivo>` - Mostrar representación HIR
- `crespi llvm <archivo>` - Mostrar LLVM IR

---

### crespi-cargo

**Biblioteca de integración con Cargo.**

Implementa la lógica para analizar proyectos Rust, extraer metadatos de API vía `rustdoc`, y generar bindings FFI. Usado tanto por el compilador (`crespic`) para enlazado automático como por la herramienta independiente `crespigen`.

---

### crespigen

**Generador de bindings FFI independiente.**

Una herramienta CLI que genera bindings de Crespi para bibliotecas Rust.
- Analiza la salida JSON de `rustdoc`
- Genera código wrapper FFI en Rust
- Compila todo en una biblioteca estática
- Embebe los fuentes de `crespi-ffi` y `crespi-runtime` para ser autocontenido

---

## Repositorios Externos

### crespi-wasm

**Bindings de WebAssembly para ejecución en navegador.**
Movido a [crespi-wasm](https://github.com/crespi-lang/crespi-wasm).

### crespi-ide-support

**Extensión VS Code y Servidor de Lenguaje (LSP).**
Movido a [crespi-ide-support](https://github.com/crespi-lang/crespi-ide-support).

---

## Crates de Soporte

### crespi-i18n

**Infraestructura de internacionalización.**

Proporciona soporte completo de localización para el lenguaje Crespi:

| Componente | Propósito |
|------------|-----------|
| `langpack.rs` | Carga paquetes `.crespilang` para alias de palabras clave/builtins/operadores/tipos |
| `bundle.rs` | Bundle de traducciones basado en FTL usando Mozilla Fluent |
| `locale.rs` | Detección y gestión de locale (locale del sistema, variable `CRESPI_LANG`) |
| `locales/en/*.ftl` | Traducciones en inglés |
| `locales/es/*.ftl` | Traducciones en español |

**Cobertura de traducciones:**
- ✅ Errores y etiquetas del parser
- ✅ Errores y etiquetas del runtime
- ✅ Errores del lexer
- ✅ Errores del sistema de módulos (no encontrado, dependencia circular, símbolo no encontrado)
- ✅ Envoltorios de errores principales (sintaxis, léxico, ejecución)
- ✅ Cadenas de contexto del parser (nombre de variable, nombre de función, etc.)
- ✅ Mensajes del CLI
- ✅ Errores de funciones integradas

**Uso:**
```rust
use crespi_i18n::{t, tr};

// Traducción simple
let msg = t("label-here");

// Traducción con argumentos
let msg = tr!("runtime-undefined-variable", name = var_name);
```

---

### crespi-langpack

**Herramientas de paquetes de idioma.**

CLI para validar, generar y comparar paquetes de idioma contra `crespi-schema`.
Los packs viven en `crespi-i18n/packs/`.

---

### crespi-schema

**Esquema de paquetes de idioma.**

Define enums canonicos para palabras clave, builtins, tipos en tiempo de ejecucion y alias de operadores usados por los packs y la validacion.

---

## Compilación

```bash
# Compilar todos los crates
cargo build

# Compilación release (optimizada)
cargo build --release

# Ejecutar tests
cargo test

# Test de crate específico
cargo test -p crespi-core
```

---

## Ver También

- [Visión General de la Arquitectura](general.md)
