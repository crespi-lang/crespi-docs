# Clases y Objetos

> **Idioma:** Español | [English](../../en/guide/classes.md)

---

Crespi soporta programación orientada a objetos con clases, herencia y métodos.

## Definir una Clase

Usa `tipo` para definir una clase:

```crespi
tipo Persona(variable nombre, variable edad) {
    bloque presentarse() {
        mostrar("Soy " + yo.nombre + ", tengo " + texto(yo.edad) + " años")
    }
}
```

### Crear Instancias

Crea objetos llamando a la clase directamente:

```crespi
variable ana = Persona("Ana", 25)
variable luis = Persona("Luis", 30)

ana.presentarse()   // Soy Ana, tengo 25 años
luis.presentarse()  // Soy Luis, tengo 30 años
```

---

## El Constructor: `constructor`

El método `constructor` se llama automáticamente al crear una instancia:

```crespi
tipo Rectangulo {
    constructor(ancho, alto) {
        yo.ancho = ancho
        yo.alto = alto
        mostrar("Rectangulo creado: " + texto(ancho) + "x" + texto(alto))
    }
}

variable rect = Rectangulo(10, 5)
// Salida: Rectangulo creado: 10x5
```

Puedes declarar el constructor principal en el encabezado de la clase (estilo Kotlin). Usa `variable` o `immutable` para hacer que los parámetros sean propiedades de instancia:

- `variable`: Crea una propiedad **mutable** que puede modificarse después de la construcción
- `immutable`: Crea una propiedad **inmutable** que no puede cambiarse después de la construcción
- Sin modificador: El parámetro solo se usa para construcción, no se almacena como propiedad

```crespi
tipo Punto(immutable x, immutable y) {
}

variable p = Punto(3, 4)
mostrar(p.x)  // 3
mostrar(p.y)  // 4
// p.x = 10  // Error: no se puede modificar una propiedad inmutable
```

Usa `variable` cuando necesites propiedades mutables:

```crespi
tipo Contador(variable valor) {
}

variable c = Contador(0)
c.valor = 10  // OK: las propiedades variable son mutables
```

También puedes definir constructores adicionales que delegan al principal:

```crespi
tipo Punto(immutable x, immutable y) {
    constructor(tupla) : yo(tupla[0], tupla[1])
}
```

### Constructor sin Parámetros

```crespi
tipo Contador(variable valor = 0) {
    bloque incrementar() {
        yo.valor += 1
    }

    bloque obtener() {
        resultado yo.valor
    }
}

variable c = Contador()
c.incrementar()
c.incrementar()
mostrar(c.obtener())  // 2
```

---

## La Referencia `yo`

`yo` (equivalente a `this`) referencia a la instancia actual:

```crespi
tipo Circulo(variable radio) {
    bloque area() {
        resultado 3.14159 * yo.radio * yo.radio
    }

    bloque perimetro() {
        resultado 2 * 3.14159 * yo.radio
    }

    bloque escalar(factor) {
        yo.radio = yo.radio * factor
    }
}

variable circulo = Circulo(5)
mostrar(circulo.area())       // 78.53975
mostrar(circulo.perimetro())  // 31.4159

circulo.escalar(2)
mostrar(circulo.radio)        // 10
```

---

## Miembros y Bloques Estaticos

Usa `estatico` para definir campos, metodos y bloques de inicializacion a nivel de tipo. Los
miembros estaticos se acceden desde el tipo, no desde las instancias.

```crespi
tipo Config {
    estatico immutable version = "1.0"
    estatico variable contador = 0

    estatico bloque incrementar() {
        Config.contador = Config.contador + 1
    }

    estatico {
        Config.incrementar()
    }
}

mostrar(Config.version)  // "1.0"
mostrar(Config.contador) // 1
```

---

## Tipos Anidados e Internos

Usa `anidado tipo` para tipos estáticos y `interno tipo` cuando necesitas acceso a la instancia
exterior. Las instancias internas guardan la instancia exterior en `yo.__outer`.

```crespi
tipo Exterior(variable valor) {
    anidado tipo Etiqueta {
        bloque nombre() {
            resultado "estatica"
        }
    }

    interno tipo ValorInterno {
        bloque valorExterior() {
            resultado yo.__outer.valor
        }
    }

    bloque crearInterna() {
        resultado yo.ValorInterno()
    }
}

variable e = Exterior(10)
variable i = e.crearInterna()
mostrar(i.valorExterior())  // 10
```

También puedes construir un tipo interno pasando la instancia exterior primero:

```crespi
variable e = Exterior(10)
variable i = Exterior.ValorInterno(e)
```

Fuera del tipo, usa la forma con instancia exterior para que el compilador pueda resolver el
tipo sin ambigüedad.

Cuando ya tienes una instancia, también puedes llamar `e.ValorInterno()` (solo tipos internos).

---

## Propiedades

### Acceso a Propiedades

```crespi
tipo Punto(immutable x, immutable y) {
}

variable p = Punto(3, 4)
mostrar(p.x)  // 3
mostrar(p.y)  // 4
```

