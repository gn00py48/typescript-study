# TypeScript 함수 타입 핵심 요약

## 1. 함수 타입 정의

함수의 타입은 **매개변수 타입과 반환값 타입**으로 결정됩니다.

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

반환값 타입은 대부분 자동 추론되므로 생략할 수 있습니다.

```ts
function add(a: number, b: number) {
  return a + b;
}
```

화살표 함수도 동일합니다.

```ts
const add = (a: number, b: number): number => a + b;
```

---

## 2. 기본값과 선택적 매개변수

### 기본값

기본값이 있으면 해당 값의 타입으로 자동 추론됩니다.

```ts
function introduce(name = "이정환") {}
```

`name`은 `string` 타입으로 추론됩니다.

### 선택적 매개변수

매개변수 뒤에 `?`를 붙이면 생략할 수 있습니다.

```ts
function introduce(name: string, tall?: number) {}
```

`tall`의 실제 타입은 다음과 같습니다.

```ts
number | undefined
```

따라서 사용하기 전에 타입 확인이 필요합니다.

```ts
if (typeof tall === "number") {
  console.log(tall + 10);
}
```

선택적 매개변수는 반드시 필수 매개변수 뒤에 위치해야 합니다.

---

## 3. 나머지 매개변수

여러 개의 인수를 배열로 받는 방식입니다.

```ts
function getSum(...rest: number[]) {
  return rest.reduce((sum, num) => sum + num, 0);
}
```

인수 개수를 고정하려면 튜플을 사용합니다.

```ts
function getSum(...rest: [number, number, number]) {}
```

```ts
getSum(1, 2, 3);    // 가능
getSum(1, 2, 3, 4); // 오류
```

---

## 4. 함수 타입 표현식

함수의 타입을 별도로 정의하는 방식입니다.

```ts
type Operation = (a: number, b: number) => number;
```

동일한 형태의 여러 함수에 재사용할 수 있습니다.

```ts
const add: Operation = (a, b) => a + b;
const sub: Operation = (a, b) => a - b;
const multiply: Operation = (a, b) => a * b;
```

---

## 5. 호출 시그니처

객체 타입처럼 함수 타입을 정의하는 방식입니다.

```ts
type Operation = {
  (a: number, b: number): number;
};
```

함수에 프로퍼티까지 추가하면 함수이면서 객체인 **하이브리드 타입**을 만들 수 있습니다.

```ts
type Operation = {
  (a: number, b: number): number;
  name: string;
};
```

---

## 6. 함수 타입 호환성

함수 타입의 호환성은 다음 두 가지를 확인합니다.

### 반환값 타입

더 구체적인 반환 타입의 함수는 더 넓은 반환 타입의 함수로 취급할 수 있습니다.

```ts
type A = () => number;
type B = () => 10;

let a: A;
let b: B;

a = b; // 가능
b = a; // 오류
```

`10`은 `number`의 서브타입이기 때문입니다.

### 매개변수 타입

매개변수는 반환값과 반대 방향으로 호환됩니다.

```ts
type Animal = {
  name: string;
};

type Dog = {
  name: string;
  color: string;
};

let animalFunc = (animal: Animal) => {};
let dogFunc = (dog: Dog) => {};

animalFunc = dogFunc; // 오류
dogFunc = animalFunc; // 가능
```

`Dog` 함수는 `color`가 반드시 있다고 가정하므로, 일반 `Animal`을 전달받는 함수로 사용할 수 없습니다.

### 매개변수 개수가 다를 때

매개변수가 적은 함수는 더 많은 매개변수를 받는 함수 타입에 할당할 수 있습니다.

```ts
type Func1 = (a: number, b: number) => void;
type Func2 = (a: number) => void;

let func1: Func1;
let func2: Func2;

func1 = func2; // 가능
func2 = func1; // 오류
```

---

## 7. 함수 오버로딩

하나의 함수를 매개변수의 개수나 타입에 따라 다르게 호출할 수 있도록 정의하는 문법입니다.

```ts
function func(a: number): void;
function func(a: number, b: number, c: number): void;

function func(a: number, b?: number, c?: number) {
  if (typeof b === "number" && typeof c === "number") {
    console.log(a + b + c);
  } else {
    console.log(a * 20);
  }
}
```

위쪽 선언은 **오버로드 시그니처**, 실제 코드가 있는 부분은 **구현 시그니처**입니다.

```ts
func(1);       // 가능
func(1, 2);    // 오류
func(1, 2, 3); // 가능
```

구현 시그니처는 모든 오버로드 시그니처를 처리할 수 있어야 합니다.

---

## 8. 사용자 정의 타입 가드

특정 값이 어떤 타입인지 직접 판별하는 함수를 만드는 방식입니다.

```ts
type Dog = {
  name: string;
  isBark: boolean;
};

type Cat = {
  name: string;
  isScratch: boolean;
};

type Animal = Dog | Cat;
```

```ts
function isDog(animal: Animal): animal is Dog {
  return (animal as Dog).isBark !== undefined;
}
```

`animal is Dog`는 다음 의미입니다.

> 이 함수가 `true`를 반환하면 `animal`은 `Dog` 타입이다.

```ts
function warning(animal: Animal) {
  if (isDog(animal)) {
    console.log(animal.isBark);
  } else {
    console.log(animal.isScratch);
  }
}
```

사용자 정의 타입 가드를 사용하면 복잡한 타입 판별 로직을 함수로 분리하고, 조건문 내부에서 안전하게 타입을 좁힐 수 있습니다.

---
