/**
 * 대수 타입
 * 여러 타입을 합성해 만든 타입으로 Union과 Intersection이 있다.
 */
/**
 * 1. 합집합 타입 - Union
 */
let a;
a = 1;
a = "hello";
a = true;
let arr = [1, "hello", true];
let union1 = {
    name: "돌돌이",
    color: "brown",
};
let union2 = {
    name: "이정환",
    language: "한국어",
};
let union3 = {
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
let variable; // 두 타입의 교집합이 없어 never가 됨
let intersection1 = {
    name: "이정환",
    color: "brown",
    language: "한국어",
};
export {};
