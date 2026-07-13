# TypeScript 이해하기

## 1. TypeScript에 대한 이해를 기반으로 개발해야 하는 이유

타입스크립트를 이해한다는 것은 문법을 외우는 것뿐만 아니라 다음 원리를 이해하는 것이다.

- 타입을 어떤 기준으로 정의하는가?
- 서로 다른 타입의 관계와 호환성을 어떻게 판단하는가?
- 코드의 타입 오류를 어떤 기준으로 검사하는가?

타입스크립트는 단순한 문법 암기만으로 모든 상황에 대응하기 어렵다. 제네릭, 조건부 타입, 타입 추론처럼 여러 원리가 함께 사용되면 타입이 복잡해지기 때문이다.

## 2. 타입은 집합이다
업 케스팅은 가능 / 다운 케스팅은 불가능 (예외적으로 가능한 케이스가 있긴 함)

```ts
let num1: number = 10;
let num2: 10 = 10;

num1 = num2; // 가능: 업캐스팅
num2 = num1; // 오류: 다운캐스팅
```

## 3. unknown, never, any 타입

`unknown`은 가장 큰 집합, `never`는 가장 작은 집합, `any` 무적.

| 타입 | 타입 계층에서의 위치 | 캐스팅 관계 |
| --- | --- | --- |
| `unknown` | 전체 집합, 최상위 타입 | 모든 타입 → `unknown` 가능 / `unknown` → 일반 타입 불가능 (`any` 제외) |
| `never` | 공집합, 최하위 타입 | `never` → 모든 타입 가능 / 다른 타입 → `never` 불가능 |
| `any` | 타입 계층을 무시하는 치트키 | 대부분의 타입과 양방향 가능 (`any` → `never`는 불가능) |

```ts
let unknownValue: unknown = 10; // number → unknown 가능
let num: number = unknownValue; // 오류: unknown → number 불가능

function fail(): never {
  throw new Error();
}
let str: string = fail(); // never → string 가능

let anyValue: any = "hello";
let bool: boolean = anyValue; // any → boolean 가능
```

## 4. 객체 타입의 호환성

객체도 기본 타입처럼 업캐스팅은 가능하고 다운캐스팅은 불가능하다.

```ts
type Animal = { name: string; color: string };
type Dog = { name: string; color: string; breed: string };

animal = dog; // 가능: Dog → Animal
dog = animal; // 오류: Animal → Dog
```

프로퍼티가 더 적은 `Animal`이 더 많은 객체를 포함하므로 슈퍼 타입이고, 프로퍼티가 더 많은 `Dog`가 서브 타입이다.

### 초과 프로퍼티 검사

객체 리터럴을 직접 할당할 때 타입에 없는 프로퍼티가 있으면 오류가 발생한다.

```ts
let book: Book = {
  name: "한 입 크기로 잘라먹는 리액트",
  price: 33000,
  skill: "reactjs", // 오류: Book에 없는 프로퍼티
};

let programmingBook = {
  name: "한 입 크기로 잘라먹는 리액트",
  price: 33000,
  skill: "reactjs",
};

book = programmingBook; // 변수에 담아서 할당하면 가능
```

## 5. 대수 타입

여러 타입을 합쳐 만든 타입이다. 합집합인 Union 타입과 교집합인 Intersection 타입이 있다.

### Union 타입 (`|`)

합친 타입 중 하나만 만족하면 된다.

```ts
let value: string | number;

value = "hello";
value = 10;

type Union = Dog | Person;
```

객체의 Union 타입은 `Dog` 또는 `Person` 중 하나의 구조만 만족해도 된다. 두 구조를 모두 만족해도 가능하다.

### Intersection 타입 (`&`)

합친 모든 타입을 동시에 만족해야 한다.

```ts
type Intersection = Dog & Person;

let value: Intersection = {
  name: "이정환",
  color: "brown",
  language: "한국어",
};
```

`number & string`처럼 서로 겹치는 값이 없는 기본 타입의 교집합은 `never`가 된다. Intersection은 주로 객체 타입을 합칠 때 사용한다.

## 6. 타입 추론

타입을 직접 적지 않아도 초기값을 기준으로 타입스크립트가 타입을 알아서 판단한다.

```ts
let num = 10;                    // number
const str = "hello";             // "hello" 리터럴 타입
let arr = [1, "hello"];          // (number | string)[]
function func(msg = "hello") {  // msg: string, 반환값: string
  return msg;
}
```

변수, 객체, 구조 분해 할당, 함수 반환값과 기본값이 있는 매개변수는 타입 추론이 가능하다. 초기값이 없는 `let`은 할당되는 값에 따라 타입이 변하는 **any의 진화**가 발생한다.

## 7. 타입 단언

`값 as 타입`으로 타입스크립트에게 특정 타입이라고 단언한다. 실제 값을 바꾸는 기능은 아니므로 필요한 상황에서만 사용한다.

```ts
let person = {} as Person;
let dog = { name: "돌돌이", color: "brown", breed: "진도" } as Dog;
```

- `A as B`: A와 B가 슈퍼-서브 타입 관계일 때 가능
- `as unknown as B`: 강제로 다중 단언할 수 있지만 위험함
- `as const`: 리터럴 타입으로 만들고 객체 프로퍼티를 `readonly`로 만듦
- `value!`: `null`이나 `undefined`가 아니라고 단언함

타입 단언은 컴파일러의 검사만 우회한다. 잘못 단언하면 실행 중 오류가 발생할 수 있다.

## 8. 타입 좁히기

Union 타입은 바로 사용할 수 있는 기능이 제한된다. 조건문과 **타입 가드**를 이용하면 조건문 안에서 특정 타입으로 좁혀 사용할 수 있다.

```ts
function func(value: number | string | Date | null | Person) {
  if (typeof value === "number") {
    value.toFixed();
  } else if (typeof value === "string") {
    value.toUpperCase();
  } else if (value instanceof Date) {
    value.getTime();
  } else if (value && "age" in value) {
    console.log(value.age);
  }
}
```

- `typeof`: number, string 같은 기본 타입 검사
- `instanceof`: Date 같은 클래스 타입 검사
- `in`: 직접 만든 객체 타입의 프로퍼티 검사

`null`에 `in` 연산자를 사용할 수 없으므로 `value &&`로 먼저 확인한다.
