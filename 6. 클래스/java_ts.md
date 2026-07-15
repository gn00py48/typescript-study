Java의 클래스·객체와 TypeScript/JavaScript의 클래스·객체는 겉보기 문법은 비슷하지만, 내부 동작 방식은 꽤 다릅니다.

# Java와 TypeScript 클래스·객체 차이

| 구분      | Java             | TypeScript / JavaScript |
| ------- | ---------------- | ----------------------- |
| 클래스의 본질 | 객체 생성을 위한 실제 설계도 | 프로토타입 기반 문법을 클래스처럼 표현   |
| 타입 검사   | 컴파일 시 강하게 검사     | TypeScript만 컴파일 시 검사    |
| 실행 시 타입 | 타입 정보가 유지됨       | TypeScript 타입은 실행 시 제거됨 |
| 객체 구조   | 클래스에 선언된 필드 중심   | 실행 중 프로퍼티 추가·삭제 가능      |
| 상속      | 클래스 기반 상속        | 내부적으로 프로토타입 기반 상속       |
| 다중 상속   | 클래스 다중 상속 불가     | 클래스 다중 상속 불가            |
| 인터페이스   | 클래스가 구현 가능       | TypeScript에서만 가능        |
| 접근 제어   | 실제 런타임 접근 제한     | 일부는 컴파일 단계 제한           |
| 오버로딩    | 실제 함수 오버로딩 지원    | TS 오버로딩은 타입 검사용         |
| 생성자     | 클래스 이름과 동일       | `constructor` 사용        |

---

# 1. Java 클래스

Java에서는 클래스가 객체의 구조를 엄격하게 정의합니다.

```java
class Person {
    String name;
    int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void introduce() {
        System.out.println(name);
    }
}
```

```java
Person person = new Person("홍길동", 27);
```

`Person` 객체는 클래스에 정의된 필드와 메서드를 기준으로 생성됩니다.

다음처럼 클래스에 없는 필드를 나중에 추가할 수 없습니다.

```java
person.address = "서울"; // 오류
```

---

# 2. TypeScript 클래스

TypeScript도 문법은 Java와 유사합니다.

```ts
class Person {
  constructor(
    public name: string,
    public age: number
  ) {}

  introduce() {
    console.log(this.name);
  }
}
```

```ts
const person = new Person("홍길동", 27);
```

하지만 TypeScript 코드는 실행 전에 JavaScript로 변환됩니다.

```ts
public name: string
```

여기서 `string`, `public` 같은 TypeScript 타입 정보는 컴파일 과정에서 대부분 사라집니다.

실행 환경에서는 JavaScript 객체로 동작합니다.

---

# 3. 가장 큰 차이: 타입의 존재 시점

## Java

타입이 컴파일 이후에도 존재합니다.

```java
Person person = new Person("홍길동", 27);
```

JVM은 실행 중에도 객체가 `Person` 클래스의 인스턴스라는 것을 알고 있습니다.

```java
person instanceof Person
```

---

## TypeScript

TypeScript 타입은 컴파일할 때만 사용됩니다.

```ts
interface Person {
  name: string;
  age: number;
}
```

컴파일 후에는 인터페이스 자체가 사라집니다.

```js
// Person 인터페이스는 결과 JavaScript에 존재하지 않음
```

따라서 다음은 불가능합니다.

```ts
person instanceof Person;
```

`Person`이 인터페이스라면 실행 시 존재하지 않기 때문입니다.

단, 클래스는 JavaScript 값으로도 존재하므로 가능합니다.

```ts
class Person {}

const person = new Person();

console.log(person instanceof Person); // true
```

---

# 4. 객체 구조의 엄격성

## Java

객체 구조가 고정적입니다.

```java
class User {
    String name;
}
```

```java
User user = new User();
user.name = "근우";
user.age = 25; // 오류
```

`age`가 클래스에 선언되지 않았기 때문입니다.

---

## JavaScript

객체 구조를 실행 중에도 변경할 수 있습니다.

```js
const user = {
  name: "근우",
};

user.age = 25;
delete user.name;
```

TypeScript는 이를 타입으로 제한할 수 있지만, 실행 결과는 여전히 JavaScript입니다.

```ts
type User = {
  name: string;
};

const user: User = {
  name: "근우",
};

user.age = 25; // TypeScript 오류
```

다만 타입 단언이나 `any`를 사용하면 검사를 우회할 수 있습니다.

```ts
(user as any).age = 25;
```

---

# 5. 상속 방식 차이

## Java

Java는 전형적인 클래스 기반 상속입니다.

```java
class Animal {
    void move() {
        System.out.println("이동");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("멍멍");
    }
}
```

---

