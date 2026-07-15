# TypeScript는 어떻게 동작하는가 (언어 레벨 심화)

> `1.typescript개론/ts_1.md`에서 다룬 `TS → AST → JS(or 컴파일 실패) → 기계어`의 큰 흐름을, 컴파일러 내부 단계별로 더 자세히 풀어 쓴 문서다.

## 0. 큰 그림: tsc는 "타입 검사기 + 트랜스파일러"

`tsc`(TypeScript Compiler)가 하는 일은 크게 두 가지로 나뉜다.

1. **타입 검사 (Type Checking)** — 코드가 타입 규칙을 지키는지 확인한다. 여기서 나온 오류가 우리가 에디터에서 보는 빨간 줄이다.
2. **자바스크립트 생성 (Emit / Transpile)** — 타입 정보를 지운 순수 JS로 변환한다.

중요한 점은 이 둘이 **서로 독립적**이라는 것이다. 타입 오류가 있어도 JS는 생성될 수 있고(`noEmitOnError`가 꺼져 있으면), 반대로 타입 검사만 하고 JS를 만들지 않을 수도 있다(`noEmit`, 혹은 `tsc --noEmit`).

```bash
# 이 프로젝트 기준 (로컬 설치)
npx tsc            # 검사 + JS 생성 (dist/에 출력)
npx tsc --noEmit   # 검사만 수행, 파일은 만들지 않음
```

이 "검사와 변환의 분리"가 뒤에서 설명할 **타입은 런타임에 존재하지 않는다**는 성질의 근본 원인이다.

---

## 1. 컴파일 파이프라인 전체 단계

`.ts` 소스 한 줄이 `.js`가 되기까지 실제로는 다음 단계를 거친다.

```
소스 코드 (문자열)
   │  ① Scanner (렉서)
   ▼
토큰 스트림 (Token[])
   │  ② Parser
   ▼
AST (추상 구문 트리)
   │  ③ Binder
   ▼
심볼 테이블 + 스코프 정보
   │  ④ Type Checker  ← 여기서 타입 오류 발생
   ▼
검사 완료된 AST
   │  ⑤ Transformer (타입 제거 + 다운레벨링)
   ▼
JS용 AST
   │  ⑥ Emitter (Printer)
   ▼
.js  (+ .d.ts, .js.map)
```

`ts_1.md`에서 말한 "TS → AST → JS"는 이 중 ②(AST 생성) → ④(검사) → ⑤⑥(JS 출력)에 해당한다. 아래에서 단계별로 본다.

---

## 2. ① Scanner — 문자를 토큰으로 (렉싱)

Scanner(=Lexer)는 소스 **문자열**을 의미 있는 최소 단위인 **토큰(Token)**으로 쪼갠다.

```ts
let dog: string = "돌돌이";
```

위 코드는 대략 이런 토큰 배열이 된다.

```
[ let ] [ dog ] [ : ] [ string ] [ = ] [ "돌돌이" ] [ ; ]
 키워드  식별자  기호   키워드    기호   문자열리터럴  기호
```

이 단계에서는 아직 "타입"이나 "의미"를 전혀 모른다. 그저 공백을 무시하고, `let`은 키워드고 `dog`는 식별자라는 **분류**만 한다.

---

## 3. ② Parser — 토큰을 AST로

Parser는 토큰 스트림을 문법 규칙에 따라 **트리 구조(AST, Abstract Syntax Tree)**로 조립한다. AST는 코드의 구조를 계층적으로 표현한 자료구조다.

앞의 `let dog: string = "돌돌이";`는 대략 이런 트리가 된다.

```
VariableStatement
└─ VariableDeclarationList (let)
   └─ VariableDeclaration
      ├─ name:  Identifier            "dog"
      ├─ type:  StringKeyword         (: string 부분)
      └─ init:  StringLiteral         "돌돌이"
```

- **왜 "추상(Abstract)"인가?** `;`, 공백, 괄호처럼 구조만 알면 다시 복원할 수 있는 문법적 장식은 트리에 노드로 남기지 않기 때문이다.
- 문법이 틀리면(`let dog: = ;`) 이 단계에서 **구문 오류(Syntax Error)**가 난다. 아직 타입 검사 전이다.