### Modificar Propiedades

Usa `variable` para propiedades mutables:

```crespi
tipo Punto(variable x, variable y) {
}

variable p = Punto(0, 0)
p.x = 10
p.y = 20
mostrar(p.x)  // 10
mostrar(p.y)  // 20
```

### Propiedades Dinámicas

Puedes añadir propiedades después de la creación:

```crespi
tipo Objeto(variable nombre = "objeto") {
}

variable obj = Objeto()
obj.color = "rojo"      // Nueva propiedad
obj.tamaño = "grande"   // Otra propiedad

mostrar(obj.color)   // rojo
mostrar(obj.tamaño)  // grande
```

---

## Métodos

### Métodos con Retorno

```crespi
tipo Calculadora(variable memoria = 0) {
    bloque sumar(a, b) {
        resultado a + b
    }

    bloque guardar(valor) {
        yo.memoria = valor
    }

    bloque recuperar() {
        resultado yo.memoria
    }
}

variable calc = Calculadora()
mostrar(calc.sumar(5, 3))  // 8

calc.guardar(100)
mostrar(calc.recuperar())  // 100
```

### Métodos que Modifican Estado

```crespi
tipo CuentaBancaria(variable saldo) {
    bloque depositar(cantidad) {
        yo.saldo += cantidad
    }

    bloque retirar(cantidad) {
        si cantidad > yo.saldo {
            mostrar("Saldo insuficiente")
            resultado falso
        }
        yo.saldo -= cantidad
        resultado verdadero
    }

    bloque consultar() {
        resultado yo.saldo
    }
}

variable cuenta = CuentaBancaria(1000)
cuenta.depositar(500)
mostrar(cuenta.consultar())  // 1500

cuenta.retirar(200)
mostrar(cuenta.consultar())  // 1300
```

---

## Herencia

Usa `:` para heredar de otra clase:

```crespi
tipo Animal(variable nombre) {
    bloque hablar() {
        mostrar(yo.nombre + " hace un sonido")
    }
}

tipo Perro(let nombre, var raza) : Animal(nombre) {  // Llama al constructor padre
    bloque hablar() {
        mostrar(yo.nombre + " ladra")
    }
}

tipo Gato(let nombre) : Animal(nombre) {
    bloque hablar() {
        mostrar(yo.nombre + " maúlla")
    }
}

variable fido = Perro("Fido", "Labrador")
variable michi = Gato("Michi")

fido.hablar()   // Fido ladra
michi.hablar()  // Michi maúlla
```

---

## La Palabra Clave `super`

`super` permite acceder a métodos de la clase padre:

### En el Constructor

```crespi
tipo Vehiculo(let marca, let modelo) {
    bloque describir() {
        resultado yo.marca + " " + yo.modelo
    }
}

tipo Coche(let marca, let modelo, let puertas) : Vehiculo(marca, modelo) {  // Inicializa marca y modelo
    bloque describir() {
        variable base = super.describir()  // Llama al método padre
        resultado base + " (" + texto(yo.puertas) + " puertas)"
    }
}

variable coche = Coche("Toyota", "Corolla", 4)
mostrar(coche.describir())  // Toyota Corolla (4 puertas)
```

### En Métodos

```crespi
tipo Empleado(let nombre, let salario) {
    bloque calcular_bono() {
        resultado yo.salario * 0.10
    }
}

tipo Gerente(let nombre, let salario, let departamento) : Empleado(nombre, salario) {
    bloque calcular_bono() {
        variable bono_base = super.calcular_bono()  // 10%
        resultado bono_base * 2  // Gerentes: 20%
    }
}

variable emp = Empleado("Ana", 30000)
variable ger = Gerente("Carlos", 50000, "Ventas")

mostrar(emp.calcular_bono())  // 3000
mostrar(ger.calcular_bono())  // 10000
```

---

## Polimorfismo

Objetos de diferentes clases pueden tratarse uniformemente:

```crespi
tipo Forma {
    bloque area() {
        resultado 0
    }
}

tipo Cuadrado(let lado) : Forma {
    bloque area() {
        resultado yo.lado * yo.lado
    }
}

tipo Circulo(let radio) : Forma {
    bloque area() {
        resultado 3.14159 * yo.radio * yo.radio
    }
}

tipo Triangulo(let base, let altura) : Forma {
    bloque area() {
        resultado (yo.base * yo.altura) / 2
    }
}

// Función que trabaja con cualquier forma
bloque area_total(formas) {
    variable total = 0

    repetir forma en formas {
        total += forma.area()
    }

    resultado total
}

variable formas = [
    Cuadrado(5),
    Circulo(3),
    Triangulo(4, 6)
]

mostrar(area_total(formas))  // 81.27431
```

---

## Métodos con Sintaxis Corta

Puedes usar la sintaxis de expresión única en métodos:

