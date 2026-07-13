/**
 * 기본 타입 간의 호환성
 */
let num1 = 10;
let num2 = 10;
num1 = num2; // 업캐스팅 가능
let animal = {
    name: "기린",
    color: "yellow",
};
let dog = {
    name: "돌돌이",
    color: "brown",
    breed: "진도",
};
animal = dog; // Dog -> Animal 업캐스팅 가능
let book;
let programmingBook = {
    name: "한 입 크기로 잘라먹는 리액트",
    price: 33000,
    skill: "reactjs",
};
book = programmingBook; // 업캐스팅 가능
// programmingBook = book; // 다운캐스팅 불가능
/**
 * 초과 프로퍼티 검사
 * 객체 리터럴을 직접 할당하거나 인수로 전달할 때 발생한다.
 */
let book2 = {
    name: "한 입 크기로 잘라먹는 리액트",
    price: 33000,
    // skill: "reactjs", // Book에 없는 프로퍼티이므로 오류
};
let book3 = programmingBook; // 변수로 할당하면 허용
function func(book) { }
func({
    name: "한 입 크기로 잘라먹는 리액트",
    price: 33000,
    // skill: "reactjs", // 객체 리터럴을 직접 전달하므로 오류
});
func(programmingBook); // 변수로 전달하면 허용
export {};
