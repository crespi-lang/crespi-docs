# Variables y Constantes

> **Idioma:** Español | [English](../../en/guide/variables.md)

---

En Crespi, puedes almacenar valores usando variables mutables o constantes inmutables.

## Variables

Usa `variable` para declarar valores que pueden cambiar:

```crespi
variable nombre = "Ana"
variable edad = 25
variable activo = verdadero

mostrar(nombre)  // Ana
mostrar(edad)    // 25
```

### Reasignación

Las variables pueden cambiar su valor en cualquier momento:

```crespi
variable contador = 0
mostrar(contador)    // 0

contador = 1
mostrar(contador)    // 1

contador = contador + 1
mostrar(contador)    // 2
```

### Inferencia de Tipos

Cuando se ejecuta el checker estático opcional, Crespi usa inferencia de tipos para determinar el tipo de las variables a partir de sus valores iniciales:

```crespi
variable x = 42        // inferido como Int
variable y = "hola"    // inferido como String
variable z = [1, 2, 3] // inferido como List[Int]

// También puedes añadir anotaciones de tipo explícitas
variable contador: Int = 0
variable nombre: String = "Alicia"
```

Con el checker activo, el tipo inferido o anotado de una variable debe mantenerse consistente. Sin el checker, puedes reasignar cualquier tipo en tiempo de ejecución.

---

## Constantes

Usa `immutable` para valores que no deben cambiar:

```crespi
immutable PI = 3.14159
immutable MAX_INTENTOS = 3
immutable NOMBRE_APP = "Mi Aplicación"

mostrar(PI)  // 3.14159
```

Nota: `PI` y `E` son constantes integradas. En codigo compilado se traducen a los builtins `pi()` y `e()`.

### Inmutabilidad

Intentar reasignar una constante produce un error:

```crespi
immutable LIMITE = 100

// LIMITE = 200  // Error: No se puede reasignar una constante
```

`immutable` tambien congela colecciones. Las listas y diccionarios declarados con `immutable` no se pueden modificar (ni asignar por indice, ni `agregar`/`quitar`), y las tuplas siempre son inmutables:

```crespi
immutable ids = [1, 2, 3]
// ids[0] = 9      // Error: no se puede modificar una lista immutable
// ids.agregar(4) // Error: no se puede modificar una lista immutable

immutable perfil = { "nombre": "Ana" }
// perfil["nombre"] = "Bea"  // Error: no se puede modificar un diccionario immutable
```

### Cuándo Usar Constantes

Usa constantes para:
- Valores matemáticos (PI, E)
- Configuraciones fijas
- Valores que representan límites o umbrales
- Cualquier valor que no debería cambiar

```crespi
immutable GRAVEDAD = 9.81
immutable IVA = 0.21
immutable DIAS_SEMANA = 7

bloque calcular_peso(masa) {
    resultado masa * GRAVEDAD
}

bloque calcular_precio_con_iva(precio) {
    resultado precio * (1 + IVA)
}
```

---

## Operadores de Asignación

### Asignación Simple

```crespi
variable x = 10
```

### Asignación Compuesta

Crespi soporta operadores de asignación compuesta:

| Operador | Equivalente | Descripción |
|----------|-------------|-------------|
| `+=` | `x = x + valor` | Suma y asigna |
| `-=` | `x = x - valor` | Resta y asigna |
| `*=` | `x = x * valor` | Multiplica y asigna |
| `/=` | `x = x / valor` | Divide y asigna |

```crespi
variable puntos = 100

puntos += 50    // puntos = 150
mostrar(puntos) // 150

puntos -= 30    // puntos = 120
mostrar(puntos) // 120

puntos *= 2     // puntos = 240
mostrar(puntos) // 240

puntos /= 4     // puntos = 60
mostrar(puntos) // 60
```

### Uso en Bucles

Los operadores compuestos son útiles en bucles:

```crespi
variable suma = 0
variable numeros = [1, 2, 3, 4, 5]

repetir n en numeros {
    suma += n
}

mostrar(suma)  // 15
```

---

## Ámbito de Variables

