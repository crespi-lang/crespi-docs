# Listas y Diccionarios

> **Idioma:** Español | [English](../../en/guide/collections.md)

---

Crespi proporciona tres tipos de colecciones: listas (arreglos), tuplas y diccionarios (mapas).

## Listas

Las listas son colecciones ordenadas que pueden contener elementos de cualquier tipo.

### Crear Listas

```crespi
// Lista vacía
variable vacia = []

// Lista con elementos
variable numeros = [1, 2, 3, 4, 5]
variable nombres = ["Ana", "Luis", "María"]

// Lista mixta
variable mixta = [1, "dos", verdadero, nada, [1, 2]]
```

### Acceso a Elementos

Los índices comienzan en 0:

```crespi
variable frutas = ["manzana", "naranja", "pera", "uva"]

mostrar(frutas[0])   // manzana (primero)
mostrar(frutas[1])   // naranja
mostrar(frutas[3])   // uva (último)
```

### Índices Negativos

Usa índices negativos para acceder desde el final:

```crespi
variable frutas = ["manzana", "naranja", "pera", "uva"]

mostrar(frutas[-1])  // uva (último)
mostrar(frutas[-2])  // pera (penúltimo)
mostrar(frutas[-4])  // manzana (primero)
```

### Modificar Elementos

```crespi
variable numeros = [10, 20, 30]

numeros[0] = 100
numeros[2] = 300

mostrar(numeros)  // [100, 20, 300]
```

### Longitud

```crespi
variable lista = [1, 2, 3, 4, 5]
mostrar(lista.longitud())  // 5

variable vacia = []
mostrar(vacia.longitud())  // 0
```

---

## Tuplas

Las tuplas son colecciones ordenadas de tamaño fijo. Usan paréntesis con comas y una tupla
de un solo elemento requiere coma final.

```crespi
variable punto = (3, 4)
variable unico = (1,)

mostrar(punto[0])        // 3
mostrar(punto[-1])       // 4
mostrar(punto.longitud()) // 2
```

Las tuplas son inmutables, así que no se permite asignar elementos.

---

## Operaciones con Listas

La mutacion de listas requiere una variable `variable`. Las listas declaradas con `immutable` son inmutables.

### Agregar Elementos

`lista.agregar(valor)` añade al final:

```crespi
variable numeros = [1, 2, 3]

numeros.agregar(4)
numeros.agregar(5)

mostrar(numeros)  // [1, 2, 3, 4, 5]
```

### Quitar Elementos

`lista.quitar()` elimina y retorna el último:

```crespi
variable numeros = [1, 2, 3, 4, 5]

variable ultimo = numeros.quitar()
mostrar(ultimo)   // 5
mostrar(numeros)  // [1, 2, 3, 4]
```

### Verificar Contenido

`lista.contiene(valor)` verifica si existe:

```crespi
variable frutas = ["manzana", "naranja", "pera"]

mostrar(frutas.contiene("naranja"))  // verdadero
mostrar(frutas.contiene("uva"))      // falso
```

---

## Iterar sobre Listas

### Bucle Repetir

```crespi
variable colores = ["rojo", "verde", "azul"]

repetir color en colores {
    mostrar("Color: " + color)
}
// Color: rojo
// Color: verde
// Color: azul
```

### Con Índice

```crespi
variable elementos = ["a", "b", "c"]
variable i = 0

repetir elem en elementos {
    mostrar(texto(i) + ": " + elem)
    i += 1
}
// 0: a
// 1: b
// 2: c
```

### Bucle Mientras

```crespi
variable numeros = [10, 20, 30, 40, 50]
variable i = 0

mientras i < numeros.longitud() {
    mostrar(numeros[i])
    i += 1
}
```

---

## Diccionarios

Los diccionarios almacenan pares clave-valor. Las claves son siempre texto.

### Crear Diccionarios

```crespi
// Diccionario vacío
variable vacio = {}

// Diccionario con datos
variable persona = {
    "nombre": "Ana",
    "edad": 25,
    "ciudad": "Madrid"
}

// Valores de cualquier tipo
variable config = {
    "debug": verdadero,
    "max_items": 100,
    "usuarios": ["admin", "user"]
}
```

### Acceso a Valores

```crespi
variable persona = {
    "nombre": "Ana",
    "edad": 25
}

mostrar(persona["nombre"])  // Ana
mostrar(persona["edad"])    // 25
```

### Modificar Valores

La mutacion de diccionarios requiere una variable `variable`. Los diccionarios declarados con `immutable` son inmutables.

```crespi
variable persona = {
    "nombre": "Ana",
    "edad": 25
}

// Modificar existente
persona["edad"] = 26

// Añadir nuevo
persona["ciudad"] = "Barcelona"

mostrar(persona)
// {nombre: Ana, edad: 26, ciudad: Barcelona}
```

### Longitud

```crespi
variable datos = {"a": 1, "b": 2, "c": 3}
mostrar(datos.longitud())  // 3
```

---

## Operaciones con Diccionarios

### Obtener Claves

```crespi
variable persona = {
    "nombre": "Ana",
    "edad": 25,
    "ciudad": "Madrid"
}

variable k = persona.claves()
mostrar(k)  // [nombre, edad, ciudad]
```

### Obtener Valores

```crespi
variable notas = {
    "matematicas": 90,
    "fisica": 85,
    "quimica": 78
}

variable v = notas.valores()
mostrar(v)  // [90, 85, 78]
```

