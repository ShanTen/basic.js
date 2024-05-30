import { TKN_EOF, TKN_INT, TKN_FLOAT, TKN_PLUS, TKN_MINUS, TKN_MUL, TKN_DIV, TKN_EXPONENT, TKN_LPAREN, TKN_RPAREN, DIGITS} from './token-types.mjs';
import { BaseErrorWithPositionInfo, BaseErrorWithStartEndPosInfo } from './base-error.mjs';


//////////// Error classes //////////////

class InvalidNumberError extends BaseErrorWithStartEndPosInfo {
    constructor(number, start, end, linePosition, lineString) {
        super('InvalidNumberError', `Invalid number found: [${number}]`, start, end, linePosition, lineString);
    }        
}

class InvalidSyntaxError extends BaseErrorWithStartEndPosInfo {
    constructor(token, start, linePosition, lineString) {
        super('InvalidSyntaxError', `Invalid syntax found: [${token.value}]`, start, token.pos_end, linePosition, lineString);
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
    constructor(error=null, node=null){
        this.error = error;
        this.node = node;
    }

    register(res){
        if(typeof res === ParseResult){
            if(res.error) 
                this.error = res.error;
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
    constructor(tokens, lines){
        this.tokens = tokens;
        this.tokenIndex = -1;
        this.currentToken = null
        this.AST = null;
        this.advance();
        this.lines = lines
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
            //Probably an invalid number
            throw res.failure(new InvalidNumberError(tok.value, tok.pos_start, tok.pos_end, tok.line_number, tok.line_string));
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
        let res = new ParseResult();
        let leftTerm = res.register(func());
        if(res.error) return res; //should be res

        while(ops.includes(this.currentToken.type)){
            let op = this.currentToken;
            res.register(this.advance());
            let right = res.register(func());
            if(res.error) return res; 
            leftTerm = new binaryOperator(leftTerm, op, right);
        }
        return leftTerm;
    }

    parse(){
        let res = this.expr();
        // console.log(res);
        if(!res.error && this.currentToken.type !== TKN_EOF){
            console.log(this.currentToken);
            console.log(this.tokens[this.tokenIndex-1])
            throw new InvalidSyntaxError(this.currentToken, this.currentToken.pos_start, this.currentToken.line_number, this.lines.get_line_string(this.currentToken.line_number));
        }
        this.AST = res;
        return this.AST;
    }

}