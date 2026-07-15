# TypeScript 인터페이스 핵심 요약

## 1. 인터페이스란?

인터페이스는 객체 타입에 이름을 붙이는 문법입니다.

```ts
interface Person {
  name: string;
  age: number;
}
```

```ts
const person: Person = {
  name: "이정환",
  age: 27,
};
```

기본적인 역할은 타입 별칭과 비슷합니다.

```ts
type Person = {
  name: string;
  age: number;
};
```

---

## 2. 인터페이스의 기본 기능

### 선택적 프로퍼티

`?`를 붙이면 생략할 수 있습니다.

```ts
interface Person {
  name: string;
  age?: number;
}
```

### 읽기 전용 프로퍼티

`readonly`를 붙이면 값을 수정할 수 없습니다.

```ts
interface Person {
  readonly name: string;
  age?: number;
}
```

```ts
person.name = "홍길동"; // 오류
```

### 메서드 정의

```ts
interface Person {
  sayHi(): void;
}
```

또는 함수 타입 표현식으로도 정의할 수 있습니다.

```ts
interface Person {
  sayHi: () => void;
}
```

다만 메서드 오버로딩은 호출 시그니처 방식이 더 적합합니다.

```ts
interface Person {
  sayHi(): void;
  sayHi(a: number): void;
  sayHi(a: number, b: number): void;
}
```

---

## 3. 인터페이스 확장

`extends`를 사용하면 다른 인터페이스의 프로퍼티를 상속받을 수 있습니다.

```ts
interface Animal {
  name: string;
  color: string;
}

interface Dog extends Animal {
  breed: string;
}
```

`Dog`는 다음 프로퍼티를 모두 갖습니다.

```ts
const dog: Dog = {
  name: "돌돌이",
  color: "brown",
  breed: "진도",
};
```

인터페이스 확장의 장점은 중복을 줄이고 공통 구조를 재사용할 수 있다는 점입니다.

---

## 4. 프로퍼티 재정의

확장하면서 기존 프로퍼티를 더 구체적인 타입으로 변경할 수 있습니다.

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  name: "doldol";
}
```

`"doldol"`은 `string`의 서브타입이므로 가능합니다.

반대로 전혀 다른 타입으로 변경하는 것은 불가능합니다.

```ts
interface Dog extends Animal {
  name: number; // 오류
}
```

확장된 인터페이스는 원본 인터페이스의 서브타입 관계를 유지해야 하기 때문입니다.

---

## 5. 다중 확장

여러 인터페이스를 동시에 확장할 수 있습니다.

```ts
interface Dog {
  name: string;
  breed: string;
}

interface Cat {
  color: string;
  isScratch: boolean;
}

interface DogCat extends Dog, Cat {}
```

```ts
const dogCat: DogCat = {
  name: "냥멍이",
  breed: "진도",
  color: "brown",
  isScratch: true,
};
```

---

## 6. 선언 합침

인터페이스는 같은 이름으로 여러 번 선언할 수 있습니다.

```ts
interface Person {
  name: string;
}

interface Person {
  age: number;
}
```

두 선언은 자동으로 합쳐집니다.

```ts
const person: Person = {
  name: "이정환",
  age: 27,
};
```

이를 선언 합침이라고 합니다.

단, 같은 프로퍼티를 서로 다른 타입으로 선언하면 충돌이 발생합니다.

```ts
interface Person {
  name: string;
}

interface Person {
  name: number; // 오류
}
```

---

# 인터페이스와 타입 별칭의 차이

## 공통점

둘 다 객체 타입에 이름을 붙일 수 있습니다.

```ts
interface User {
  name: string;
}

type User = {
  name: string;
};
```

선택적 프로퍼티, `readonly`, 메서드 정의 등 대부분의 기본 기능도 비슷합니다.

---

## 차이점 1. 타입 별칭은 더 다양한 타입을 표현할 수 있음

타입 별칭은 객체뿐 아니라 기본 타입, 유니온, 인터섹션도 정의할 수 있습니다.

```ts
type ID = number | string;
type Status = "success" | "error";
type Combined = A & B;
```

인터페이스는 이런 형태로 직접 정의할 수 없습니다.

```ts
interface ID = number | string; // 불가능
```

인터페이스는 주로 객체 구조를 정의하는 데 사용합니다.

---

## 차이점 2. 인터페이스는 `extends`로 확장

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
```

타입 별칭은 인터섹션 타입으로 확장합니다.

```ts
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};
```

---

## 차이점 3. 인터페이스는 선언 합침 가능

```ts
interface Person {
  name: string;
}

interface Person {
  age: number;
}
```

같은 이름의 선언이 하나로 합쳐집니다.

타입 별칭은 같은 이름으로 다시 선언할 수 없습니다.

```ts
type Person = {
  name: string;
};

type Person = { // 오류
  age: number;
};
```

---

## 차이점 4. 인터페이스는 객체 중심

인터페이스는 다음과 같은 객체 구조를 표현할 때 적합합니다.

* 사용자 객체
* API 응답 객체
* 클래스가 구현할 규칙
* 라이브러리 타입 확장
* 공통 객체 구조 상속

타입 별칭은 다음처럼 더 복잡하거나 다양한 타입을 표현할 때 적합합니다.

* 유니온 타입
* 인터섹션 타입
* 리터럴 타입
* 튜플 타입
* 함수 타입
* 조건부 타입

---

# 선택 기준

객체의 구조를 정의하고 확장할 목적이라면 인터페이스가 적합합니다.

```ts
interface User {
  id: number;
  name: string;
}
```

유니온이나 복잡한 타입 조합이 필요하다면 타입 별칭이 적합합니다.

```ts
type Status = "loading" | "success" | "error";
```