/**
 * 타입 단언
 */
type Person = {
  name: string;
  age: number;
};

let person = {} as Person;
person.name = "이정환";
person.age = 27;

type Dog = {
  name: string;
  color: string;
};

let dog = {
  name: "돌돌이",
  color: "brown",
  breed: "진도",
} as Dog;

// A as B는 A와 B가 슈퍼-서브 타입 관계일 때 가능하다.
let num1 = 10 as never;
let num2 = 10 as unknown;

// 다중 단언은 가능하지만 안전하지 않으므로 피하는 것이 좋다.
let num3 = 10 as unknown as string;

/**
 * const 단언
 */
let num4 = 10 as const; // 10

let cat = {
  name: "야옹이",
  color: "yellow",
} as const;

// cat.name = "멍멍이"; // readonly이므로 오류

/**
 * Non-null 단언
 */
type Post = {
  title: string;
  author?: string;
};

let post: Post = {
  title: "게시글1",
  author: "이정환",
};

const len: number = post.author!.length;
