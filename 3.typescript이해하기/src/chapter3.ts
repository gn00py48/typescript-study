/**
 * 기본 타입 간의 호환성
 */
let num1: number = 10;
let num2: 10 = 10;

num1 = num2; // 업캐스팅 가능
// num2 = num1; // 다운캐스팅 불가능

/**
 * 객체 타입 간의 호환성
 * 프로퍼티가 적은 타입이 슈퍼 타입이다.
 */
type Animal = {
  name: string;
  color: string;
};

type Dog = {
  name: string;
  color: string;
  breed: string;
};

let animal: Animal = {
  name: "기린",
  color: "yellow",
};

let dog: Dog = {
  name: "돌돌이",
  color: "brown",
  breed: "진도",
};

animal = dog; // Dog -> Animal 업캐스팅 가능
// dog = animal; // Animal -> Dog 다운캐스팅 불가능

type Book = {
  name: string;
  price: number;
};

type ProgrammingBook = {
  name: string;
  price: number;
  skill: string;
};

let book: Book;
let programmingBook: ProgrammingBook = {
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
let book2: Book = {
  name: "한 입 크기로 잘라먹는 리액트",
  price: 33000,
  // skill: "reactjs", // Book에 없는 프로퍼티이므로 오류
};

let book3: Book = programmingBook; // 변수로 할당하면 허용

function func(book: Book) {}

func({
  name: "한 입 크기로 잘라먹는 리액트",
  price: 33000,
  // skill: "reactjs", // 객체 리터럴을 직접 전달하므로 오류
});

func(programmingBook); // 변수로 전달하면 허용
