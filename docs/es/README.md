# Crespi - Documentacion

> **Idioma:** Espanol | [English](../en/README.md)

---

Crespi es un lenguaje de programacion multilingue (mediante paquetes de idioma), disenado para hacer la programacion mas accesible. El espanol es el primer paquete de idioma, con arquitectura preparada para idiomas adicionales.

## Contenido

### Inicio

- [Inicio Rapido](inicio-rapido.md) - Tu primer programa en Crespi

### Referencia del Lenguaje

- [Palabras Clave](referencia/palabras-clave.md) - Todas las palabras reservadas
- [Operadores](referencia/operadores.md) - Operadores aritmeticos, de comparacion y logicos
- [Funciones Integradas](referencia/funciones.md) - Funciones disponibles por defecto
- [Tipos de Datos](referencia/tipos.md) - Sistema de tipos de Crespi
- [Gramatica (ANTLR4)](referencia/gramatica.md) - Gramatica de referencia
- [FFI](referencia/ffi.md) - Interfaz de Funciones Foraneas

### Ejecucion

- [Interprete](guia/interprete.md) - Ejecutar codigo directamente
- [Compilador](guia/compilador.md) - Compilar a ejecutable nativo
- [Paridad de Funcionalidades](../feature-parity.md) - Matriz interprete vs compilador

### Arquitectura

- [Vision General](arquitectura/general.md) - Arquitectura de alto nivel
- [Estructura de Crates](arquitectura/crates.md) - Organizacion de crates Rust

### Contribuir

- [Guia de Contribucion](contribuir/CONTRIBUTING.md) - Como contribuir
- [Estilo de Codigo](contribuir/estilo-codigo.md) - Estandares de codificacion

### Guia del Lenguaje

- [Variables y Constantes](guia/variables.md)
- [Control de Flujo](guia/control-flujo.md)
- [Funciones](guia/funciones.md)
- [Listas y Diccionarios](guia/colecciones.md)
- [Clases y Objetos](guia/clases.md)
- [Caracteristicas Avanzadas](guia/avanzado.md)

---

## Caracteristicas Principales

### Sintaxis Multilingue

Crespi soporta sintaxis en multiples idiomas mediante paquetes de idioma. El espanol es el primer paquete disponible:

```crespi
variable nombre = "Ana"
immutable PI = 3.14159

si nombre igualA "Ana" {
    mostrar("Hola, Ana!")
}
```

### Sistema de Tipos

Crespi utiliza tipado estatico con inferencia de tipos estilo Hindley-Milner. Las anotaciones de tipo son opcionales gracias a la inferencia, pero el sistema subyacente es estatico:

- **Compilador:** Verificacion de tipos estricta - los errores bloquean la compilacion
- **Interprete:** Modo relajado - los errores de tipo aparecen como advertencias pero la ejecucion continua

### Operadores Legibles

Crespi permite usar operadores en forma simbolica o textual:

```crespi
// Forma simbolica
variable suma = 5 + 3

// Forma textual (equivalente)
variable suma = 5 mas 3
```

### Programacion Orientada a Objetos

```crespi
tipo Persona(immutable nombre, immutable edad) {
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

## Instalacion

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
- [Soporte IDE](https://github.com/crespi-lang/crespi-ide-support) - Extension VS Code y LSP
- [Runtime WASM](https://github.com/crespi-lang/crespi-wasm) - Bindings de WebAssembly
- [Plataforma Web](https://crespilang.izantech.app) - Aprende en el navegador
