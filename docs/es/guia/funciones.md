# Funciones

> **Idioma:** Español | [English](../../en/guide/functions.md)

---

Las funciones en Crespi permiten encapsular y reutilizar código.

## Declaración Básica

Usa `bloque` para definir una función:

```crespi
bloque saludar() {
    mostrar("¡Hola!")
}

saludar()  // ¡Hola!
```

### Con Parámetros

```crespi
bloque saludar(nombre) {
    mostrar("¡Hola, " + nombre + "!")
}

saludar("Ana")    // ¡Hola, Ana!
saludar("Carlos") // ¡Hola, Carlos!
```

### Con Múltiples Parámetros

```crespi
bloque sumar(a, b) {
    mostrar(a + b)
}

sumar(3, 5)   // 8
sumar(10, 20) // 30
```

---

## Valor de Retorno

Usa `resultado` para devolver un valor:

```crespi
bloque cuadrado(x) {
    resultado x * x
}

variable r = cuadrado(5)
mostrar(r)  // 25
```

### Retorno Temprano

`resultado` termina la función inmediatamente:

```crespi
bloque valor_absoluto(n) {
    si n < 0 {
        resultado -n
    }
    resultado n
}

mostrar(valor_absoluto(-5))  // 5
mostrar(valor_absoluto(3))   // 3
```

### Sin Retorno Explícito

Si no hay `resultado`, la función retorna `nada`:

```crespi
bloque saludar(nombre) {
    mostrar("Hola, " + nombre)
}

variable r = saludar("Ana")
mostrar(r)  // nada
```

---

## Sintaxis de Expresión Única

Para funciones simples, usa la sintaxis corta:

```crespi
// Sintaxis estándar
bloque doble(x) {
    resultado x * 2
}

// Sintaxis corta (equivalente)
bloque doble(x) = x * 2
```

### Más Ejemplos

```crespi
// Una expresión
bloque cuadrado(x) = x * x
bloque triple(x) = x * 3

// Múltiples parámetros
bloque suma(a, b) = a + b
bloque promedio(a, b) = (a + b) / 2

// Sin parámetros
bloque pi() = 3.14159
bloque saludo() = "Hola mundo"

// Uso
mostrar(cuadrado(4))       // 16
mostrar(suma(10, 5))       // 15
mostrar(promedio(80, 90))  // 85
```

---

## Parámetros por Defecto

Puedes asignar valores por defecto a los parámetros:

```crespi
bloque saludar(nombre = "Mundo") {
    mostrar("Hola, " + nombre)
}

saludar()       // Hola, Mundo
saludar("Ana")  // Hola, Ana
```

### Múltiples Parámetros con Defecto

```crespi
bloque crear_mensaje(texto, repeticiones = 1, separador = " ") {
    variable mensaje = ""
    variable i = 0

    mientras i < repeticiones {
        si i > 0 {
            mensaje = mensaje + separador
        }
        mensaje = mensaje + texto
        i += 1
    }

    resultado mensaje
}

mostrar(crear_mensaje("Hola"))           // Hola
mostrar(crear_mensaje("Hola", 3))        // Hola Hola Hola
mostrar(crear_mensaje("Hola", 3, "-"))   // Hola-Hola-Hola
```

### Con Sintaxis Corta

```crespi
bloque potencia(base, exp = 2) = base * base  // Solo funciona para exp=2

// Para situaciones más complejas, usa la sintaxis estándar
bloque potencia_real(base, exp = 2) {
    variable r = 1
    variable i = 0
    mientras i < exp {
        r = r * base
        i += 1
    }
    resultado r
}
```

---

## Funciones como Valores

Las funciones son valores de primera clase:

### Asignar a Variables

```crespi
bloque duplicar(x) {
    resultado x * 2
}

variable operacion = duplicar
mostrar(operacion(5))  // 10
```

### Pasar como Argumento

```crespi
bloque aplicar(funcion, valor) {
    resultado funcion(valor)
}

bloque cuadrado(x) = x * x
bloque cubo(x) = x * x * x

mostrar(aplicar(cuadrado, 4))  // 16
mostrar(aplicar(cubo, 3))      // 27
```

### Retornar Funciones

```crespi
bloque crear_multiplicador(factor) {
    bloque multiplicar(x) {
        resultado x * factor
    }
    resultado multiplicar
}

variable doble = crear_multiplicador(2)
variable triple = crear_multiplicador(3)

mostrar(doble(5))   // 10
mostrar(triple(5))  // 15
```

