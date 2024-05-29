import { TKN_INT, TKN_FLOAT, TKN_PLUS, TKN_MINUS, TKN_MUL, TKN_DIV, TKN_EXPONENT, TKN_LPAREN, TKN_RPAREN, DIGITS} from './token-types.mjs';
import { BaseErrorWithPositionInfo } from './base-error.mjs';

//////////// Error classes //////////////

class InvalidNumberError extends BaseErrorWithPositionInfo {
    constructor(num_str, linePosition, lineNum, text){
        super('InvalidNumberError', `Invalid number found: [${num_str}]`, num_str, linePosition, lineNum, text);
    }
}

class InvalidSyntaxError extends BaseErrorWithPositionInfo {
    constructor(token, linePosition, lineNum, text){
        super('InvalidSyntaxError', `Invalid syntax found near: [${token}]`, token, linePosition, lineNum, text);
    }
}

//////////// Parser Helper classes //////////////

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

class ParseResult{
    constructor(){
        this.error = error;
        this.node = node;
    }

    register(res){
        if(typeof res === ParseResult){
            if(res.error) this.error = res.error;
            return res.node;
        }
        return res;
    }

    success(node){
        this.node = node;
        return this;
    }

    failure(error){
        this.error = error;
        return this;
    }
}

//////////// Parser Class //////////////

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
            return this.currentToken;
        }
        return null;
    }

    factor(){
        let res = new ParseResult();

        let tok = this.currentToken;
        if(tok.type === TKN_PLUS || tok.type === TKN_MINUS ){
            res.register(this.advance());
        }
        else if(tok.type === TKN_INT || tok.type === TKN_FLOAT){
            res.register(this.advance());
            return res.success(new NumberNode(tok));
        }
        else {
            return res.failure(new InvalidSyntaxError(tok, tok.linePosition, tok.lineNum, tok.text));
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