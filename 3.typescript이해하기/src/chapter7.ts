/**
 * 타입 좁히기
 * 타입 가드를 이용해 넓은 타입을 상황에 맞는 좁은 타입으로 만든다.
 */
type Person = {
  name: string;
  age: number;
};

function func(value: number | string | Date | null | Person) {
  if (typeof value === "number") {
    // value: number
    console.log(value.toFixed());
  } else if (typeof value === "string") {
    // value: string
    console.log(value.toUpperCase());
  } else if (value instanceof Date) {
    // value: Date
    console.log(value.getTime());
  } else if (value && "age" in value) {
    // value: Person
    console.log(`${value.name}은 ${value.age}살 입니다`);
  }
}
