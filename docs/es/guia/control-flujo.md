# Control de Flujo

> **Idioma:** Español | [English](../../en/guide/control-flow.md)

---

Crespi proporciona estructuras para controlar el flujo de ejecución de tu programa.

## Condicionales

### Sintaxis Básica: `si`

Ejecuta código solo si una condición es verdadera:

```crespi
variable edad = 18

si edad >= 18 {
    mostrar("Mayor de edad")
}
```

### Con Alternativa: `o`

Ejecuta código alternativo si la condición es falsa:

```crespi
variable edad = 16

si edad >= 18 {
    mostrar("Mayor de edad")
} o {
    mostrar("Menor de edad")
}
// Salida: Menor de edad
```

### Múltiples Condiciones

Encadena varias condiciones con `o si`:

```crespi
variable nota = 75

si nota >= 90 {
    mostrar("Sobresaliente")
} o si nota >= 80 {
    mostrar("Notable")
} o si nota >= 70 {
    mostrar("Aprobado")
} o si nota >= 60 {
    mostrar("Suficiente")
} o {
    mostrar("Reprobado")
}
// Salida: Aprobado
```

### Condiciones Anidadas

Puedes anidar condicionales:

```crespi
variable edad = 25
variable tieneCarnet = verdadero

si edad >= 18 {
    si tieneCarnet {
        mostrar("Puede conducir")
    } o {
        mostrar("Necesita sacar el carnet")
    }
} o {
    mostrar("Muy joven para conducir")
}
```

### Operadores Lógicos

Combina condiciones con `&&`, `||`, y `!`:

```crespi
variable edad = 25
variable esEstudiante = verdadero
variable tieneDescuento = falso

// AND: ambas deben ser verdaderas
si edad >= 18 && esEstudiante {
    mostrar("Adulto estudiante")
}

// OR: al menos una debe ser verdadera
si esEstudiante || tieneDescuento {
    mostrar("Aplica descuento")
}

// NOT: invierte la condición
si !tieneDescuento {
    mostrar("Sin descuento previo")
}

// Combinaciones
si edad >= 18 && (esEstudiante || tieneDescuento) {
    mostrar("Adulto con beneficio")
}
```

---

## Coincidencia de Patrones (`cuando`)

Usa `cuando` para comparar un valor con patrones y hacer desestructuracion:

```crespi
variable salida = ""

cuando [1, 2] {
    caso [a, b] -> { salida = "$a-$b" }
    caso {"nombre": n} -> { salida = n }
    defecto -> { salida = "otro" }
}
```

`defecto` es obligatorio para asegurar coincidencia exhaustiva.

Las instancias de clase se pueden comparar por nombre y campos:

```crespi
tipo Persona(immutable nombre, immutable edad) {
}

variable persona = Persona("Ana", 30)

cuando persona {
    caso Persona { nombre: n, edad: e } -> { mostrar("$n-$e") }
    defecto -> { mostrar("no") }
}
```

---

## Bucle Mientras

### Sintaxis Básica

Repite mientras la condición sea verdadera:

```crespi
variable i = 0

mientras i < 5 {
    mostrar(i)
    i += 1
}
// Salida: 0, 1, 2, 3, 4
```

### Contador Descendente

```crespi
variable cuenta = 5

mientras cuenta > 0 {
    mostrar(cuenta)
    cuenta -= 1
}
mostrar("¡Despegue!")
// Salida: 5, 4, 3, 2, 1, ¡Despegue!
```

### Bucle Infinito con Salida

```crespi
variable intentos = 0

mientras verdadero {
    intentos += 1
    mostrar("Intento " + texto(intentos))

    si intentos >= 3 {
        salir  // Sale del bucle
    }
}
mostrar("Terminado")
```

### Validación de Entrada

```crespi
variable numero = 0

mientras numero <= 0 {
    mostrar("Ingresa un número positivo:")
    numero = entero(leer())
}

mostrar("Número válido: " + texto(numero))
```

---

## Bucle Repetir

### Iterar sobre Listas

```crespi
variable frutas = ["manzana", "naranja", "pera"]

repetir fruta en frutas {
    mostrar("Me gusta la " + fruta)
}
// Salida: Me gusta la manzana, Me gusta la naranja, Me gusta la pera
```

### Iterar sobre Texto

```crespi
variable palabra = "Hola"

repetir letra en palabra {
    mostrar(letra)
}
// Salida: H, o, l, a
```

### Iterar con Índice

Para obtener el índice, usa un contador:

