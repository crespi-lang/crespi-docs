# std.string

> **Idioma:** Espanol | [English](../../../en/reference/std/string.md)

---

Metodos de manipulacion de texto. Todos los metodos se llaman sobre un receptor de texto usando notacion de punto.

## Importacion

```crespi
importar std.string { dividir, recortar, mayusculas }
```

O usar directamente sin importar (disponible globalmente).

---

## Referencia Rapida

| Metodo | Alias Ingles | Parametros | Retorna | Descripcion |
|--------|--------------|------------|---------|-------------|
| `s.dividir(delim)` | `split` | `delim: String` | `[String]` | Dividir por delimitador |
| `s.recortar()` | `trim` | - | `String` | Quitar espacios |
| `s.mayusculas()` | `uppercase` | - | `String` | Convertir a mayusculas |
| `s.minusculas()` | `lowercase` | - | `String` | Convertir a minusculas |
| `s.subcadena(inicio, fin?)` | `substring` | `inicio, fin?: Int` | `String` | Extraer subcadena |
| `s.reemplazar(viejo, nuevo)` | `replace` | `viejo, nuevo: String` | `String` | Reemplazar todo |
| `s.empieza_con(prefijo)` | `starts_with` | `prefijo: String` | `Bool` | Verificar prefijo |
| `s.termina_con(sufijo)` | `ends_with` | `sufijo: String` | `Bool` | Verificar sufijo |
| `s.indice_de(substr)` | `index_of` | `substr: String` | `Int` | Encontrar posicion |
| `lista.unir(sep)` | `join` | `sep: String` | `String` | Unir elementos de lista |

---

## Indexacion de Caracteres

Los indices de texto son **basados en caracteres**, no en bytes. Esto significa que `subcadena()` e `indice_de()` funcionan correctamente con caracteres Unicode.

```crespi
variable texto = "Hola, Mundo!"
mostrar(texto.longitud())          // 12 (caracteres)
mostrar(texto.subcadena(0, 4))     // Hola
```

---

## Metodos

### `s.dividir(delimitador)`

Divide un texto en una lista por un delimitador.

```crespi
variable csv = "manzana,banana,cereza"
variable frutas = csv.dividir(",")
mostrar(frutas)  // [manzana, banana, cereza]

variable palabras = "Hola Mundo".dividir(" ")
mostrar(palabras)  // [Hola, Mundo]

variable chars = "abc".dividir("")
mostrar(chars)  // [a, b, c]
```

---

### `s.recortar()`

Quita espacios en blanco de ambos extremos del texto.

```crespi
variable texto = "  Hola Mundo  "
mostrar(texto.recortar())  // "Hola Mundo"

variable tabs = "\t\n  datos  \n\t"
mostrar(tabs.recortar())  // "datos"
```

---

### `s.mayusculas()` / `s.minusculas()`

Convierte mayusculas/minusculas.

```crespi
variable texto = "Hola Mundo"
mostrar(texto.mayusculas())  // "HOLA MUNDO"
mostrar(texto.minusculas())  // "hola mundo"

// Util para comparacion sin distinguir mayusculas
funcion igual_ignorando_mayusculas(a: String, b: String) -> Bool {
    retornar a.minusculas() == b.minusculas()
}

mostrar(igual_ignorando_mayusculas("Hola", "HOLA"))  // true
```

---

### `s.subcadena(inicio, fin?)`

Extrae una subcadena desde `inicio` (inclusivo) hasta `fin` (exclusivo). Si `fin` se omite, extrae hasta el final del texto.

```crespi
variable texto = "Hola, Mundo!"

mostrar(texto.subcadena(0, 4))   // "Hola"
mostrar(texto.subcadena(6))      // "Mundo!"
mostrar(texto.subcadena(6, 11))  // "Mundo"

// Ultimos 3 caracteres
variable ultimos3 = texto.subcadena(texto.longitud() - 3)
mostrar(ultimos3)  // "do!"
```

---

