let numArr: number[] = [1, 2, 3];
let strArr: string[] = ["hello", "im", "winterlood"];
let boolArr: Array<boolean> = [true, false, true];

// 배열에 2개 이상의 타입을 넣고 싶다면
let multiArr: (number | string)[] = [1, "hello"];

// 다차원 배열
let doubleArr: number[][] = [
    [1, 2, 3],
    [4, 5],
];

// 튜플 - 길이와 크기가 선언된 배열
let tup1: [number, number] = [1, 2];

let tup2: [number, string, boolean] = [1, "2", true];

const users: [string, number][] = [
    ["이정환", 1],
    ["이아무개", 2],
    ["김아무개", 3],
    ["박아무개", 4],
    //   [5, "최아무개"], 하면 안됩니다
];