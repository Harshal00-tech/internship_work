class Person {
    constructor(name, age){
        this.name = name
        this.age = age
    }
    greet(){
        return `hello this is ${this.name} and my age is ${this.age}.`
    }
}


export default Person