Las variables tienen ámbito léxico. Una variable declarada dentro de un bloque solo existe en ese bloque:

```crespi
variable global = "soy global"

si verdadero {
    variable local = "soy local"
    mostrar(local)   // OK: soy local
    mostrar(global)  // OK: soy global
}

mostrar(global)  // OK: soy global
// mostrar(local)  // Error: variable no definida
```

### Sombreado (Shadowing)

Una variable interna puede "ocultar" una externa con el mismo nombre:

```crespi
variable x = 10

si verdadero {
    variable x = 20  // Nueva variable, oculta la externa
    mostrar(x)       // 20
}

mostrar(x)  // 10 (la original no cambió)
```

### Closures

Las funciones capturan variables de su entorno:

```crespi
variable factor = 2

bloque multiplicar(x) {
    resultado x * factor  // Usa 'factor' del ámbito externo
}

mostrar(multiplicar(5))  // 10

factor = 3
mostrar(multiplicar(5))  // 15 (usa el nuevo valor)
```

---

## Convenciones de nombres

- Usa `camelCase` tanto para variables como para constantes para mantener una convención uniforme.
- Elige nombres descriptivos que reflejen la finalidad del identificador.

```crespi
variable nombreUsuario = "ana123"
immutable intentosMaximos = 3
immutable tiempoConexion = 30
```

---

## Inicialización

### Con Valor Literal

```crespi
variable entero = 42
variable decimal = 3.14
variable texto = "Hola"
variable booleano = verdadero
variable lista = [1, 2, 3]
variable diccionario = {"clave": "valor"}
```

### Con Expresión

```crespi
variable suma = 10 + 20
variable largo = "Hola Mundo".longitud()
variable duplicado = [1, 2, 3][0] * 2
```

### Con Resultado de Función

```crespi
bloque calcular() {
    resultado 42
}

variable resultado = calcular()
mostrar(resultado)  // 42
```

### Con Valor Nulo

```crespi
variable pendiente = nada

// Más tarde...
pendiente = buscar_dato()
```

---

## Ejemplos Prácticos

### Contador

```crespi
variable contador = 0

bloque incrementar() {
    contador += 1
}

bloque obtener() {
    resultado contador
}

incrementar()
incrementar()
incrementar()
mostrar(obtener())  // 3
```

### Acumulador

```crespi
variable total = 0
variable precios = [10.50, 25.00, 8.75, 12.25]

repetir precio en precios {
    total += precio
}

mostrar("Total: " + texto(total))  // Total: 56.5
```

### Intercambio de Valores

```crespi
variable a = 10
variable b = 20

// Intercambiar usando variable temporal
variable temp = a
a = b
b = temp

mostrar(a)  // 20
mostrar(b)  // 10
```

### Configuración con Constantes

```crespi
immutable CONFIG_DEBUG = verdadero
immutable CONFIG_MAX_REINTENTOS = 3
immutable CONFIG_TIMEOUT = 5000

bloque hacer_peticion(url) {
    variable intentos = 0

    mientras intentos < CONFIG_MAX_REINTENTOS {
        si CONFIG_DEBUG {
            mostrar("Intento " + texto(intentos + 1))
        }
        // ... lógica de petición
        intentos += 1
    }
}
```

---

## Visibilidad

Las declaraciones de nivel superior (variables, constantes, funciones y tipos) pueden usar modificadores de visibilidad para controlar cómo se accede a ellas desde otros módulos:

- `publico` (por defecto): Accesible desde cualquier otro módulo.
- `interno`: Accesible solo desde módulos en el mismo directorio.
- `fileprivate`: Accesible solo desde dentro del mismo archivo.
- `privado`: Igual que `fileprivate` (por compatibilidad hacia atrás).

```crespi
publico variable nombreSitio = "Crespi"
interno variable cuentaLocal = 0
fileprivate bloque ayuda() { ... }
```

---

## Ver También

- [Control de Flujo](control-flujo.md)
- [Funciones](funciones.md)
- [Palabras Clave](../referencia/palabras-clave.md)
