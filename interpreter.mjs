// import { Stack } from "./data-structures" // for a shunting yard algorithm implementation, now abandoned

export class Interpreter 
{
    visit(node){
        // different visit method for each node type
        // visit binop node
        // visit num node
        // work on this 29/08/2024        -- kys (19/09/2024)

        // console.log(node)
        let type_node = node.constructor.name
        let method_name = `visit_${type_node}`
        // console.log(this[method_name])
        let method = this[method_name] || this.no_visit_method(node)
        method.bind(this)(node)
        
    }

    no_visit_method(node){
        throw new Error(`No visit_${node.constructor.name} method`)
    }

    visit_NumberNode(node){
        console.log("Found number node")
    }

    visit_BinaryOperator(node){
        console.log("Found binary operator node")
        console.log(this)
        this.visit(node.leftNode)
        this.visit(node.rightNode)
    }


}   

