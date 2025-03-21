//example of classes, inheritance, method overriding (polymorphism)



class Person {
    constructor(name, age, gender){
        this.name = name
        this.age = age 
        this.gender = gender
    }
    selfIntro(){
        console.log(`${this.name}'s age is ${this.age} and the gender is ${this.gender}.`)
    }
}
class Professor extends Person{
    constructor(name, age, gender, teaches){
        super(name, age, gender)
        this.teaches = teaches
    }

    grade(paper){
        console.log(`grading paper : ${paper} `)
    }
}

console.log(Object.getPrototypeOf(Math))
class Student extends Person{
    constructor(name, age, gender, yearOfAddmission){
        super(name, gender, age)
        this.yearOfAddmission = yearOfAddmission
    }

}


const yashesh = new Professor('yashesh', 21, 'male', 'maths')
console.log(yashesh.teaches)
yashesh.selfIntro()
yashesh.grade(12)

const hari = new Student('hari', 20, 'male' ,2021)
console.log(hari.yearOfAddmission)
hari.selfIntro()