### Verificar Clave

`diccionario.contiene(clave)` verifica si existe la clave:

```crespi
variable config = {
    "debug": verdadero,
    "timeout": 5000
}

mostrar(config.contiene("debug"))    // verdadero
mostrar(config.contiene("verbose"))  // falso
```

---

## Iterar sobre Diccionarios

### Por Claves

```crespi
variable persona = {
    "nombre": "Ana",
    "edad": 25,
    "ciudad": "Madrid"
}

repetir clave en persona.claves() {
    mostrar(clave + ": " + texto(persona[clave]))
}
// nombre: Ana
// edad: 25
// ciudad: Madrid
```

### Por Valores

```crespi
variable precios = {
    "manzana": 1.50,
    "naranja": 2.00,
    "pera": 1.75
}

variable total = 0
repetir precio en precios.valores() {
    total += precio
}
mostrar("Total: " + texto(total))  // Total: 5.25
```

---

## Listas Anidadas

```crespi
// Matriz 3x3
variable matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

// Acceso
mostrar(matriz[0][0])  // 1
mostrar(matriz[1][1])  // 5
mostrar(matriz[2][2])  // 9

// Iterar
repetir fila en matriz {
    repetir celda en fila {
        mostrar(celda)
    }
}
```

---

## Diccionarios Anidados

```crespi
variable empresa = {
    "nombre": "TechCorp",
    "empleados": {
        "gerente": {
            "nombre": "Ana",
            "salario": 50000
        },
        "desarrollador": {
            "nombre": "Luis",
            "salario": 35000
        }
    }
}

// Acceso anidado
mostrar(empresa["empleados"]["gerente"]["nombre"])  // Ana
```

---

## Patrones Comunes

### Buscar en Lista

```crespi
bloque buscar_indice(lista, objetivo) {
    variable i = 0

    repetir item en lista {
        si item == objetivo {
            resultado i
        }
        i += 1
    }

    resultado -1  // No encontrado
}

variable frutas = ["manzana", "naranja", "pera"]
mostrar(buscar_indice(frutas, "naranja"))  // 1
mostrar(buscar_indice(frutas, "uva"))      // -1
```

### Filtrar Lista

```crespi
bloque filtrar(lista, condicion) {
    variable resultado_lista = []

    repetir item en lista {
        si condicion(item) {
            resultado_lista.agregar(item)
        }
    }

    resultado resultado_lista
}

bloque es_positivo(n) = n > 0

variable numeros = [-2, -1, 0, 1, 2, 3]
mostrar(filtrar(numeros, es_positivo))  // [1, 2, 3]
```

### Transformar Lista

```crespi
bloque transformar(lista, funcion) {
    variable resultado_lista = []

    repetir item en lista {
        resultado_lista.agregar(funcion(item))
    }

    resultado resultado_lista
}

bloque cuadrado(n) = n * n

variable numeros = [1, 2, 3, 4, 5]
mostrar(transformar(numeros, cuadrado))  // [1, 4, 9, 16, 25]
```

### Contar Frecuencias

```crespi
bloque contar_frecuencias(lista) {
    variable frecuencias = {}

    repetir item en lista {
        variable clave = texto(item)
        si frecuencias.contiene(clave) {
            frecuencias[clave] += 1
        } o {
            frecuencias[clave] = 1
        }
    }

    resultado frecuencias
}

variable votos = ["A", "B", "A", "C", "B", "A"]
mostrar(contar_frecuencias(votos))
// {A: 3, B: 2, C: 1}
```

### Agrupar por Propiedad

```crespi
bloque agrupar_por_edad(personas) {
    variable grupos = {}

    repetir persona en personas {
        variable edad = texto(persona["edad"])

        si !grupos.contiene(edad) {
            grupos[edad] = []
        }

        grupos[edad].agregar(persona["nombre"])
    }

    resultado grupos
}

variable personas = [
    {"nombre": "Ana", "edad": 25},
    {"nombre": "Luis", "edad": 30},
    {"nombre": "María", "edad": 25}
]

mostrar(agrupar_por_edad(personas))
// {25: [Ana, María], 30: [Luis]}
```

### Pila (Stack)

```crespi
variable pila = []

// Push
pila.agregar("primero")
pila.agregar("segundo")
pila.agregar("tercero")

// Pop
mostrar(pila.quitar())  // tercero
mostrar(pila.quitar())  // segundo
mostrar(pila.quitar())  // primero
```

### Cola (Queue) Simulada

```crespi
variable cola = []

// Enqueue (añadir al final)
cola.agregar("primero")
cola.agregar("segundo")
cola.agregar("tercero")

// Dequeue (quitar del inicio - simulado)
bloque dequeue(cola) {
    si cola.longitud() == 0 {
        resultado nada
    }

    variable primero = cola[0]
    variable nueva_cola = []
    variable i = 1

    mientras i < cola.longitud() {
        nueva_cola.agregar(cola[i])
        i += 1
    }

    // Limpiar y copiar
    mientras cola.longitud() > 0 {
        cola.quitar()
    }
    repetir item en nueva_cola {
        cola.agregar(item)
    }

    resultado primero
}

mostrar(dequeue(cola))  // primero
mostrar(cola)           // [segundo, tercero]
```

---

## Ver También

- [Tipos de Datos](../referencia/tipos.md)
- [Funciones Integradas](../referencia/funciones.md)
- [Control de Flujo](control-flujo.md)