## JavaScript / TypeScript

문법상으로는 동일해 보입니다.

```ts
class Animal {
  move() {
    console.log("이동");
  }
}

class Dog extends Animal {
  bark() {
    console.log("멍멍");
  }
}
```

하지만 내부적으로는 프로토타입 체인을 이용합니다.

개념적으로는 다음 구조입니다.

```text
dog 객체
  ↓
Dog.prototype
  ↓
Animal.prototype
  ↓
Object.prototype
```

즉, TypeScript 클래스는 문법은 클래스 기반처럼 보이지만 실행은 JavaScript의 프로토타입 기반입니다.

---

# 6. 인터페이스 차이

## Java 인터페이스

Java 인터페이스는 클래스가 구현해야 할 메서드 규칙을 정의합니다.

```java
interface Movable {
    void move();
}

class Character implements Movable {
    public void move() {
        System.out.println("이동");
    }
}
```

인터페이스는 Java 타입 시스템의 일부이며 실행 환경에서도 관련 타입 정보가 활용됩니다.

---

## TypeScript 인터페이스

```ts
interface Movable {
  move(): void;
}

class Character implements Movable {
  move() {
    console.log("이동");
  }
}
```

겉보기에는 비슷하지만 TypeScript 인터페이스는 컴파일 후 완전히 사라집니다.

즉, `implements`는 실제 기능을 추가하는 것이 아니라 타입 검사만 수행합니다.

```ts
class Character implements Movable {
  move() {}
}
```

컴파일 후에는 대략 다음처럼 됩니다.

```js
class Character {
  move() {}
}
```

---

# 7. 접근 제어자 차이

## Java

```java
class User {
    private String password;
}
```

`private`는 JVM 실행 단계에서도 실제 접근 제한으로 작동합니다.

---

## TypeScript

```ts
class User {
  private password: string;

  constructor(password: string) {
    this.password = password;
  }
}
```

TypeScript의 `private`는 주로 컴파일 단계에서 검사합니다.

JavaScript 결과에서는 일반 프로퍼티처럼 존재할 수 있습니다.

실제 JavaScript 런타임에서도 비공개 필드를 만들고 싶다면 `#` 문법을 사용합니다.

```ts
class User {
  #password: string;

  constructor(password: string) {
    this.#password = password;
  }
}
```

```ts
const user = new User("1234");

user.#password; // 문법적으로 접근 불가
```

정리하면:

* `private`: TypeScript 타입 검사 중심
* `#private`: JavaScript 런타임에서도 실제 비공개

---

# 8. 함수 오버로딩 차이

## Java

Java는 매개변수에 따라 실제로 여러 구현을 만들 수 있습니다.

```java
class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }
}
```

같은 이름의 메서드가 실제로 여러 개 존재합니다.

---

## TypeScript

TypeScript 오버로딩은 호출 가능한 타입을 여러 개 정의하지만, 실제 구현은 하나입니다.

```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a: number | string, b: number | string) {
  return typeof a === "number" && typeof b === "number"
    ? a + b
    : String(a) + String(b);
}
```

실제 JavaScript 함수는 하나뿐입니다.

---

# 9. 타입 호환 방식 차이

## Java: 명목적 타이핑

Java는 선언된 클래스나 인터페이스의 이름과 상속 관계를 중요하게 봅니다.

```java
class A {
    String name;
}

class B {
    String name;
}
```

구조가 같아도 `A`와 `B`는 서로 다른 타입입니다.

---

## TypeScript: 구조적 타이핑

TypeScript는 타입 이름보다 객체의 구조를 비교합니다.

```ts
class A {
  name = "";
}

class B {
  name = "";
}

const a: A = new B(); // 가능
```

`A`와 `B`가 동일한 구조를 갖기 때문에 호환됩니다.

이를 구조적 타이핑이라고 합니다.

다만 `private`나 `protected` 필드가 있으면 호환 규칙이 달라질 수 있습니다.

---

# 핵심 요약

## Java

* 클래스 자체가 강한 타입의 설계도
* 객체 구조가 고정적
* 실행 중에도 타입 정보가 중요
* 명목적 타이핑
* 접근 제어와 오버로딩이 런타임 구조에도 반영됨

## TypeScript

* JavaScript에 정적 타입 검사를 추가
* 클래스는 실행 시 JavaScript 클래스
* 인터페이스와 타입은 컴파일 후 제거
* 구조적 타이핑
* `implements`, 오버로딩, `private` 일부는 타입 검사 중심

> Java 클래스는 실행 환경까지 이어지는 강한 설계도이고, TypeScript 클래스는 JavaScript 객체에 컴파일 단계의 타입 안전성을 추가한 문법에 가깝습니다.
