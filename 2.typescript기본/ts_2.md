# 강의와 달라진 컴파일 및 실행 방식

강의에서는 전역 설치된 `tsc`, `ts-node`를 직접 실행하지만, 현재 프로젝트는 패키지를 로컬로 설치해 사용한다.

```bash
# 타입스크립트 컴파일
npx tsc
# 또는
npm run build

# 타입스크립트 파일 즉시 실행
npx ts-node src/index.ts
# 또는
npm start
```

로컬 패키지를 사용하면 프로젝트마다 TypeScript와 `ts-node` 버전을 일정하게 관리할 수 있다.

# 객체 타입 정의하기

## 1. 객체를 선언하는 두 가지 방식

### `object` 타입

값이 객체라는 사실만 나타내며, 객체가 가진 프로퍼티 정보는 알 수 없다.

```ts
let user: object = { id: 1, name: "이정환" };

user.id; // 오류: object 타입에는 id 정보가 없음
```

### 객체 리터럴 타입

프로퍼티 이름과 타입을 직접 정의하므로 객체의 구조를 정확히 표현하고 프로퍼티에 접근할 수 있다.

```ts
let dog: {
  name: string;
  color: string;
} = {
  name: "돌돌이",
  color: "brown",
};

dog.name; // 사용 가능
```

타입스크립트는 프로퍼티를 기준으로 객체의 타입을 판단하므로, 일반적으로 `object`보다 객체 리터럴 타입을 사용한다.

## 2. 선택적 프로퍼티와 읽기 전용 프로퍼티

`?`를 붙인 프로퍼티는 생략할 수 있고, `readonly`를 붙인 프로퍼티는 값을 다시 할당할 수 없다.

```ts
let user: {
  id?: number;          // 있어도 되고 없어도 됨
  readonly name: string; // 생성 후 수정할 수 없음
} = {
  name: "이정환",
};

user.id = 1;          // 가능
user.name = "홍길동"; // 오류: 읽기 전용 프로퍼티
```
