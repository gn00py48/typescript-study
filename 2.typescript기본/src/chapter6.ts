// any: 확실하지 않을 때 광역기 - 쓰지 마
let anyVar: any = 10;

let num: number = 10;
num = anyVar;

// unknown: any보다 안전한 광역기 - 타입 확인 후 사용
let unknownVar: unknown;

unknownVar = "";
unknownVar = 1;
unknownVar = () => {};

if (typeof unknownVar === "number") {
  num = unknownVar;
}