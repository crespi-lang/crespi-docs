# Biblioteca Estándar (std)

> **Idioma:** Español | [English](../../en/guide/standard-library.md)

---

Crespi agrupa las funciones integradas en módulos virtuales `std.*`. Estos módulos están disponibles sin archivos en disco, y las funciones globales siguen funcionando por compatibilidad.

Los nombres en inglés son canónicos; los alias localizados (por ejemplo `raiz`, `recortar`, `mostrar`) se normalizan durante el escaneo.

## Importar desde std

```crespi
importar std.math { raiz, PI }
importar std.string como s

variable area = PI * 4 * 4
mostrar(s.recortar("  hola  "))
```

## Acceso calificado

```crespi
variable raiz81 = std.math.raiz(81)
variable tam = std.collections.longitud([1, 2, 3])
```

## Módulos

- `std.io`: `print`, `read` (alias `input`)
- `std.convert`: `str`, `int`, `float`, `typeof`
- `std.math`: funciones matemáticas más `PI` y `E`
- `std.string`: helpers de texto como `trim`, `split`, `replace`, `starts_with`
- `std.collections`: helpers de colecciones como `length`, `contains`, `map`, `filter`, `reduce`
- `std.functional`: `memoize`, `inline`

## La sintaxis de método sigue funcionando

Las funciones de módulo son los mismos builtins, así que la sintaxis de método sigue funcionando:

```crespi
variable duplicado = [1, 2, 3].mapear { x -> x * 2 }
variable nombre = "  Ana  ".recortar()
```

## Compatibilidad hacia atrás

```crespi
mostrar("hola")
std.io.mostrar("hola")

raiz(16)
std.math.raiz(16)
```
