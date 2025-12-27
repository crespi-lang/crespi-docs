# Contribuir a Crespi

> **Idioma:** Español | [English](../../en/contributing/CONTRIBUTING.md)

---

¡Gracias por tu interés en contribuir a Crespi! Esta guía te ayudará a comenzar.

## Entorno de Desarrollo

### Prerrequisitos

- **Rust 1.70+** con Cargo
- **Git**

### Clonar y Compilar

```bash
git clone https://github.com/crespi-lang/crespi-lang.git
cd crespi-lang

# Compilar el lenguaje
cd lang
cargo build

# Ejecutar tests
cargo test
```

---

## Estructura del Proyecto

```
crespi-lang/
├── crates/
│   ├── crespi-core/     # Parser, intérprete, AST
│   ├── crespi-codegen/  # Reducción/optimización HIR
│   ├── crespi-llvm/     # Compilador nativo (LLVM)
│   ├── crespi-runtime/  # Biblioteca de runtime
│   ├── crespi-cli/      # Interfaz de línea de comandos
│   ├── crespi-i18n/     # Internacionalización
│   ├── crespi-langpack/ # Paquetes de idioma
│   ├── crespi-schema/   # Definiciones de esquemas
│   ├── crespi-cargo/    # Lógica de integración con Cargo
│   └── crespigen/       # Generador de bindings FFI
├── examples/             # Programas de ejemplo (scripts + proyectos Cargo)
├── docs/                # Documentación
└── Cargo.toml           # Configuración del workspace
```

---

## Comandos Comunes

### Rust (Núcleo del Lenguaje)

```bash
# Compilar
cargo build                    # Compilación debug
cargo build --release          # Compilación release

# Tests
cargo test                     # Ejecutar todos los tests
cargo test -p crespi-core      # Test de crate específico

# Lint y Formato
cargo fmt                      # Formatear código
cargo clippy --workspace --all-targets -- -D warnings

# Ejecutar
cargo run --bin crespi         # Iniciar REPL
cargo run --bin crespi -- archivo.crespi    # Interpretar archivo
cargo run --bin crespic -- archivo.crespi   # Compilar a nativo

# Salida de depuración
cargo run --bin crespi -- hir archivo.crespi   # Mostrar HIR
cargo run --bin crespi -- llvm archivo.crespi  # Mostrar LLVM IR
```

---

## Testing

### Ejecutar Tests

```bash
# Todos los tests
cargo test

# Crate específico
cargo test -p crespi-core
cargo test -p crespi-codegen
cargo test -p crespi-runtime

# Test específico
cargo test nombre_test

# Con salida
cargo test -- --nocapture
```

### Organización de Tests

- **Tests unitarios**: En archivos `src/` con módulos `#[cfg(test)]`
- **Tests de integración**: En `crates/crespi-core/tests/`
- **Programas de ejemplo**: `examples/simple_scripts/*.crespi` sirven como documentación y casos de test; demos con Cargo viven en `examples/cargo_projects/`
- **Tests con locale**: Si un test usa sintaxis localizada (por ejemplo, palabras clave en español), fija el locale en helpers con `crespi_i18n::set_locale(Locale::Spanish)`
- **Tests de paridad de esquema**: Las listas de builtins se validan contra `crespi-schema` en tests de intérprete/runtime/codegen

### Agregar Tests

1. Para nuevas características del lenguaje, agregar un ejemplo en `examples/simple_scripts/`
2. Agregar tests de integración en el directorio `tests/` apropiado
3. Asegurar que tanto intérprete como compilador manejen la característica

---

## Proceso de Pull Request

### Antes de Enviar

1. **Ejecutar todas las verificaciones localmente:**
   ```bash
   cargo fmt
   cargo clippy --workspace --all-targets -- -D warnings
   cargo test
   ```

2. **Asegurar que la documentación esté actualizada** si cambiaste comportamiento

3. **Agregar tests** para nuevas características o correcciones de bugs

### Guías para PRs

- **Un feature/fix por PR** - Mantener los cambios enfocados
- **Título descriptivo** - Resumir el cambio
- **Enlazar issues relacionados** - Referenciar con `Fixes #123` o `Closes #123`
- **Actualizar AGENTS.md** si cambias sintaxis del lenguaje o comandos

### Mensajes de Commit

Usar mensajes de commit claros y descriptivos:

```
Agregar soporte para sentencias guard

- Implementar palabra clave `guard` para retornos tempranos
- Agregar tests para guard con pattern matching
- Actualizar documentación
```

---

## Revisión de Código

Todos los PRs requieren revisión antes de merge. Los revisores verificarán:

- [ ] El código sigue el estilo del proyecto (ver [Estilo de Código](estilo-codigo.md))
- [ ] Los tests pasan y se agregaron nuevos tests donde corresponde
- [ ] Documentación actualizada
- [ ] Sin cambios breaking sin discusión
- [ ] Historial de commits limpio

---

## Áreas para Contribuir

### Good First Issues

Buscar issues etiquetados `good first issue` en GitHub.

### Ideas de Features

- Funciones integradas adicionales
- Optimizaciones de rendimiento
- Mejores mensajes de error
- Integraciones con IDEs
- Mejoras de documentación

### Documentación

- Corregir errores tipográficos o explicaciones poco claras
- Agregar ejemplos
- Traducir a otros idiomas

---

## Principios de Diseño del Lenguaje

Al proponer cambios al lenguaje, tener en cuenta:

1. **Inglés primario**: La sintaxis core usa inglés; español vía paquete de idioma
2. **Legible**: Preferir claridad sobre brevedad
3. **Consistente**: Seguir patrones existentes
4. **Práctico**: Las características deben resolver problemas reales
5. **Compatible**: Evitar romper código existente

---

## Obtener Ayuda

- **GitHub Issues**: Para bugs y solicitudes de features
- **Discussions**: Para preguntas e ideas

---

## Ver También

- [Guía de Estilo de Código](estilo-codigo.md)
- [Visión General de la Arquitectura](../arquitectura/general.md)
