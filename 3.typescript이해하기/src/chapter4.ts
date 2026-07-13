/**
 * 대수 타입
 * 여러 타입을 합성해 만든 타입으로 Union과 Intersection이 있다.
 */

/**
 * 1. 합집합 타입 - Union
 */
let a: string | number | boolean;

a = 1;
a = "hello";
a = true;

let arr: (number | string | boolean)[] = [1, "hello", true];

type Dog = {
  name: string;
  color: string;
};

type Person = {
  name: string;
  language: string;
};

type Union = Dog | Person;

let union1: Union = {
  name: "돌돌이",
  color: "brown",
};

let union2: Union = {
  name: "이정환",
  language: "한국어",
};

let union3: Union = {
  name: "이정환",
  color: "brown",
  language: "한국어",
};

// 어느 타입의 구조도 만족하지 못하므로 오류
// let union4: Union = {
//   name: "이정환",
// };

/**
 * 2. 교집합 타입 - Intersection
 */
let variable: number & string; // 두 타입의 교집합이 없어 never가 됨

type Intersection = Dog & Person;

let intersection1: Intersection = {
  name: "이정환",
  color: "brown",
  language: "한국어",
};
