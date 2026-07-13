/**
 * 1. 타입 추론
 */
let a = 10; // number
let b = "hello"; // string
let c = {
    id: 1,
    name: "이정환",
    profile: {
        nickname: "winterlood",
    },
    urls: ["https://winterlood.com"],
};
// 구조 분해 할당도 각 값의 타입을 추론한다.
let { id, name, profile } = c;
let [one, two, three] = [1, "hello", true];
// 기본값으로 매개변수 타입을, return 문으로 반환 타입을 추론한다.
function func(message = "hello") {
    return message;
}
// 초기값이 없는 변수는 할당되는 값에 따라 타입이 변화한다.
let d;
d = 10;
d.toFixed();
d = "hello";
d.toUpperCase();
// d.toFixed(); // 현재 string이므로 오류
// const는 값이 변하지 않으므로 리터럴 타입으로 추론한다.
const num = 10; // 10
const str = "hello"; // "hello"
// 배열 요소들의 최적 공통 타입을 추론한다.
let arr = [1, "string"]; // (string | number)[]
export {};