> 실제 AST가 궁금하면 [TypeScript AST Viewer](https://ts-ast-viewer.com) 에 코드를 붙여넣어 보면 노드 구조를 눈으로 확인할 수 있다.

여기서 핵심: **타입 표기(`: string`)도 AST의 일부 노드로 들어간다.** 즉 이 시점까지는 타입 정보가 트리 안에 살아 있다. 사라지는 건 나중(⑤)이다.

---

## 4. ③ Binder — 이름에 정체성 부여 (심볼과 스코프)

AST만으로는 "어떤 `dog`가 어떤 `dog`인지"를 알 수 없다. Binder는 AST를 훑으며 **심볼(Symbol)**을 만들고, 같은 이름이 어느 스코프에 속하는지 연결한다.

```ts
function outer() {
  let dog = "돌돌이";      // 심볼 A
  function inner() {
    let dog = "멍멍이";    // 심볼 B (A와 다른 스코프)
    return dog;            // 이 dog는 심볼 B를 가리킴
  }
}
```

- 각 선언은 고유한 **심볼**이 된다.
- Binder는 선언(declaration)과 사용(usage)을 잇고, 스코프 트리를 구성한다.
- 이 정보가 있어야 다음 단계에서 "이 `dog`의 타입은 무엇인가"를 물을 수 있다.

즉 Binder는 **타입 검사기가 이름을 조회할 수 있도록 준비하는 단계**다.

---

## 5. ④ Type Checker — 타입 검사의 심장

TypeScript의 정체성이 담긴 단계다. Type Checker는 AST + 심볼 정보를 바탕으로 각 노드의 타입을 계산하고, 규칙 위반을 찾아낸다. 핵심 동작 네 가지를 본다.

### 5-1. 타입 추론 (Type Inference)

명시하지 않아도 초깃값을 보고 타입을 **추론**한다.

```ts
let dog = "돌돌이";   // 타입 명시 없음 → string 으로 추론
dog = 10;            // 오류: number를 string 자리에 넣을 수 없음
```

Checker는 `"돌돌이"`가 문자열 리터럴임을 보고 `dog`의 타입을 `string`으로 확정한다. 그래서 이후 `dog = 10`이 규칙 위반이 된다.

### 5-2. 구조적 타입 시스템 (Structural Typing)

TypeScript는 이름이 아니라 **구조(모양)**로 타입 호환성을 판단한다. Java 같은 **명목적(Nominal) 타입 시스템**과 결정적으로 다른 지점이다.

```ts
type Dog = { name: string };

function print(d: Dog) {
  console.log(d.name);
}

const cat = { name: "야옹이", legs: 4 };
print(cat); // 가능! cat이 name: string을 "구조적으로" 만족하므로 OK
```

`cat`은 `Dog`라고 선언한 적이 없지만, `Dog`가 요구하는 프로퍼티(`name: string`)를 **모양상 갖추었으므로** 호환된다. "오리처럼 걷고 오리처럼 우는 것은 오리다(덕 타이핑)"라는 원리다.

이 구조적 판단이 `ts_3.md`에서 다룬 **업캐스팅/다운캐스팅, 집합으로서의 타입**의 밑바탕이다.

### 5-3. 타입 좁히기 (Narrowing)와 제어 흐름 분석

Checker는 코드의 **흐름**을 따라가며 각 지점에서 타입을 더 좁게 재계산한다.

```ts
function f(value: string | number) {
  // 여기서 value 타입: string | number
  if (typeof value === "string") {
    value.toUpperCase();  // 이 블록 안에서는 string 으로 좁혀짐
  } else {
    value.toFixed(2);     // 여기서는 number 로 좁혀짐
  }
}
```

`typeof` 검사문을 만나면 Checker는 각 분기 안에서 `value`가 될 수 있는 타입을 다시 계산한다. 이걸 **제어 흐름 기반 타입 분석(Control Flow Analysis)**이라고 한다.

### 5-4. 타입 오류 보고

규칙 위반을 발견하면 **해당 AST 노드의 위치 정보(줄/열)**와 함께 진단(diagnostic)을 만든다. 이게 우리가 보는 에러 메시지다.

```
error TS2322: Type 'number' is not assignable to type 'string'.
```

> **중요:** 이 모든 검사는 **컴파일 타임에만** 일어난다. 검사가 끝나면 타입은 임무를 다한다.

---

## 6. ⑤ Transformer — 타입 지우기와 다운레벨링

검사를 통과하면(또는 오류를 무시하도록 설정되면) AST를 JS용 AST로 **변환(transform)**한다. 두 가지 일이 일어난다.

### 6-1. 타입 제거 (Type Erasure)

타입 관련 문법을 트리에서 통째로 **삭제**한다. 타입은 검사 단계에서 이미 할 일을 다 했으므로 런타임에는 필요 없기 때문이다.

```ts
// 입력 (.ts)
let dog: string = "돌돌이";

interface Animal {
  name: string;
}

function greet<T>(x: T): T {
  return x;
}
```

```js
// 출력 (.js) — 타입이 전부 사라짐
let dog = "돌돌이";
// interface는 흔적도 없이 통째로 제거됨
function greet(x) {
  return x;
}
```

사라지는 것: 타입 표기(`: string`), `interface` / `type` 선언, 제네릭(`<T>`), `as` 단언, `readonly` 같은 **타입 전용** 문법.

> **이래서 런타임에는 타입으로 분기할 수 없다.** `interface Animal`은 JS에 존재하지 않으므로 `if (x instanceof Animal)` 같은 코드는 쓸 수 없다. 런타임 판별이 필요하면 `typeof`, `in`, 태그 필드(discriminated union) 등 **값 레벨** 수단을 써야 한다.

### 6-2. 다운레벨링 (Downleveling)

`tsconfig.json`의 `target`보다 최신 문법을 쓰면, 낮은 버전 JS로 **변환**한다. 이 프로젝트는 `target: "ESNext"`라 변환이 거의 없지만, 예를 들어 `target: "ES5"`라면:

```ts
// 입력 (target: ES5)
const nums = [1, 2, 3];
const doubled = nums.map((n) => n * 2);   // 화살표 함수
```

```js
// 출력 (ES5) — 화살표 함수가 일반 function으로 변환됨
var nums = [1, 2, 3];
var doubled = nums.map(function (n) { return n * 2; });
```

즉 tsc는 **바벨(Babel)처럼 트랜스파일러 역할**도 겸한다. 타입 제거와 다운레벨링은 원리가 같다: AST를 목표 형태로 다시 쓰는 것.

---

## 7. ⑥ Emitter — AST를 다시 문자열로

마지막으로 Emitter(Printer)가 변환된 JS용 AST를 실제 `.js` **텍스트 파일**로 출력한다. 설정에 따라 함께 나오는 산출물:

| 산출물 | 설명 | 관련 옵션 |
| --- | --- | --- |
| `.js` | 실행 가능한 자바스크립트 | (기본) |
| `.d.ts` | 타입 선언 파일. 다른 프로젝트에 타입 정보만 제공 | `declaration` |
| `.js.map` | 소스맵. 디버깅 시 JS ↔ TS 위치 매핑 | `sourceMap` |

이 프로젝트에서는 `outDir: "dist"` 설정에 따라 `dist/` 폴더에 `.js`가 생성된다.

---

## 8. 정리: `ts_1.md`의 한 줄을 풀어 쓰면

`ts_1.md`의 요약:

> ts → ast → js(or 컴파일 실패 exit) → 기계어

이를 이 문서의 단계로 대응시키면:

| ts_1.md 표현 | 실제 단계 |
| --- | --- |
| `ts →` | ① Scanner → ② Parser |
| `ast` | 생성된 AST + ③ Binder(심볼) |
| `(컴파일 실패 exit)` | ④ Type Checker에서 타입 오류 발생 시 |
| `→ js` | ⑤ Transformer(타입 제거·다운레벨링) → ⑥ Emitter |
| `→ 기계어` | 여기서부터는 **TS의 일이 아님.** Node.js/브라우저의 JS 엔진(V8 등)이 JS를 받아 JIT 컴파일·실행 |

핵심 문장 세 개로 요약:

1. **검사와 변환은 분리되어 있다.** tsc는 타입을 "검사"만 하고, JS를 "만드는" 일은 별개다.
2. **타입은 컴파일 타임에만 존재한다.** ④에서 역할을 다하고 ⑤에서 지워진다. 런타임 JS에는 타입이 없다.
3. **TS는 JS 실행에 관여하지 않는다.** `ts → js`까지가 tsc의 영역이고, `js → 기계어`는 JS 엔진의 몫이다. 그래서 TS를 "JS의 안정성 계층을 얹은 확장판"이라고 부른다.
