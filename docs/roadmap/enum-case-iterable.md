# CaseIterable Protocol

The CaseIterable protocol in Swift allows you to automatically generate a collection of all the cases in an enumeration. This is incredibly useful for looping over cases or populating UI lists (like pickers).

## Syntax Breakdown

### 1. Basic Implementation

To enable this, simply add `: CaseIterable` to your enum definition. Crespi will automatically synthesize the `allCases` property.

```crespi
enum CompassDirection: CaseIterable {
    case north
    case south
    case east
    case west
}
```

### 2. Accessing All Cases

Access the collection using the static property `.allCases`. It returns a list of all enum values.

**Looping:**
```crespi
for direction in CompassDirection.allCases {
    print("I can go $direction")
}
// Prints:
// I can go north
// I can go south
// ...
```

**Counting:**
```crespi
var totalDirections = CompassDirection.allCases.length()
print("There are $totalDirections directions.")
```

**Accessing by Index:**
```crespi
var firstDirection = CompassDirection.allCases[0]  // north
```

### 3. Using with Raw Values

CaseIterable works seamlessly with enums that have raw values.

```crespi
enum Planet: Int, CaseIterable {
    case mercury = 1, venus, earth, mars
}

var planetNumbers = Planet.allCases.map { p -> p.rawValue }
print(planetNumbers)
// Output: [1, 2, 3, 4]
```

### 4. Manual Implementation (Advanced)

If your enum has associated values, Crespi cannot automatically synthesize CaseIterable. You must implement the `allCases` property manually.

```crespi
enum Transport: CaseIterable {
    case car(passengers: Int)
    case bus
    case train

    // Explicit definition of allCases
    static var allCases: List[Transport] {
        return [
            .car(passengers: 1),  // Example default
            .bus,
            .train
        ]
    }
}
```

## Summary

| Action | Syntax |
|--------|--------|
| Conform | `enum Name: CaseIterable { ... }` |
| Access | `Name.allCases` |
| Count | `Name.allCases.length()` |
| Restriction | Not automatic if cases have Associated Values |
