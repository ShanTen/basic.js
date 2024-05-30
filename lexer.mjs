import { BaseErrorWithPositionInfo, BaseErrorWithStartEndPosInfo } from "./base-error.mjs";
import { TKN_INT, TKN_FLOAT, TKN_PLUS, TKN_MINUS, TKN_MUL, TKN_DIV, TKN_EXPONENT, TKN_LPAREN, TKN_RPAREN, DIGITS} from './token-types.mjs';

const osFlavour = "WindowsNT" //Options are "WindowsNT" or "Unix";
const newLineChar = osFlavour === "WindowsNT" ? '\r\n' : '\n';

class InvalidCharacterError extends BaseErrorWithPositionInfo {
    constructor(character, characterPosition, linePosition, lineString) {
        super('InvalidCharacterError', `Invalid character found: [${character}]`, character, characterPosition, linePosition, lineString);
    }    
}

// class InvalidNumberError extends BaseErrorWithPositionInfo {
//     constructor(number, characterPosition, linePosition, lineString) {
//         super('InvalidNumberError', `Invalid number found: [${number}]`, number, characterPosition, linePosition, lineString);
//     }    
// }

class InvalidNumberError extends BaseErrorWithStartEndPosInfo {
    constructor(number, start, end, linePosition, lineString) {
        super('InvalidNumberError', `Invalid number found: [${number}]`, start, end, linePosition, lineString);
    }        
}


class token {
    constructor(type, value, pos_start=null, pos_end=null, line_number=null) {
        this.type = type;
        this.value = value;

        if (pos_start || pos_start === 0) {
            this.pos_start = pos_start;
            this.pos_end = this.pos_start + 1;
        }

        if (pos_end) 
            this.pos_end = pos_end;

        if (line_number)
            this.line_number = line_number;
    }

    toString() {

        if(this.line_number){
            if(pos_start && pos_end)
                return `Token(${this.type}, ${this.value}, pos_start=${this.pos_start}, pos_end=${this.pos_end}, line_number=${this.line_number})`;
            else
                return `Token(${this.type}, ${this.value}, line_number=${this.line_number})`;
        }
        else
            return `Token(${this.type}, ${this.value})`;

    }
    
}


export class Lexer {
    constructor(text) {
        this.text = text;
        this.tokens = [];
        this.pos = 0;
        this.lineNumber = 1;
        this.pos_in_line = 0;
        this.lineStr = ""
    }

    get_lines_array(){
        return this.text.split(newLineChar);
    }

    get_line_string(){
        return this.get_lines_array()[this.lineNumber-1];
    }

    go_to_next_line() {
        this.lineNumber++;
        this.pos_in_line = 0;
    }

    advance() {
        this.pos++;
        this.pos_in_line++;
    }

    make_number() {
        let num_str = ''
        let dotCount = 0

        //this is very stupid, my fault for using an equally stupid language
        let initialPosition = JSON.parse(JSON.stringify(this.pos_in_line));

        while (this.pos < this.text.length && (DIGITS.includes(this.text[this.pos]) || this.text[this.pos] === '.')) {
            if (this.text[this.pos] === '.') {
                dotCount++
            }
            num_str += this.text[this.pos];
            this.advance();
        }

        if (dotCount === 0) 
            this.tokens.push(new token(TKN_INT, parseInt(num_str), initialPosition, this.pos_in_line, this.lineNumber)); //hacky?
        else if(dotCount === 1)
            this.tokens.push(new token(TKN_FLOAT, parseFloat(num_str), initialPosition, this.pos_in_line, this.lineNumber));
        else{
            throw new InvalidNumberError(num_str, initialPosition, this.pos_in_line, this.lineNumber, this.lineStr);
        }
            
    }

    tokenize() {
        let current_char;
        while (this.pos < this.text.length) {
            current_char = this.text[this.pos];
            this.lineStr = this.get_line_string();

            if(current_char === '\r'){
                this.advance();
                continue;
            }

            if(current_char === '\n'){
                this.go_to_next_line();
                this.advance();
                continue;
            }

            if (current_char === ' ') {
                this.advance();
                continue;
            }

            if (current_char === '+') {
                this.tokens.push(new token(TKN_PLUS, '+', this.pos_in_line, this.pos_in_line+1, this.lineNumber));
                this.advance();
                continue;
            }

            if (current_char === '-') {
                this.tokens.push(new token(TKN_MINUS, '-', this.pos_in_line, this.pos_in_line+1, this.lineNumber));
                this.advance();
                continue;
            }

            if (current_char === '*') {
                this.tokens.push(new token(TKN_MUL, '*', this.pos_in_line, this.pos_in_line+1, this.lineNumber));
                this.advance();
                continue;
            }

            if (current_char === '/') {
                this.tokens.push(new token(TKN_DIV, '/', this.pos_in_line, this.pos_in_line+1, this.lineNumber));
                this.advance();
                continue;
            }

            if (current_char === '^') {
                this.tokens.push(new token(TKN_EXPONENT, '^', this.pos_in_line, this.pos_in_line+1, this.lineNumber));
                this.advance();
                continue;
            }

            if (current_char === '(') {
                this.tokens.push(new token(TKN_LPAREN, '(', this.pos_in_line, this.pos_in_line+1, this.lineNumber));
                this.advance();
                continue;
            }

            if (current_char === ')') {
                this.tokens.push(new token(TKN_RPAREN, ')', this.pos_in_line, this.pos_in_line+1, this.lineNumber));
                this.advance();
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