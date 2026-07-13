type User = {
    id: number;
    name: string;
    nickname: string;
    birth: string;
    bio: string;
    location: string;
};

function test() {
    type User = string;
}

// type User = {
//     id: number;
//     name: string;
//     nickname: string;
//     birth: string;
//     bio: string;
//     location: string;
// }; 중복 선언 안됩니다~~

let user: User = {
    id: 1,
    name: "이정환",
    nickname: "winterlood",
    birth: "1997.01.07",
    bio: "안녕하세요",
    location: "부천시",
};

let user2: User = {
    id: 2,
    name: "홍길동",
    nickname: "winterlood",
    birth: "1997.01.07",
    bio: "안녕하세요",
    location: "부천시",
};

// 인덱스 시그니처
type CountryCodes = {
    [key: string]: string;
};