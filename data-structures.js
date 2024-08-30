class Stack{
    constructor(){
        this.data = [];
    }

    push(record){
        this.data.push(record);
    }

    pop(){
        return this.data.pop();
    }

    peek(){
        return this.data[this.data.length - 1];
    }
}

class Queue{
    constructor(){
        this.data = [];
    }

    add(record){
        this.data.unshift(record);
    }

    remove(){
        return this.data.pop();
    }

    peek(){
        return this.data[this.data.length - 1];
    }
}

module.exports = { Stack, Queue };