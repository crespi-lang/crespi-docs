# Intérprete

> **Idioma:** Español | [English](../../en/guide/interpreter.md)

---

El intérprete de Crespi (`crespi`) ejecuta tu código directamente sin compilarlo. Es ideal para desarrollo, aprendizaje y scripts.

## Inicio Rápido

```bash
# Ejecutar un archivo
crespi programa.crespi

# Ejecutar código directamente
crespi -c 'mostrar("Hola, Mundo!")'

# Iniciar el REPL interactivo
crespi
```

---

## Modos de Ejecución

### Ejecutar Archivo

```bash
crespi mi_programa.crespi
```

Ejecuta el archivo y muestra la salida en la terminal.

### Verificar Tipos (Opcional)

```bash
crespi --check mi_programa.crespi
```

Ejecuta el verificador de tipos antes de ejecutar y falla si hay errores.

### Código en Línea

```bash
crespi -c 'variable x = 5; mostrar(x * 2)'
```

Útil para pruebas rápidas sin crear archivos.

### REPL Interactivo

```bash
crespi
# o explícitamente:
crespi repl
```

El REPL (Read-Eval-Print Loop) te permite escribir y ejecutar código línea por línea:

```
Crespi REPL v0.0.1
Escribe 'salir' para terminar

>>> variable nombre = "Ana"
>>> mostrar("Hola, " + nombre)
Hola, Ana
>>> salir
```

---

## Comandos de Depuración

### Ver Tokens

```bash
crespi tokens programa.crespi
```

Muestra los tokens generados por el lexer:

```
Token { kind: Variable, lexeme: "variable", ... }
Token { kind: Identifier, lexeme: "x", ... }
Token { kind: Equal, lexeme: "=", ... }
...
```

### Ver AST

```bash
crespi ast programa.crespi
```

Muestra el árbol de sintaxis abstracta generado por el parser.

---

## Referencia CLI

| Comando | Descripción |
|---------|-------------|
| `crespi <archivo>` | Ejecutar un archivo |
| `crespi -c <código>` | Ejecutar código en línea |
| `crespi repl` | Iniciar REPL interactivo |
| `crespi tokens <archivo>` | Mostrar tokens del lexer |
| `crespi ast <archivo>` | Mostrar árbol de sintaxis |
| `crespi --check <archivo>` | Ejecutar verificación de tipos antes de ejecutar |
| `crespi --help` | Mostrar ayuda |
| `crespi --version` | Mostrar versión |

---

## Características Soportadas

El intérprete soporta **todas** las características del lenguaje:

- Variables y constantes
- Todos los tipos de datos (incluyendo **diccionarios**)
- Control de flujo: `si`, `mientras`, `repetir`
- Funciones y closures
- Clases con herencia
- Decoradores (`@memorizar`)
- Optimización de llamadas en cola (TCO)

---

## Cuándo Usar el Intérprete

| Caso de Uso | Recomendación |
|-------------|---------------|
| Desarrollo y pruebas | ✅ Intérprete |
| Aprendizaje del lenguaje | ✅ Intérprete |
| Scripts rápidos | ✅ Intérprete |
| Uso de diccionarios | ✅ Intérprete (único que los soporta) |
| Distribución de ejecutables | ❌ Usar [compilador](compilador.md) |
| Máximo rendimiento | ❌ Usar [compilador](compilador.md) |

---

## Véase También

- [Compilador Nativo](compilador.md) - Compilar a ejecutables
- [Variables](variables.md) - Tipos de datos y variables
- [Funciones](funciones.md) - Definir y usar funciones
