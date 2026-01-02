---
title: A guide for creating classes in TypeScript/JavaScript
description: A guide for creating classes in TypeScript/JavaScript
date_created: '2025-05-30T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - typescript
---
**1. Basic Class Definition:**

Use the `class` keyword, followed by the class name.

```typescript
class Greeter {
    // Properties (member variables)
    greeting: string; // Type annotation is key!

    // Constructor
    constructor(message: string) {
        this.greeting = message;
    }

    // Methods (member functions)
    greet(): string {
        return "Hello, " + this.greeting;
    }
}

// How to use it:
let greeterInstance = new Greeter("world");
console.log(greeterInstance.greet()); // Output: Hello, world
```

**2. Properties:**

*   Declare properties with their types at the top of the class.
*   Initialize them in the constructor or provide a default value.

```typescript
class Product {
    name: string;
    price: number = 0; // Default value
    readonly id: number; // Readonly property (can only be set in constructor)

    constructor(id: number, name: string, initialPrice: number) {
        this.id = id; // 'readonly' can be assigned here
        this.name = name;
        this.price = initialPrice;
    }

    getDescription(): string {
        return `${this.name} costs $${this.price}`;
    }
}
```

**3. Access Modifiers (Visibility):**

*   **`public`**: (Default) Accessible from anywhere.
*   **`private`**: Accessible only within the class itself.
*   **`protected`**: Accessible within the class and by instances of derived classes (subclasses).

```typescript
class Animal {
    public name: string;
    private age: number; // Can't be accessed directly from outside
    protected species: string;

    constructor(name: string, age: number, species: string) {
        this.name = name;
        this.age = age;
        this.species = species;
    }

    public getDetails(): string {
        return `${this.name} is a ${this.species} and is ${this.age} years old.`;
    }
}

class Dog extends Animal {
    constructor(name: string, age: number) {
        super(name, age, "Canine");
    }

    public getSpecies(): string {
        return this.species; // 'species' is accessible due to 'protected'
        // return this.age; // Error: 'age' is private to Animal
    }
}

let myDog = new Dog("Buddy", 5);
console.log(myDog.name);          // OK (public)
// console.log(myDog.age);        // Error (private in Animal)
// console.log(myDog.species);    // Error (protected, not directly accessible outside)
console.log(myDog.getSpecies());  // OK (accessed via a public method in Dog)
```

**4. Shorthand Constructor (Parameter Properties):**

Declare and assign properties directly in the constructor parameters using access modifiers.

```typescript
class Person {
    // No need to declare 'name' and 'age' above the constructor
    constructor(public name: string, private age: number, readonly id: string) {}

    displayInfo(): void {
        console.log(`ID: ${this.id}, Name: ${this.name}, Age: (private)`);
    }
}

let person = new Person("Alice", 30, "UID123");
person.displayInfo();
console.log(person.name); // Alice
// console.log(person.age); // Error: 'age' is private
console.log(person.id);   // UID123
```

**5. Static Members:**

Properties or methods that belong to the class itself, not to instances. Accessed using `ClassName.memberName`.

```typescript
class MathHelper {
    static PI: number = 3.14159;

    static calculateCircumference(radius: number): number {
        return 2 * MathHelper.PI * radius;
    }
}

console.log(MathHelper.PI); // 3.14159
console.log(MathHelper.calculateCircumference(10)); // 62.8318
```

**6. Inheritance (`extends`):**

Create a new class (subclass/derived class) based on an existing class (superclass/base class).

```typescript
class Vehicle {
    constructor(public brand: string) {}

    drive(): void {
        console.log(`${this.brand} is moving.`);
    }
}

class Car extends Vehicle {
    constructor(brand: string, public model: string) {
        super(brand); // Calls the constructor of the base class (Vehicle)
    }

    honk(): void {
        console.log(`${this.brand} ${this.model} says: Beep beep!`);
    }

    // Override method from base class
    drive(): void {
        super.drive(); // Optionally call the base class method
        console.log(`${this.model} is cruising smoothly.`);
    }
}

let myCar = new Car("Toyota", "Camry");
myCar.drive();
myCar.honk();
```

**7. Implementing Interfaces (`implements`):**

Ensure a class adheres to a specific contract defined by an interface.

```typescript
interface Printable {
    print(): void;
    format: string;
}

class Document implements Printable {
    title: string;
    format: string = "A4"; // Must implement 'format'

    constructor(title: string) {
        this.title = title;
    }

    print(): void { // Must implement 'print'
        console.log(`Printing document: ${this.title} in ${this.format} format.`);
    }
}

let report = new Document("Annual Report");
report.print();
```

**Key Takeaways for TypeScript Classes:**

*   **Type Safety:** Explicitly define types for properties, constructor parameters, method parameters, and return values.
*   **Visibility Control:** Use `public`, `private`, and `protected` to encapsulate data.
*   **`readonly`:** For properties that should not be changed after initialization.
*   **Clear Structure:** Provides a familiar OOP paradigm.
*   **Enhanced Features:** Shorthand constructors, static members, abstract classes (not shown here but available) further enrich class capabilities.

This brief guide covers the essentials. TypeScript's class system is rich and closely mirrors features from languages like Java or C#.