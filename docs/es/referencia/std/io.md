# std.io

> **Idioma:** Espanol | [English](../../../en/reference/std/io.md)

---

Funciones de entrada y salida para interactuar con la consola.

## Importacion

```crespi
importar std.io { mostrar, leer }
```

O usar directamente sin importar (disponible globalmente).

---

## Referencia Rapida

| Funcion | Alias Ingles | Parametros | Retorna | Descripcion |
|---------|--------------|------------|---------|-------------|
| `mostrar` | `print` | `valor: Any` | `Unit` | Imprimir a stdout |
| `leer` | `read` | - | `String` | Leer linea de stdin |

---

## Funciones

### `mostrar(valor)`

Imprime un valor a la salida estandar seguido de una nueva linea.

**Parametros:**
- `valor: Any` - Cualquier valor a mostrar

**Retorna:** `Unit` (nada)

**Ejemplos:**

```crespi
mostrar("Hola, Mundo!")     // Hola, Mundo!
mostrar(42)                  // 42
mostrar(3.14)                // 3.14
mostrar(verdadero)           // true
mostrar([1, 2, 3])           // [1, 2, 3]
mostrar(["nombre": "Ana"])   // {nombre: Ana}
```

**Imprimir multiples valores:**

```crespi
variable nombre = "Ana"
variable edad = 25
mostrar("Nombre: " + nombre + ", Edad: " + texto(edad))
// Nombre: Ana, Edad: 25

// O con interpolacion de texto
mostrar("Nombre: $nombre, Edad: $edad")
// Nombre: Ana, Edad: 25
```

---

### `leer()`

Lee una linea de texto de la entrada estandar.

**Alias:** `input()`

**Parametros:** Ninguno

**Retorna:** `String` - La linea leida (sin salto de linea final)

**Ejemplos:**

```crespi
mostrar("Como te llamas?")
variable nombre = leer()
mostrar("Hola, $nombre!")

// Entrada: Ana
// Salida: Hola, Ana!
```

**Leer numeros:**

```crespi
mostrar("Ingresa un numero:")
variable entrada = leer()
variable numero = entero(entrada)
mostrar("Ingresaste: $numero")
```

**Menu interactivo:**

```crespi
funcion mostrar_menu() {
    mostrar("1. Opcion A")
    mostrar("2. Opcion B")
    mostrar("3. Salir")
    mostrar("Elige: ")
    retornar leer()
}

variable opcion = mostrar_menu()
cuando opcion {
    caso "1" -> mostrar("Seleccionaste A")
    caso "2" -> mostrar("Seleccionaste B")
    caso "3" -> mostrar("Adios!")
    defecto -> mostrar("Opcion invalida")
}
```

---

## Ejemplos Practicos

### Validacion de Entrada

```crespi
funcion leer_numero_positivo() -> Int {
    mientras verdadero {
        mostrar("Ingresa un numero positivo: ")
        variable entrada = leer()
        variable n = entero(entrada)
        si n > 0 {
            retornar n
        }
        mostrar("Invalido. Intenta de nuevo.")
    }
}

variable n = leer_numero_positivo()
mostrar("Ingresaste: $n")
```

### Calculadora Simple

```crespi
importar std.io { mostrar, leer }
importar std.convert { entero }

mostrar("Primer numero: ")
variable a = entero(leer())

mostrar("Segundo numero: ")
variable b = entero(leer())

mostrar("Operacion (+, -, *, /): ")
variable op = leer()

variable resultado = cuando op {
    caso "+" -> a + b
    caso "-" -> a - b
    caso "*" -> a * b
    caso "/" -> a / b
    defecto -> 0
}

mostrar("Resultado: $resultado")
```

---

## Ver Tambien

- [std.convert](convert.md) - Conversiones de tipo para parsear entrada
- [Biblioteca Estandar](index.md) - Todos los modulos
