import { BaseErrorWithPositionInfo } from "./base-error.mjs";
import { TKN_INT, TKN_FLOAT, TKN_PLUS, TKN_MINUS, TKN_MUL, TKN_DIV, TKN_EXPONENT, TKN_LPAREN, TKN_RPAREN, DIGITS} from './token-types.mjs';

class InvalidCharacterError extends BaseErrorWithPositionInfo {
    constructor(character, characterPosition, linePosition, lineString) {
        super('InvalidCharacterError', `Invalid character found: [${character}]`, character, characterPosition, linePosition, lineString);
    }    
}

class InvalidNumberError extends BaseErrorWithPositionInfo {
    constructor(number, characterPosition, linePosition, lineString) {
        super('InvalidNumberError', `Invalid number found: [${number}]`, number, characterPosition, linePosition, lineString);
    }    
}

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
            throw new InvalidNumberError(num_str, this.pos, 1, this.text); //hacky? ToDO - change linePosition later
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

            throw new InvalidCharacterError(current_char, this.pos, 1, this.text); //hacky? ToDO - change linePosition later
        }

        return this.tokens;
    }
}