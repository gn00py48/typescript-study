# TypeScript 클래스 핵심 요약
## 1. 클래스란?

클래스는 **동일한 구조의 객체를 반복해서 만들기 위한 설계도**입니다.

```ts
class Student {
  name: string;
  grade: string;
  age: number;

  constructor(name: string, grade: string, age: number) {
    this.name = name;
    this.grade = grade;
    this.age = age;
  }

  study() {
    console.log("공부합니다.");
  }
}
```

```ts
const student = new Student("홍길동", "A+", 27);
```

* `field`: 객체가 가질 프로퍼티
* `constructor`: 객체를 생성하면서 초기값을 설정하는 메서드
* `this`: 현재 생성되거나 사용 중인 객체
* `new`: 클래스를 이용해 새로운 객체를 생성하는 키워드

---

## 2. TypeScript 클래스의 특징

TypeScript에서는 필드와 생성자 매개변수에 타입을 지정해야 합니다.

```ts
class Employee {
  name: string;
  age: number;
  position: string;

  constructor(name: string, age: number, position: string) {
    this.name = name;
    this.age = age;
    this.position = position;
  }
}
```

필드를 생성자에서 초기화하지 않는다면 선언할 때 초기값을 줘야 합니다.

```ts
class Employee {
  name: string = "";
  age: number = 0;
}
```

선택적 필드는 `?`를 사용합니다.

```ts
class Employee {
  position?: string;
}
```

---

## 3. 클래스는 타입으로도 사용 가능

TypeScript의 클래스는 객체를 만드는 기능뿐 아니라 타입 역할도 합니다.

```ts
class Employee {
  constructor(
    public name: string,
    public age: number
  ) {}

  work() {}
}
```

```ts
const employee: Employee = {
  name: "홍길동",
  age: 27,
  work() {},
};
```

즉, `Employee` 타입은 해당 클래스가 생성하는 객체의 구조를 의미합니다.

---

## 4. 상속

`extends`를 사용하면 기존 클래스의 필드와 메서드를 물려받을 수 있습니다.

```ts
class Student {
  constructor(
    public name: string,
    public age: number
  ) {}

  study() {}
}

class StudentDeveloper extends Student {
  constructor(
    name: string,
    age: number,
    public favoriteSkill: string
  ) {
    super(name, age);
  }

  programming() {
    console.log(`${this.favoriteSkill}로 개발합니다.`);
  }
}
```

`super()`는 부모 클래스의 생성자를 호출합니다.

파생 클래스에 생성자가 있다면:

* 반드시 `super()`를 호출해야 함
* `this`를 사용하기 전에 호출해야 함

---

## 5. 접근 제어자

접근 제어자는 필드나 메서드에 접근할 수 있는 범위를 제한합니다.

### `public`

어디서든 접근 가능합니다. 생략하면 기본값은 `public`입니다.

```ts
class Employee {
  public position: string;
}
```

### `private`

해당 클래스 내부에서만 접근할 수 있습니다.

```ts
class Employee {
  private name: string;

  work() {
    console.log(this.name); // 가능
  }
}

const employee = new Employee();
employee.name; // 오류
```

### `protected`

클래스 내부와 상속받은 자식 클래스에서만 접근 가능합니다.

```ts
class Employee {
  protected age: number;
}

class ExecutiveOfficer extends Employee {
  printAge() {
    console.log(this.age); // 가능
  }
}
```

클래스 외부에서는 접근할 수 없습니다.

| 접근 제어자      | 클래스 내부 | 자식 클래스 | 클래스 외부 |
| ----------- | -----: | -----: | -----: |
| `public`    |     가능 |     가능 |     가능 |
| `protected` |     가능 |     가능 |    불가능 |
| `private`   |     가능 |    불가능 |    불가능 |

---

## 6. 생성자 매개변수로 필드 선언하기

TypeScript에서는 생성자 매개변수에 접근 제어자를 붙이면 필드 선언과 값 할당을 한 번에 처리할 수 있습니다.

기존 방식:

```ts
class Employee {
  private name: string;
  protected age: number;
  public position: string;

  constructor(name: string, age: number, position: string) {
    this.name = name;
    this.age = age;
    this.position = position;
  }
}
```

축약 방식:

```ts
class Employee {
  constructor(
    private name: string,
    protected age: number,
    public position: string
  ) {}
}
```

위 코드는 자동으로 다음 작업을 수행합니다.

```ts
this.name = name;
this.age = age;
this.position = position;
```

따라서 필드 선언과 생성자 내부의 할당 코드를 생략할 수 있습니다.

---

## 7. 인터페이스 구현

인터페이스는 클래스가 반드시 지켜야 할 구조를 정의하는 설계도 역할을 합니다.

```ts
interface CharacterInterface {
  name: string;
  moveSpeed: number;
  move(): void;
}
```

```ts
class Character implements CharacterInterface {
  constructor(
    public name: string,
    public moveSpeed: number,
    private extra: string
  ) {}

  move(): void {
    console.log(`${this.moveSpeed} 속도로 이동합니다.`);
  }
}
```

`implements`를 사용하면 클래스는 인터페이스에 정의된 프로퍼티와 메서드를 반드시 구현해야 합니다.

```ts
class Character implements CharacterInterface {
  constructor(public name: string) {}
  // moveSpeed와 move가 없으므로 오류
}
```

인터페이스에 없는 추가 필드를 클래스가 갖는 것은 가능합니다.

```ts
private extra: string;
```

---

# 핵심 개념 비교

## `extends`

기존 클래스의 기능을 실제로 물려받습니다.

```ts
class Developer extends Employee {}
```

* 필드와 메서드 상속
* 부모 코드 재사용
* 필요하면 `super()` 호출

## `implements`

인터페이스가 요구하는 구조를 지키도록 검사합니다.

```ts
class Character implements CharacterInterface {}
```

* 코드나 기능을 물려받지 않음
* 반드시 구현해야 할 규칙만 제공
* 클래스가 설계대로 작성됐는지 검사

---

# 최종 정리

* 클래스는 동일한 구조의 객체를 반복 생성하는 설계도입니다.
* `constructor`는 객체 생성 시 필드를 초기화합니다.
* `this`는 현재 객체를 의미합니다.
* 클래스는 객체 생성 기능과 타입 역할을 동시에 가집니다.
* `extends`는 부모 클래스의 필드와 메서드를 상속합니다.
* `public`, `private`, `protected`로 접근 범위를 제한할 수 있습니다.
* 생성자 매개변수에 접근 제어자를 붙이면 필드 선언과 할당을 생략할 수 있습니다.
* `implements`는 클래스가 인터페이스의 구조를 반드시 만족하도록 강제합니다.

> `extends`는 기능을 물려받는 상속이고, `implements`는 정해진 규칙을 지키는 구현입니다.
