export class Interpreter 
{
    constructor (AST){
        this.AST = AST.node
    }

    visit(node){
        // visit binop node
        // visit num node
        
    }

    processAST(){
    console.log(JSON.stringify(this.AST, null, 2))
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