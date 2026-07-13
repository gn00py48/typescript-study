//enum: 열거형 -> 꺼내서 쓴다
enum Role {
  ADMIN,
  USER,
  GUEST,
}

enum Language {
  korean = "ko",
  english = "en",
}

const user1 = {
  name: "이정환",
  role: Role.ADMIN, 
  language: Language.korean,
};

const user2 = {
  name: "홍길동",
  role: Role.USER,
  language: Language.english,
};

const user3 = {
  name: "아무개",
  role: Role.GUEST, 
};

console.log(user1, user2, user3);