### `s.reemplazar(viejo, nuevo)`

Reemplaza todas las ocurrencias de `viejo` con `nuevo`.

```crespi
variable texto = "Hola, Mundo!"
mostrar(texto.reemplazar("Mundo", "Crespi"))  // "Hola, Crespi!"

variable espacios = "a b c d"
mostrar(espacios.reemplazar(" ", "-"))  // "a-b-c-d"

// Eliminar caracteres
variable limpio = "a-b-c".reemplazar("-", "")
mostrar(limpio)  // "abc"
```

---

### `s.empieza_con(prefijo)` / `s.termina_con(sufijo)`

Verifica si un texto comienza/termina con una subcadena dada.

```crespi
variable archivo = "documento.pdf"

mostrar(archivo.empieza_con("doc"))   // true
mostrar(archivo.empieza_con("img"))   // false
mostrar(archivo.termina_con(".pdf"))  // true
mostrar(archivo.termina_con(".txt"))  // false

// Deteccion de tipo de archivo
funcion es_imagen(nombre: String) -> Bool {
    retornar nombre.termina_con(".png") o
             nombre.termina_con(".jpg") o
             nombre.termina_con(".gif")
}

mostrar(es_imagen("foto.jpg"))  // true
```

---

### `s.indice_de(subcadena)`

Encuentra la primera ocurrencia de una subcadena. Retorna el indice del caracter, o -1 si no se encuentra.

```crespi
variable texto = "Hola, Mundo!"

mostrar(texto.indice_de("Mundo"))  // 6
mostrar(texto.indice_de("o"))      // 1 (primera 'o')
mostrar(texto.indice_de("xyz"))    // -1 (no encontrado)

// Verificar si contiene
si texto.indice_de("Mundo") != -1 {
    mostrar("Encontrado!")
}

// Alternativa: usar contiene()
si texto.contiene("Mundo") {
    mostrar("Encontrado!")
}
```

---

### `lista.unir(separador)`

Une elementos de lista en un texto con un separador. Se llama sobre una lista, no un texto.

```crespi
variable palabras = ["Hola", "Mundo"]
mostrar(palabras.unir(" "))   // "Hola Mundo"
mostrar(palabras.unir(", "))  // "Hola, Mundo"
mostrar(palabras.unir(""))    // "HolaMundo"

variable numeros = [1, 2, 3]
mostrar(numeros.mapear(n => texto(n)).unir("-"))  // "1-2-3"
```

---

## Ejemplos Practicos

### Parsear Linea CSV

```crespi
funcion parsear_csv(linea: String) -> [String] {
    retornar linea.dividir(",").mapear(s => s.recortar())
}

variable datos = "  manzana , banana ,  cereza  "
variable items = parsear_csv(datos)
mostrar(items)  // [manzana, banana, cereza]
```

### Titulo Mayuscula

```crespi
funcion titulo_mayuscula(texto: String) -> String {
    variable palabras = texto.dividir(" ")
    variable tituladas = palabras.mapear(funcion(palabra) {
        si palabra.longitud() == 0 {
            retornar palabra
        }
        variable primera = palabra.subcadena(0, 1).mayusculas()
        variable resto = palabra.subcadena(1).minusculas()
        retornar primera + resto
    })
    retornar tituladas.unir(" ")
}

mostrar(titulo_mayuscula("hola mundo"))  // "Hola Mundo"
```

### Generador de Slug

```crespi
funcion slugify(texto: String) -> String {
    retornar texto
        .minusculas()
        .reemplazar(" ", "-")
        .reemplazar("'", "")
}

mostrar(slugify("Hola Mundo"))     // "hola-mundo"
mostrar(slugify("Es una Prueba"))  // "es-una-prueba"
```

---

## Ver Tambien

- [std.collections](collections.md) - Metodos de coleccion incluyendo `unir`
- [Tipos de Datos](../tipos.md) - Detalles del tipo String
- [Biblioteca Estandar](index.md) - Todos los modulos
