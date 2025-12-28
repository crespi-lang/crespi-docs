# Visión General de la Arquitectura

> **Idioma:** Español | [English](../../en/architecture/overview.md)

---

Crespi es un lenguaje de programación bilingüe implementado en Rust. Cuenta con un intérprete tree-walking para desarrollo y un compilador nativo basado en LLVM para producción.

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Código Fuente                                │
│                      (archivos .crespi)                              │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Lexer/Scanner                                │
│            (Tokenización con ASI, mapeo de palabras clave)           │
│                   Inglés → Token ← Español                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            Parser                                    │
│         (Descenso recursivo con precedencia ascendente)              │
│                         Produce AST                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌───────────────────────────────┐ ┌───────────────────────────────────┐
│        Intérprete             │ │       Compilador Nativo            │
│   (Evaluación tree-walking)   │ │                                    │
│                               │ │    ┌─────────────────────────┐    │
│  ┌─────────────────────────┐  │ │    │   HIR (IR de alto nivel) │    │
│  │       Entorno           │  │ │    │  (Reducción desde AST)   │    │
│  │   (Ámbito léxico)       │  │ │    └─────────────────────────┘    │
│  └─────────────────────────┘  │ │                │                   │
│                               │ │                ▼                   │
│  ┌─────────────────────────┐  │ │    ┌─────────────────────────┐    │
│  │  Value (basado en Rc)   │  │ │    │        LLVM IR          │    │
│  │  Tipos del intérprete   │  │ │    │  (Generación de código) │    │
│  └─────────────────────────┘  │ │    └─────────────────────────┘    │
└───────────────────────────────┘ │                │                   │
            │                     │                ▼                   │
            ▼                     │    ┌─────────────────────────┐    │
┌───────────────────────────────┐ │    │   Ejecutable Nativo     │    │
│          Salida               │ │    │   (+ crespi-runtime)    │    │
└───────────────────────────────┘ │    └─────────────────────────┘    │
                                  └───────────────────────────────────┘
```

---

## Decisiones de Diseño Clave

### 1. Soporte Bilingüe con Inglés Primario

El núcleo del lenguaje usa **inglés como forma canónica**:
- Palabras clave en inglés (`var`, `class`, `fn`, `this`) son primarias
- Palabras clave en español (`variable`, `tipo`, `bloque`, `yo`) son alias definidos en el lexer
- Todo el código interno, fases del compilador y runtime usan identificadores en inglés
- La traducción al español ocurre a nivel del lexer (token → mismo TokenKind)

Esto asegura:
- Representación interna consistente
- Fácil adición de más idiomas en el futuro
- Sin overhead en tiempo de ejecución por cambio de idioma

#### Flujo de paquetes de idioma

- `crespi-schema` define las listas fuente para palabras clave, builtins, tipos en tiempo de ejecucion y alias de operadores.
- `crespi-langpack` valida archivos `.crespilang` contra el esquema (validate/diff).
- `crespi-i18n` carga paquetes y ofrece mapas directos/inversos.
- El lexer usa los mapas inversos para normalizar palabras clave/operadores/builtins a tokens e identificadores en ingles.

### 2. Valores etiquetados (Tagged Values)

El backend LLVM usa un struct etiquetado (tag + payload) para valores
dinamicos y tipos nativos cuando se conocen:
- Primitivos conocidos usan tipos de maquina (i64, f64, i8)
- Valores dinamicos usan `CrespiValue` (tag + payload)
- Punteros a heap se guardan en el payload

Ver `docs/llvm/abi.md` para la ABI actual.

### 3. Conteo de Referencias con Detección de Ciclos

El runtime usa **conteo de referencias** con detección de ciclos:
- Cada objeto en el heap tiene un contador de referencias
- Ciclos detectados mediante mark-sweep cuando los contadores no llegan a cero
- Entornos de closures rastreados correctamente para capturas

### 4. Dos Modos de Ejecución

| Modo | Binario | Caso de Uso |
|------|---------|-------------|
| Intérprete | `crespi` | Desarrollo, REPL, depuración |
| Compilador | `crespic` | Producción, rendimiento crítico |

Ambos modos soportan todas las características del lenguaje.

### 5. Genéricos con Duck Typing

Los genéricos usan **sintaxis de corchetes** para evitar ambigüedad:
```crespi
tipo Caja[T](immutable valor)    // No <T> para evitar ambigüedad con operadores de comparación
```

Los parámetros de tipo se parsean pero no se verifican en tiempo de ejecución (duck typing).

### 6. Paridad entre Interprete y Compilador

- Ambos modos dependen de nombres canonicos en ingles despues del lexer.
- Los builtins deben implementarse en `crespi-core` (interprete) y `crespi-runtime` (compilado), y registrarse en codegen (`lowering.rs`, `compiler.rs`).
- Al agregar palabras clave/operadores/builtins/tipos, actualiza `crespi-schema`, los paquetes de idioma y la documentacion.
- Las constantes `PI` y `E` se insertan como literales de tipo float durante la compilacion (no son llamadas a funciones).

---

## Flujo de Datos

### Flujo de Interpretación

```
Fuente → Lexer → Parser → AST → Intérprete → Valor
                                     ↓
                              Entorno (ámbitos)
```

### Flujo de Compilación

```
Fuente → Lexer → Parser → AST → HIR (reducción) → LLVM IR → Código Objeto
                                      ↓                              ↓
                          Resolución de variables           Enlazar con runtime
                          Análisis de variables libres               ↓
                          Traducción de builtins            Ejecutable Nativo
```

---

## Sistema de Módulos

Inspirado en Swift, el sistema de módulos soporta:

```crespi
importar Helpers                  // Módulo completo
importar Math.Vector              // Módulo anidado
importar Helper { double, Point } // Símbolos explícitos
importar tipo Math.Punto          // Clase específica
importar bloque Utils.formatear   // Función específica
```

**Orden de resolución:**
1. Relativo al archivo que importa
2. Raíz del código fuente
3. Rutas de búsqueda adicionales con `-I`

**Nomenclatura de archivos:**
- `snake_case.crespi` → nombre de módulo `PascalCase`
- Directorios crean módulos anidados

---

## Ver También

- [Estructura de Crates](crates.md) - Descripción de cada crate
