# Crespi - Documentación

> **Idioma:** Español | [English](../en/README.md)

---

Crespi es un lenguaje de programación con sintaxis en español, diseñado para hacer la programación más accesible a hispanohablantes.

## Contenido

### Inicio

- [Inicio Rápido](inicio-rapido.md) - Tu primer programa en Crespi

### Referencia del Lenguaje

- [Palabras Clave](referencia/palabras-clave.md) - Todas las palabras reservadas
- [Operadores](referencia/operadores.md) - Operadores aritméticos, de comparación y lógicos
- [Funciones Integradas](referencia/funciones.md) - Funciones disponibles por defecto
- [Tipos de Datos](referencia/tipos.md) - Sistema de tipos de Crespi
- [Gramatica (ANTLR4)](referencia/gramatica.md) - Gramatica de referencia

### Ejecución

- [Intérprete](guia/interprete.md) - Ejecutar código directamente
- [Compilador](guia/compilador.md) - Compilar a ejecutable nativo
- [Paridad de Funcionalidades](../feature-parity.md) - Matriz intérprete vs compilador

### Arquitectura

- [Visión General](arquitectura/general.md) - Arquitectura de alto nivel
- [Estructura de Crates](arquitectura/crates.md) - Organización de crates Rust

### Contribuir

- [Guía de Contribución](contribuir/CONTRIBUTING.md) - Cómo contribuir
- [Estilo de Código](contribuir/estilo-codigo.md) - Estándares de codificación

### Guía del Lenguaje

- [Variables y Constantes](guia/variables.md)
- [Control de Flujo](guia/control-flujo.md)
- [Funciones](guia/funciones.md)
- [Listas y Diccionarios](guia/colecciones.md)
- [Clases y Objetos](guia/clases.md)
- [Características Avanzadas](guia/avanzado.md)

---

## Características Principales

### Sintaxis en Español

```crespi
variable nombre = "Ana"
immutable PI = 3.14159

si nombre igualA "Ana" {
    mostrar("Hola, Ana!")
}
```

### Operadores Legibles

Crespi permite usar operadores en forma simbólica o textual:

```crespi
// Forma simbólica
variable suma = 5 + 3

// Forma textual (equivalente)
variable suma = 5 mas 3
```

### Programación Orientada a Objetos

```crespi
tipo Persona(let nombre, let edad) {
    bloque saludar() {
        mostrar("Hola, soy " + yo.nombre)
    }
}

variable ana = Persona("Ana", 25)
ana.saludar()
```

### Funciones de Primera Clase

```crespi
bloque duplicar(x) {
    resultado x * 2
}

bloque aplicar(funcion, valor) {
    resultado funcion(valor)
}

mostrar(aplicar(duplicar, 5))  // 10
```

---

## Instalación

### Requisitos

- Rust 1.70+
- Cargo

### Compilar desde Fuente

```bash
git clone https://github.com/usuario/crespi-lang.git
cd crespi-lang
cargo build --release
```

### Ejecutar

```bash
# REPL interactivo
cargo run

# Ejecutar un archivo
cargo run -- programa.crespi
```

---

## Recursos

- [Ejemplos](https://github.com/crespi-lang/crespi-lang/tree/main/examples) - Programas de ejemplo
- [Soporte IDE](https://github.com/crespi-lang/crespi-ide-support) - Extensión VS Code y LSP
- [Runtime WASM](https://github.com/crespi-lang/crespi-wasm) - Bindings de WebAssembly
- [Plataforma Web](https://crespi.dev) - Aprende en el navegador
