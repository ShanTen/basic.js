import { TKN_INT, TKN_FLOAT, TKN_PLUS, TKN_MINUS, TKN_MUL, TKN_DIV, TKN_EXPONENT, TKN_LPAREN, TKN_RPAREN, DIGITS} from './token-types.mjs';

class NumberNode {
    constructor(token) {
        this.value = token.value;
    }

    toString() {
        return `Num(${this.value})`;
    }
}

class binaryOperator {
    constructor(leftNode, operator, rightNode) {
        this.leftNode = leftNode;
        this.rightNode = rightNode;
        this.operator = operator;
    }

    toString() {
        return `BinOp(${this.leftNode}, ${this.operator}, ${this.rightNode})`;
    }
}

export class Parser{
    constructor(tokens){
        this.tokens = tokens;
        this.tokenIndex = -1;
        this.currentToken = null
        this.AST = null;
        this.advance();
    }

    advance(){
        this.tokenIndex++;
        if (this.tokenIndex < this.tokens.length){
            this.currentToken = this.tokens[this.tokenIndex];
        }
    }

    factor(){
        let tok = this.currentToken;
        if(tok.type === TKN_PLUS || tok.type === TKN_MINUS ){
            this.advance();

        }
        else if(tok.type === TKN_INT || tok.type === TKN_FLOAT){
            this.advance();
            return new NumberNode(tok);
        }
        else {
            //throw error
            console.log("syntax error")
        }
    }

    term(){
        //multiply and divide operators
        return this.binop(this.factor.bind(this), [TKN_MUL, TKN_DIV, TKN_EXPONENT]);
    }

    expr(){
        //addition and subtraction operators
        return this.binop(this.term.bind(this), [TKN_PLUS, TKN_MINUS]);
    }

    binop(func, ops){
        let leftTerm = func();
        while(ops.includes(this.currentToken.type)){
            let op = this.currentToken;
            this.advance();
            let right = func();
            leftTerm = new binaryOperator(leftTerm, op, right);
        }
        return leftTerm;
    }

    parse(){
        this.AST = this.expr();
        return this.AST;
    }

}

export class BetterParser{
    constructor(tokens){
        this.tokens = tokens 
    }       
}