// Token Types 
const TKN_INT = 'INT';
const TKN_FLOAT = 'FLOAT';
const TKN_PLUS = 'PLUS';
const TKN_MINUS = 'MINUS';
const TKN_MUL = 'MUL';
const TKN_DIV = 'DIV';
const TKN_EXPONENT = 'EXPONENT';
const TKN_LPAREN = 'LPAREN';
const TKN_RPAREN = 'RPAREN';
const DIGITS = '0123456789';

class token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    toString() {
        return `Token(${this.type}, ${this.value})`;
    }
    
}

export class Lexer {
    constructor(text) {
        this.text = text;
        this.tokens = [];
        this.pos = 0;
    }

    make_number() {
        let num_str = ''
        let dotCount = 0

        while (this.pos < this.text.length && (DIGITS.includes(this.text[this.pos]) || this.text[this.pos] === '.')) {
            if (this.text[this.pos] === '.') {
                dotCount++
            }
            num_str += this.text[this.pos];
            this.pos++;
        }

        if (dotCount === 0) 
            this.tokens.push(new token(TKN_INT, parseInt(num_str))); //hacky?
        else if(dotCount === 1)
            this.tokens.push(new token(TKN_FLOAT, parseFloat(num_str)));
        else
            throw new Error(`Invalid number found: ${num_str}`);
    }

    tokenize() {
        let current_char;
        while (this.pos < this.text.length) {
            current_char = this.text[this.pos];
            if (current_char === ' ') {
                this.pos++;
                continue;
            }

            if (current_char === '+') {
                this.tokens.push(new token(TKN_PLUS, '+'));
                this.pos++;
                continue;
            }

            if (current_char === '-') {
                this.tokens.push(new token(TKN_MINUS, '-'));
                this.pos++;
                continue;
            }

            if (current_char === '*') {
                this.tokens.push(new token(TKN_MUL, '*'));
                this.pos++;
                continue;
            }

            if (current_char === '/') {
                this.tokens.push(new token(TKN_DIV, '/'));
                this.pos++;
                continue;
            }

            if (current_char === '^') {
                this.tokens.push(new token(TKN_EXPONENT, '^'));
                this.pos++;
                continue;
            }

            if (current_char === '(') {
                this.tokens.push(new token(TKN_LPAREN, '('));
                this.pos++;
                continue;
            }

            if (current_char === ')') {
                this.tokens.push(new token(TKN_RPAREN, ')'));
                this.pos++;
                continue;
            }

            if (DIGITS.includes(current_char)) {
                this.make_number();
                continue;
            }

            throw new Error(`Invalid character found: [${current_char}]`);
        }

        return this.tokens;
    }
}

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
        if(tok.type === TKN_INT || tok.type === TKN_FLOAT){
            this.advance();
            return new NumberNode(tok);
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