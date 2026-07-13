// void : 반환 값이 없는 함수를 대상으로 사용
function func1(): string {
  return "hello";
}

function func2(): void {
  console.log("hello");
}

// never : 존재 X 불가능함
function func3(): never {
  while (true) {}
}
function func4(): never {
  throw new Error();
}

let anyVar: any;

let a: never;