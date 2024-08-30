import { Stack } from "./data-structures"

export class Interpreter 
{
    constructor (AST){
        this.AST = AST
    }

    isDeadEnd(node){
        if(node.value)
            return true
        return false
    }

    resolve(LRobject){
        


    }

    visit(node){
        // different visit method for each node type
        // visit binop node
        // visit num node
        // work on this 29/08/2024        



    }

    processAST(){

        // console.log(JSON.stringify(this.AST, null, 2))
    }

    shuntingYardArithmetic(){
        /* 
            We are going to get the input as AST which is in "some" kind of format 
        */

        
        




    }

    processSingletonHack(){
        //singleton refers to a single non-nested left node, right node and operator.
        let _left = this.AST.leftNode
        let _right = this.AST.rightNode
        let _op = this.AST.operator



        /*hack would be to use eval...but we are not going to use that, 
        instead plain if and bodmas in the final version
        */        
    }

    process(){
        //note: for nested operations, the innermost "BinOp" is executed first
    }
}   