---

## Closures

Las funciones capturan variables de su entorno:

```crespi
bloque crear_contador() {
    variable cuenta = 0

    bloque incrementar() {
        cuenta += 1
        resultado cuenta
    }

    resultado incrementar
}

variable contador = crear_contador()
mostrar(contador())  // 1
mostrar(contador())  // 2
mostrar(contador())  // 3
```

### Múltiples Closures

```crespi
bloque crear_contador_con_paso(paso) {
    variable cuenta = 0

    bloque siguiente() {
        cuenta += paso
        resultado cuenta
    }

    resultado siguiente
}

variable de_uno = crear_contador_con_paso(1)
variable de_cinco = crear_contador_con_paso(5)

mostrar(de_uno())    // 1
mostrar(de_uno())    // 2
mostrar(de_cinco())  // 5
mostrar(de_cinco())  // 10
```

---

## Recursión

Las funciones pueden llamarse a sí mismas:

### Factorial

```crespi
bloque factorial(n) {
    si n <= 1 {
        resultado 1
    }
    resultado n * factorial(n - 1)
}

mostrar(factorial(5))  // 120 (5 * 4 * 3 * 2 * 1)
```

### Fibonacci

```crespi
bloque fibonacci(n) {
    si n <= 1 {
        resultado n
    }
    resultado fibonacci(n - 1) + fibonacci(n - 2)
}

mostrar(fibonacci(10))  // 55
```

### Recursión de Cola

Para recursión profunda, usa acumuladores:

```crespi
bloque factorial_cola(n, acum = 1) {
    si n <= 1 {
        resultado acum
    }
    resultado factorial_cola(n - 1, n * acum)
}

mostrar(factorial_cola(5))  // 120
```

---

## Inlining (Inyección de Código)

Sugiere al compilador nativo que el cuerpo de una función debe inyectarse directamente en los lugares de llamada usando el decorador `@inline`. Esto puede mejorar el rendimiento para funciones pequeñas y llamadas frecuentes al evitar la sobrecarga de la llamada a función.

```crespi
@inline
bloque sumar(a: Int, b: Int) -> Int = a + b

// Esta llamada se reemplaza por la instrucción de suma real en el binario
variable suma = sumar(5, 10)
```

---

## Funciones Anidadas

Define funciones dentro de otras funciones:

```crespi
bloque calcular_impuestos(precio) {
    immutable TASA = 0.16

    bloque aplicar_tasa(monto) {
        resultado monto * TASA
    }

    variable impuesto = aplicar_tasa(precio)
    resultado precio + impuesto
}

mostrar(calcular_impuestos(100))  // 116
```

---

## Patrones Comunes

### Map (Transformar Lista)

```crespi
bloque map(lista, transformar) {
    variable resultado_lista = []

    repetir item en lista {
        resultado_lista.agregar(transformar(item))
    }

    resultado resultado_lista
}

bloque doble(x) = x * 2

variable numeros = [1, 2, 3, 4, 5]
mostrar(map(numeros, doble))  // [2, 4, 6, 8, 10]
```

### Filter (Filtrar Lista)

```crespi
bloque filter(lista, predicado) {
    variable resultado_lista = []

    repetir item en lista {
        si predicado(item) {
            resultado_lista.agregar(item)
        }
    }

    resultado resultado_lista
}

bloque es_par(n) = n % 2 == 0

variable numeros = [1, 2, 3, 4, 5, 6]
mostrar(filter(numeros, es_par))  // [2, 4, 6]
```

### Reduce (Acumular)

```crespi
bloque reduce(lista, acumulador, inicial) {
    variable resultado_val = inicial

    repetir item en lista {
        resultado_val = acumulador(resultado_val, item)
    }

    resultado resultado_val
}

bloque sumar(a, b) = a + b

variable numeros = [1, 2, 3, 4, 5]
mostrar(reduce(numeros, sumar, 0))  // 15
```

### Composición

```crespi
bloque componer(f, g) {
    bloque compuesta(x) {
        resultado f(g(x))
    }
    resultado compuesta
}

bloque doble(x) = x * 2
bloque incrementar(x) = x + 1

variable doble_mas_uno = componer(incrementar, doble)
mostrar(doble_mas_uno(5))  // 11 (doble(5) = 10, luego +1 = 11)
```

---

## Ver También

- [Variables y Constantes](variables.md)
- [Características Avanzadas](avanzado.md) - Memorización y TCO
- [Clases y Objetos](clases.md)
