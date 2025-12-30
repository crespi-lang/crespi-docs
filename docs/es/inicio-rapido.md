# Inicio Rápido

> **Idioma:** Español | [English](../en/quick-start.md)

---

Esta guía te ayudará a escribir tu primer programa en Crespi en pocos minutos.

## Hola Mundo

El programa más simple en Crespi:

```crespi
mostrar("Hola, Mundo!")
```

Guarda esto en un archivo `hola.crespi` y ejecútalo.

Crespi ofrece dos formas de ejecutar tu código:

- **[Intérprete](guia/interprete.md)** - Ejecuta directamente, soporta todas las características
- **[Compilador](guia/compilador.md)** - Compila a ejecutable nativo

**Salida:**
```
Hola, Mundo!
```

---

## Variables y Constantes

Usa `variable` para valores que pueden cambiar y `immutable` para valores fijos:

```crespi
variable nombre = "María"
immutable PI = 3.14159

mostrar(nombre)     // María
mostrar(PI)         // 3.14159

nombre = "Carlos"   // OK - variable puede cambiar
// PI = 3.0         // Error! - immutable no puede cambiar
```

---

## Tipos de Datos Básicos

```crespi
// Números
variable entero = 42
variable decimal = 3.14

// Texto
variable mensaje = "Hola"

// Booleanos
variable activo = verdadero
variable inactivo = falso

// Nulo
variable vacio = nada
```

---

## Operadores

Crespi soporta operadores simbólicos y textuales:

```crespi
// Aritméticos
variable suma = 5 + 3       // o: 5 mas 3
variable resta = 10 - 4     // o: 10 menos 4
variable producto = 6 * 7   // o: 6 por 7
variable cociente = 20 / 4  // o: 20 entre 4

// Comparación
variable mayor = 10 > 5     // o: 10 mayorQue 5
variable igual = 5 == 5     // o: 5 igualA 5

// Lógicos
variable ambos = verdadero && falso   // falso
variable alguno = verdadero || falso   // verdadero
```

---

## Condicionales

```crespi
variable edad = 18

si edad >= 18 {
    mostrar("Mayor de edad")
} o {
    mostrar("Menor de edad")
}
```

Con múltiples condiciones:

```crespi
variable nota = 85

si nota >= 90 {
    mostrar("Excelente")
} o si nota >= 70 {
    mostrar("Aprobado")
} o {
    mostrar("Reprobado")
}
```

---

## Bucles

### Mientras (while)

```crespi
variable contador = 0

mientras contador < 5 {
    mostrar(contador)
    contador += 1
}
// Salida: 0, 1, 2, 3, 4
```

### Repetir (for-each)

```crespi
variable numeros = [1, 2, 3, 4, 5]

repetir n en numeros {
    mostrar(n * 2)
}
// Salida: 2, 4, 6, 8, 10
```

---

## Funciones

### Sintaxis Básica

```crespi
bloque saludar(nombre) {
    mostrar("Hola, " + nombre + "!")
}

saludar("Ana")  // Hola, Ana!
```

### Con Valor de Retorno

```crespi
bloque cuadrado(x) {
    resultado x * x
}

variable r = cuadrado(5)
mostrar(r)  // 25
```

### Sintaxis Corta (expresión única)

```crespi
bloque doble(x) = x * 2
bloque suma(a, b) = a + b

mostrar(doble(7))     // 14
mostrar(suma(3, 4))   // 7
```

### Parámetros por Defecto

```crespi
bloque saludar(nombre = "Mundo") {
    mostrar("Hola, " + nombre)
}

saludar()         // Hola, Mundo
saludar("Ana")    // Hola, Ana
```

---

## Biblioteca Estándar (std)

Los builtins se agrupan en módulos virtuales `std.*`. Puedes importarlos o accederlos directamente.

```crespi
importar std.math { raiz, PI }
importar std.string como s

mostrar(s.recortar("  hola  "))
mostrar(std.math.raiz(81))
```

Los builtins globales siguen funcionando (`mostrar`, `raiz`).

Ver [Biblioteca Estándar](guia/biblioteca-estandar.md) para la lista de módulos y más ejemplos.

---

## Listas y Diccionarios

### Listas

```crespi
variable frutas = ["manzana", "naranja", "pera"]

mostrar(frutas[0])           // manzana
mostrar(frutas.longitud())    // 3

frutas.agregar("uva")
mostrar(frutas)              // [manzana, naranja, pera, uva]
```

### Diccionarios

```crespi
variable persona = {
    "nombre": "Luis",
    "edad": 30
}

mostrar(persona["nombre"])   // Luis
persona["ciudad"] = "Madrid"
mostrar(persona.claves())     // [nombre, edad, ciudad]
```

---

## Clases

```crespi
tipo Rectangulo(immutable ancho, immutable alto) {
    bloque area() {
        resultado yo.ancho * yo.alto
    }
}

variable rect = Rectangulo(5, 3)
mostrar(rect.area())  // 15
```

---

## Próximos Pasos

- [Referencia de Palabras Clave](referencia/palabras-clave.md)
- [Funciones Integradas](referencia/funciones.md)
- [Biblioteca Estándar](guia/biblioteca-estandar.md)
- [Ejemplos](https://github.com/crespi-lang/crespi-lang/tree/main/examples)
