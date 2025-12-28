# Palabras Clave

> **Idioma:** Español | [English](../../en/reference/keywords.md)

---

Crespi tiene palabras reservadas que no pueden usarse como identificadores. Las palabras clave en ingles son canonicas; los paquetes de idioma proveen alias localizados que se normalizan durante el escaneo.

## Tabla de Referencia

| Palabra Clave | Inglés | Categoría | Descripción |
|---------------|--------|-----------|-------------|
| `variable` | var | Declaración | Declara una variable mutable |
| `immutable` | let | Declaración | Declara una constante inmutable |
| `estatico` | static | Declaración | Declara un miembro estatico o un bloque de inicializacion estatico |
| `publico` | public | Declaración | Modificador de visibilidad publica |
| `privado` | private | Declaración | Modificador de visibilidad privada |
| `interno` | internal | Declaración | Modificador de visibilidad interna |
| `fileprivate` | fileprivate | Declaración | Modificador de visibilidad de archivo |
| `bloque` | fn | Funciones | Define una función |
| `externo` | extern | Funciones | Declara una función externa (FFI) |
| `resultado` | return | Funciones | Retorna un valor de una función |
| `si` | if | Control | Condicional |
| `asegura` | guard | Control | Guardia con retorno |
| `cuando` | when | Control | Coincidencia de patrones |
| `es` | is | Control | Caso de coincidencia |
| `defecto` | default | Control | Caso por defecto |
| `o` | else | Control | Alternativa en condicional |
| `mientras` | while | Control | Bucle mientras se cumpla condición |
| `repetir` | for | Control | Bucle para cada elemento |
| `en` | in | Control | Iterador (usado con `repetir`) |
| `salir` | break | Control | Sale del bucle actual |
| `continuar` | continue | Control | Salta a la siguiente iteración |
| `tipo` | class | OOP | Define un tipo con propiedades y métodos |
| `anidado` | nested | OOP | Define un tipo anidado (estático) |
| `interno` | inner | OOP | Define un tipo interno (captura instancia exterior) |
| `trait` | trait | OOP | Define un trait (interfaz con implementaciones opcionales por defecto) |
| `extiende` | extends | Reservada | (Reservada para uso futuro) |
| `yo` | this | OOP | Referencia a la instancia actual |
| `super` | super | OOP | Referencia al tipo padre |
| `operador` | operator | OOP | Sobrecarga de operadores |
| `extension` | extension | OOP | Extiende tipos existentes con metodos |
| `importar` | import | Modulos | Importa un modulo o simbolo |
| `verdadero` | true | Literales | Valor booleano verdadero |
| `falso` | false | Literales | Valor booleano falso |
| `nada` | null / nil | Literales | Valor nulo |
| `and` | and | Logico | AND logico |
| `or` | or | Logico | OR logico |
| `implementa` | implements | Reservada | (Reservada para uso futuro) |

---

## Declaraciones

### Modificadores de visibilidad

La visibilidad controla como se pueden importar los simbolos de nivel superior:

- `publico` (por defecto): accesible desde cualquier archivo
- `interno`: accesible solo desde archivos en el mismo directorio
- `fileprivate`: accesible solo desde el archivo actual (estilo Swift)
- `privado`: accesible solo dentro del mismo archivo (igual que fileprivate)

### `variable`

Declara una variable mutable que puede cambiar su valor.

```crespi
variable contador = 0
contador = contador + 1    // OK
variable nombre = "Ana"
nombre = "Luis"            // OK
```

### `immutable`

Declara una constante inmutable. Su valor no puede cambiar después de la asignación inicial.

```crespi
immutable PI = 3.14159
immutable MAX_INTENTOS = 3

// PI = 3.0    // Error: no se puede reasignar una constante
```

### `estatico`

Declara un metodo estatico, un campo estatico o un bloque de inicializacion estatico dentro de un tipo.

```crespi
tipo Config {
    estatico immutable version = "1.0"
    estatico { mostrar(Config.version) }
}
```

---

## Funciones

### `bloque`

Define una función. Puede tener parámetros y un cuerpo con múltiples sentencias.

```crespi
// Función básica
bloque saludar(nombre) {
    mostrar("Hola, " + nombre)
}

// Función con retorno
bloque cuadrado(x) {
    resultado x * x
}

// Sintaxis de expresión única
bloque doble(x) = x * 2

// Con parámetros por defecto
bloque potencia(base, exp = 2) {
    variable r = 1
    repetir i en [1, 2, 3] {
        r = r * base
    }
    resultado r
}
```

### `externo`

Declara una función externa (FFI) implementada en Rust/C. Puedes usar `#[link_name = "simbolo"]`
para enlazar con un nombre nativo distinto.

```crespi
// Enlazar con un simbolo nativo distinto
#[link_name = "mi_suma_impl"]
externo bloque mi_suma(a: Int, b: Int) -> Int
externo bloque mi_seno(x: Double) -> Double

bloque main() {
    mostrar(mi_suma(10, 32))
}
```

### `resultado`

Retorna un valor de una función y termina su ejecución.

