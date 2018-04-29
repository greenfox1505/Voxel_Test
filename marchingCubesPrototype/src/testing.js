class test {
    constructor(name) {
        this.name = name
        debugger
    }
    dup(){
        return new test(this.name + " DUP!")
    }
}


let a = new test("temp")
let b = a.dup()