// quiz1 : 초과 프로퍼티 검사를 방지하기 위한 객체 단언 
type Person = {
  name: string;
  age: number;
};

let person: Person = {} as Person;

// quiz 2 : const 단언
let value = 10 as const;
giveMe10(value);

function giveMe10(value: 10) {
    return value;
}

// quiz3 : 
/*
[ 문제 소개 ]
다음 요구사항을 만족하는 코드를 작성하세요
- CompanyMember 타입을 Boss와 Employee의 서로소 유니온 타입으로 정의하세요
*/
type Boss = {
    tag: "보스";
  car: string;
};

type Employee = {
    tag: "직원";
  salary: number;
};

type CompanyMember = Employee | Boss;

function whoAmI(Member: CompanyMember){
    switch(Member.tag){
        case "보스": {
            console.log(`뛰뛰빵빵 ${Member.car} 비켜나세여~`);
            break;
        }
        case "직원" :{
            console.log(`내 월급은 ${Member.salary}원 이라네~`);
            break;
        }

    }
}

