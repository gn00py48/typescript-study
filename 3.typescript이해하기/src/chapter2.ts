/**
 * unknown 타입
 * 모든 타입의 값을 저장할 수 있지만, 다른 타입의 변수에는 할당할 수 없다.
 */
function unknownExam() {
  let a: unknown = 1;
  let b: unknown = "hello";
  let c: unknown = true;
  let d: unknown = null;
  let e: unknown = undefined;

  let unknownVar: unknown;

  // let num: number = unknownVar;
  // let str: string = unknownVar;
  // let bool: boolean = unknownVar;
}

/**
 * never 타입
 * 어떤 값도 저장할 수 없으며, 모든 타입의 변수에 할당할 수 있다.
 */
function neverExam() {
  function neverFunc(): never {
    while (true) {}
  }

  let num: number = neverFunc();
  let str: string = neverFunc();
  let bool: boolean = neverFunc();

  // let never1: never = 10;
  // let never2: never = "string";
  // let never3: never = true;
}

/**
 * void 타입
 * 아무것도 반환하지 않는 함수의 반환 타입으로 사용한다.
 */
function voidExam() {
  function voidFunc(): void {
    console.log("hi");
  }

  let voidVar: void = undefined;
}

/**
 * any 타입
 * 타입 계층을 대부분 무시하지만 never 타입에는 할당할 수 없다.
 */
function anyExam() {
  let unknownVar: unknown;
  let anyVar: any;
  let undefinedVar: undefined;
  let neverVar: never;

  anyVar = unknownVar;
  undefinedVar = anyVar;

  // neverVar = anyVar;
}