```crespi
tipo Matematicas {
    bloque cuadrado(x) = x * x
    bloque cubo(x) = x * x * x
    bloque doble(x) = x * 2
    bloque promedio(a, b) = (a + b) / 2
}

variable m = Matematicas()
mostrar(m.cuadrado(4))      // 16
mostrar(m.cubo(3))          // 27
mostrar(m.promedio(10, 20)) // 15
```

---

## Patrones Comunes

### Builder

```crespi
tipo PersonaBuilder(nombre = "", edad = 0, ciudad = "") {
    bloque con_nombre(nombre) {
        yo.nombre = nombre
        resultado yo
    }

    bloque con_edad(edad) {
        yo.edad = edad
        resultado yo
    }

    bloque con_ciudad(ciudad) {
        yo.ciudad = ciudad
        resultado yo
    }

    bloque construir() {
        resultado {
            "nombre": yo.nombre,
            "edad": yo.edad,
            "ciudad": yo.ciudad
        }
    }
}

variable persona = PersonaBuilder()
    .con_nombre("Ana")
    .con_edad(25)
    .con_ciudad("Madrid")
    .construir()

mostrar(persona)
```

### Singleton (Simulado)

```crespi
variable _instancia_config = nada

tipo Configuracion(debug = falso, timeout = 5000) {
}

bloque obtener_config() {
    si _instancia_config == nada {
        _instancia_config = Configuracion()
    }
    resultado _instancia_config
}

variable config1 = obtener_config()
variable config2 = obtener_config()
// config1 y config2 son la misma instancia
```

### Composición

```crespi
tipo Motor(let potencia, var encendido = falso) {
    bloque arrancar() {
        yo.encendido = verdadero
        mostrar("Motor arrancado")
    }

    bloque apagar() {
        yo.encendido = falso
        mostrar("Motor apagado")
    }
}

tipo Coche {
    constructor(marca, potencia_motor) {
        yo.marca = marca
        yo.motor = Motor(potencia_motor)  // Composición
    }

    bloque arrancar() {
        mostrar("Arrancando " + yo.marca)
        yo.motor.arrancar()
    }

    bloque apagar() {
        yo.motor.apagar()
        mostrar(yo.marca + " apagado")
    }
}

variable coche = Coche("Toyota", 150)
coche.arrancar()
// Arrancando Toyota
// Motor arrancado
```

---

## Traits

Los traits definen comportamiento compartido que las clases pueden implementar. Son similares a interfaces pero pueden tener implementaciones por defecto.

### Definir un Trait

```crespi
trait Describible {
    bloque describir() -> String
}
```

### Implementar un Trait

Usa `:` para implementar traits (misma sintaxis que herencia):

```crespi
tipo Persona(let nombre, let edad) : Describible {
    bloque describir() -> String {
        resultado "Persona: " + yo.nombre + ", " + texto(yo.edad) + " años"
    }
}

variable p = Persona("Ana", 25)
mostrar(p.describir())  // Persona: Ana, 25 años
```

### Implementaciones por Defecto

Los traits pueden proporcionar implementaciones por defecto:

```crespi
trait Saludable {
    bloque saludar() {
        mostrar("Hola, soy " + yo.nombre)
    }
}

tipo Estudiante(let nombre) : Saludable {
    // Usa la implementación por defecto de saludar()
}

variable e = Estudiante("Luis")
e.saludar()  // Hola, soy Luis
```

### Herencia de Traits

Los traits pueden extender otros traits:

```crespi
trait Caminable {
    bloque caminar()
}

trait Corredor : Caminable {
    bloque correr()
}

// Las clases que implementan Corredor deben implementar tanto caminar() como correr()
tipo Atleta(let nombre) : Corredor {
    bloque caminar() {
        mostrar(yo.nombre + " está caminando")
    }
    
    bloque correr() {
        mostrar(yo.nombre + " está corriendo")
    }
}
```

### Múltiples Traits

Las clases pueden implementar múltiples traits:

```crespi
trait Imprimible {
    bloque imprimir() -> String
}

trait Comparable {
    bloque comparar(otro) -> Int
}

tipo Valor(let n) : Imprimible, Comparable {
    bloque imprimir() -> String {
        resultado "Valor(" + texto(yo.n) + ")"
    }
    
    bloque comparar(otro) -> Int {
        resultado yo.n - otro.n
    }
}
```

### Herencia de Clase con Traits

Al heredar de una clase e implementar traits, la clase va primero:

```crespi
tipo Animal(let nombre) {
    bloque hablar() {
        mostrar(yo.nombre + " hace un sonido")
    }
}

trait Volable {
    bloque volar()
}

tipo Pajaro(let nombre) : Animal(nombre), Volable {
    bloque volar() {
        mostrar(yo.nombre + " está volando")
    }
}

variable p = Pajaro("Piolín")
p.hablar()  // Piolín hace un sonido
p.volar()   // Piolín está volando
```

---

## Ver También

- [Funciones](funciones.md)
- [Extensiones](extensiones.md)
- [Características Avanzadas](avanzado.md)
- [Palabras Clave](../referencia/palabras-clave.md)
