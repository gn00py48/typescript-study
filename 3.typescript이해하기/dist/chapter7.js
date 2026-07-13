function func(value) {
    if (typeof value === "number") {
        // value: number
        console.log(value.toFixed());
    }
    else if (typeof value === "string") {
        // value: string
        console.log(value.toUpperCase());
    }
    else if (value instanceof Date) {
        // value: Date
        console.log(value.getTime());
    }
    else if (value && "age" in value) {
        // value: Person
        console.log(`${value.name}은 ${value.age}살 입니다`);
    }
}
export {};