```crespi
bloque maximo(a, b) {
    si a > b {
        resultado a
    }
    resultado b
}

bloque factorial(n) {
    si n <= 1 {
        resultado 1
    }
    resultado n * factorial(n - 1)
}
```

---

## Control de Flujo

### `si` / `o`

Estructura condicional para ejecutar código según una condición.

```crespi
variable edad = 18

// Condicional simple
si edad >= 18 {
    mostrar("Mayor de edad")
}

// Con alternativa
si edad >= 18 {
    mostrar("Mayor de edad")
} o {
    mostrar("Menor de edad")
}

// Múltiples condiciones
si edad >= 65 {
    mostrar("Jubilado")
} o si edad >= 18 {
    mostrar("Adulto")
} o si edad >= 13 {
    mostrar("Adolescente")
} o {
    mostrar("Niño")
}
```

### `mientras`

Bucle que se ejecuta mientras la condición sea verdadera.

```crespi
variable i = 0

mientras i < 5 {
    mostrar(i)
    i += 1
}
// Salida: 0, 1, 2, 3, 4
```

### `repetir` / `en`

Bucle para iterar sobre elementos de una colección.

```crespi
// Iterar sobre lista
variable numeros = [1, 2, 3, 4, 5]
repetir n en numeros {
    mostrar(n * 2)
}

// Iterar sobre texto
variable palabra = "Hola"
repetir letra en palabra {
    mostrar(letra)
}
```

### `salir`

Termina la ejecución del bucle actual inmediatamente.

```crespi
variable numeros = [1, 2, 3, 4, 5]

repetir n en numeros {
    si n == 3 {
        salir
    }
    mostrar(n)
}
// Salida: 1, 2
```

### `continuar`

Salta a la siguiente iteración del bucle.

```crespi
variable numeros = [1, 2, 3, 4, 5]

repetir n en numeros {
    si n == 3 {
        continuar
    }
    mostrar(n)
}
// Salida: 1, 2, 4, 5
```

---

## Programación Orientada a Objetos

### `tipo`

Define un tipo con propiedades y métodos.

```crespi
tipo Persona(immutable nombre, immutable edad) {
    bloque presentarse() {
        mostrar("Soy " + yo.nombre + ", tengo " + texto(yo.edad) + " años")
    }
}

variable p = Persona("Ana", 25)
p.presentarse()  // Soy Ana, tengo 25 años
```

### `extiende`

Indica que un tipo hereda de otro.

```crespi
tipo Animal(immutable nombre) {
    bloque hablar() {
        mostrar(yo.nombre + " hace un sonido")
    }
}

tipo Perro(immutable nombre, immutable raza) extiende Animal(nombre) {
    bloque hablar() {
        mostrar(yo.nombre + " ladra")
    }
}

variable fido = Perro("Fido", "Labrador")
fido.hablar()  // Fido ladra
```

### `yo`

Referencia a la instancia actual dentro de un método.

```crespi
tipo Contador {
    constructor() {
        yo.valor = 0
    }

    bloque incrementar() {
        yo.valor += 1
    }

    bloque obtener() {
        resultado yo.valor
    }
}
```

### `super`

Accede a métodos del tipo padre.

```crespi
tipo Vehiculo(immutable marca) {
}

tipo Coche(immutable marca, immutable modelo) extiende Vehiculo(marca) {  // Llama al constructor de Vehiculo
}
```

### `operador`

Define sobrecarga de operadores para tipos personalizados.

```crespi
tipo Vector(immutable x, immutable y) {
    operador +(otro) {
        resultado Vector(yo.x + otro.x, yo.y + otro.y)
    }

    operador ==(otro) {
        resultado yo.x == otro.x && yo.y == otro.y
    }
}

variable v1 = Vector(1, 2)
variable v2 = Vector(3, 4)
variable v3 = v1 + v2  // Vector(4, 6)
```

### `extension`

Agrega metodos a tipos existentes. Las extensiones usan nombres de tipo en tiempo de ejecucion; el ingles es canonico y el paquete de idioma puede definir alias como `Texto`, `Entero`, `Lista`.

```crespi
extension Texto {
    bloque gritar() = mayusculas(yo) + "!"
}
```

---

## Modulos

### `importar`

Importa un modulo y opcionalmente trae simbolos al alcance. Usa `{ ... }` para acceso directo sin el prefijo del modulo.

```crespi
importar Math.Vector
importar Helper { double, Point }
importar Helper como H { double }
importar bloque Utils.formato
importar tipo Math.Punto
```

---

## Literales

### `verdadero` / `falso`

Valores booleanos.

```crespi
variable activo = verdadero
variable terminado = falso

si activo && !terminado {
    mostrar("En progreso")
}
```

### `nada`

Representa la ausencia de valor.

```crespi
variable resultado = nada

bloque buscar(lista, valor) {
    repetir item en lista {
        si item == valor {
            resultado item
        }
    }
    resultado nada
}

variable encontrado = buscar([1, 2, 3], 5)
si encontrado == nada {
    mostrar("No encontrado")
}
```

---

## Ver También

- [Operadores](operadores.md)
- [Funciones Integradas](funciones.md)
- [Tipos de Datos](tipos.md)