```crespi
variable colores = ["rojo", "verde", "azul"]
variable i = 0

repetir color en colores {
    mostrar(texto(i) + ": " + color)
    i += 1
}
// Salida: 0: rojo, 1: verde, 2: azul
```

### Iterar sobre Diccionarios

```crespi
variable persona = {
    "nombre": "Ana",
    "edad": 25,
    "ciudad": "Madrid"
}

repetir clave en persona.claves() {
    mostrar(clave + ": " + texto(persona[clave]))
}
```

---

## Control de Bucles

### `salir` (Break)

Termina el bucle inmediatamente:

```crespi
variable numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

repetir n en numeros {
    si n == 5 {
        salir
    }
    mostrar(n)
}
// Salida: 1, 2, 3, 4
```

### `continuar` (Continue)

Salta a la siguiente iteración:

```crespi
variable numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

repetir n en numeros {
    si n % 2 == 0 {
        continuar  // Salta los números pares
    }
    mostrar(n)
}
// Salida: 1, 3, 5, 7, 9
```

### Ejemplo Combinado

```crespi
variable numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
variable suma = 0

repetir n en numeros {
    // Saltar múltiplos de 3
    si n % 3 == 0 {
        continuar
    }

    // Terminar si la suma supera 20
    si suma > 20 {
        salir
    }

    suma += n
    mostrar("Sumando " + texto(n) + ", total: " + texto(suma))
}
```

---

## Truthiness

En Crespi, ciertos valores se evalúan como `falso` en condiciones:

| Valor | Evaluación |
|-------|------------|
| `falso` | Falso |
| `0` | Falso |
| `0.0` | Falso |
| `""` (texto vacío) | Falso |
| `[]` (lista vacía) | Falso |
| `nada` | Falso |
| Todo lo demás | Verdadero |

```crespi
// Verificar si una lista tiene elementos
variable lista = [1, 2, 3]
si lista {
    mostrar("La lista tiene elementos")
}

// Verificar si un texto no está vacío
variable nombre = "Ana"
si nombre {
    mostrar("Hola, " + nombre)
}

// Verificar si un valor existe
variable resultado = nada
si !resultado {
    mostrar("No hay resultado")
}
```

---

## Patrones Comunes

### Buscar en Lista

```crespi
bloque buscar(lista, objetivo) {
    repetir item en lista {
        si item == objetivo {
            resultado item
        }
    }
    resultado nada
}

variable numeros = [10, 20, 30, 40]
variable encontrado = buscar(numeros, 30)

si encontrado != nada {
    mostrar("Encontrado: " + texto(encontrado))
} o {
    mostrar("No encontrado")
}
```

### Filtrar Lista

```crespi
bloque filtrar_pares(lista) {
    variable resultado_lista = []

    repetir n en lista {
        si n % 2 == 0 {
            resultado_lista.agregar(n)
        }
    }

    resultado resultado_lista
}

variable numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
mostrar(filtrar_pares(numeros))  // [2, 4, 6, 8, 10]
```

### Sumar Elementos

```crespi
bloque sumar(lista) {
    variable total = 0

    repetir n en lista {
        total += n
    }

    resultado total
}

mostrar(sumar([1, 2, 3, 4, 5]))  // 15
```

### Encontrar Máximo

```crespi
bloque maximo(lista) {
    si lista.longitud() == 0 {
        resultado nada
    }

    variable max = lista[0]

    repetir n en lista {
        si n > max {
            max = n
        }
    }

    resultado max
}

mostrar(maximo([3, 7, 2, 9, 1]))  // 9
```

### Tabla de Multiplicar

```crespi
variable n = 5
variable i = 1

mientras i <= 10 {
    mostrar(texto(n) + " x " + texto(i) + " = " + texto(n * i))
    i += 1
}
```

### Menú Interactivo

```crespi
variable opcion = ""

mientras opcion != "3" {
    mostrar("")
    mostrar("=== MENÚ ===")
    mostrar("1. Saludar")
    mostrar("2. Despedir")
    mostrar("3. Salir")
    mostrar("Elige una opción:")

    opcion = leer()

    si opcion == "1" {
        mostrar("¡Hola!")
    } o si opcion == "2" {
        mostrar("¡Adiós!")
    } o si opcion == "3" {
        mostrar("Saliendo...")
    } o {
        mostrar("Opción no válida")
    }
}
```

---

## Ver También

- [Variables y Constantes](variables.md)
- [Funciones](funciones.md)
- [Operadores](../referencia/operadores.md)
