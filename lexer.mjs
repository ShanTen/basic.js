/*Lexer re-write from scratch to implement proper line support using lines.mjs*/

import { BaseErrorWithPositionInfo, BaseErrorWithStartEndPosInfo } from "./base-error.mjs";
import { TKN_EOS, TKN_EOF ,TKN_INT, TKN_FLOAT, TKN_PLUS, TKN_MINUS, TKN_MUL, TKN_DIV, TKN_EXPONENT, TKN_LPAREN, TKN_RPAREN, DIGITS} from './token-types.mjs';

class InvalidCharacterError extends BaseErrorWithPositionInfo {
    constructor(character, characterPosition, linePosition, lineString) {
        super('InvalidCharacterError', `Invalid character found: [${character}]`, character, characterPosition, linePosition, lineString);
    }    
}

class InvalidNumberError extends BaseErrorWithStartEndPosInfo {
    constructor(number, start, end, linePosition, lineString) {
        super('InvalidNumberError', `Invalid number found: [${number}]`, start, end, linePosition, lineString);
    }        
}

/**
 * A token object takes in two required arguments, type and value, and three optional arguments, pos_start, pos_end, and line_number.
 * @param {string} type - The type of token.
 * @param {string} value - The value of the token.
 * @param {number} pos_start - The starting position of the token.
 * @param {number} pos_end - The ending position of the token.
 * @param {number} line_number - The line number of the token.
 * @returns {object} - A token object.
 * @example
 * let myToken = new token(TKN_PLUS, '+', 0, 1, 1);
 */
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
            if(this.pos_start && this.pos_end)
                return `Token(${this.type}, ${this.value}, pos_start=${this.pos_start}, pos_end=${this.pos_end}, line_number=${this.line_number})`;
            else
                return `Token(${this.type}, ${this.value}, line_number=${this.line_number})`;
        }
        else
            return `Token(${this.type}, ${this.value})`;

    }
    
}

export class Lexer {
    /*
        The lexer has no clue where the line starts and ends. 
        It just gets a string of text, it tracks the character position though, calls it "pos".

        When it passes pos to a lineHandler method called get_position_in_line, it gets back a tuple of line number and position in line.
        lineHandler.get_position_in_line(pos) => [line, pos_in_line]

        The lexer has a method called advance, which increments the pos by 1.
    */

    constructor(text, lineHandler){
        this.text = text;
        this.tokens = [];
        this.pos = 0;
        this.lineHandler = lineHandler;
    }

    advance() {
        this.pos++;
    }

    get_position_in_line(){
        return this.lineHandler.get_position_in_line(this.pos);
    }

    make_number() {
        let num_str = ''
        let dotCount = 0

        //this is the position in line
        let _posInLine = this.get_position_in_line()[1];

        //this is very stupid, my fault for using an equally stupid language
        let initialPosition = JSON.parse(JSON.stringify(_posInLine));

        while (this.pos < this.text.length && (DIGITS.includes(this.text[this.pos]) || this.text[this.pos] === '.')) {
            if (this.text[this.pos] === '.') {
                dotCount++
            }
            num_str += this.text[this.pos];
            this.advance();
        }

        if (dotCount === 0) 
            this.tokens.push(new token(
                TKN_INT, 
                parseInt(num_str), 
                initialPosition, 
                this.get_position_in_line()[1], 
                this.get_position_in_line()[0]
            )); //hacky?
        else if(dotCount === 1)
            this.tokens.push(new token(TKN_FLOAT, parseFloat(num_str), initialPosition, this.pos_in_line, this.lineNumber));
        else{
            throw new InvalidNumberError(

                num_str, 
                initialPosition, 
                this.get_position_in_line()[1], 
                this.get_position_in_line()[0],

                this.lineHandler.get_line_string(this.get_position_in_line()[0]) //what the fuck


            );
        }
            
    }


    tokenize(){
        let current_char;
        while (this.pos < this.text.length) {
            current_char = this.text[this.pos];
            let [_line, _posInLine] = this.lineHandler.get_position_in_line(this.pos);

            if(current_char === '\r'){
                this.advance();
                continue
            }

            if(current_char === '\n'){
                this.advance();
                continue
            }

            if (current_char === ' ') {
                this.advance();
                continue;
            }

            if(current_char === ';'){
                this.tokens.push(new token(
                    TKN_EOS,
                    ';',
                    _posInLine, 
                    _posInLine+1, 
                    _line                    
                ))
                this.advance();
                continue;
            }

            if (current_char === '+') {

                this.tokens.push(new token(
                    TKN_PLUS, 
                    '+', 
                    _posInLine, 
                    _posInLine+1, 
                    _line
                ));

                this.advance();
                continue;
            }

            if (current_char === '-') {

                this.tokens.push(new token(
                    TKN_MINUS, 
                    '-', 
                    _posInLine, 
                    _posInLine+1, 
                    _line
                ));

                this.advance();
                continue;
            }

            if (current_char === '*') {

                this.tokens.push(new token(
                    TKN_MUL, 
                    '*', 
                    _posInLine, 
                    _posInLine+1, 
                    _line
                ));

                this.advance();
                continue;
            }

            if (current_char === '/') {

                this.tokens.push(new token(
                    TKN_DIV, 
                    '/', 
                    _posInLine, 
                    _posInLine+1, 
                    _line
                ));

                this.advance();
                continue;
            }

            if (current_char === '^') {

                this.tokens.push(new token(
                    TKN_EXPONENT, 
                    '^', 
                    _posInLine, 
                    _posInLine+1, 
                    _line
                ));

                this.advance();
                continue;
            }

            if (current_char === '(') {

                this.tokens.push(new token(
                    TKN_LPAREN, 
                    '(', 
                    _posInLine, 
                    _posInLine+1, 
                    _line
                ));

                this.advance();
                continue;
            }

            if (current_char === ')') {

                this.tokens.push(new token(
                    TKN_RPAREN, 
                    ')', 
                    _posInLine, 
                    _posInLine+1, 
                    _line
                ));

                this.advance();
                continue;
            }

            if (DIGITS.includes(current_char)) {
                this.make_number();
                continue;
            }

            throw new InvalidCharacterError(
                current_char, 
                this.get_position_in_line()[1],
                this.get_position_in_line()[0],
                this.lineHandler.get_line_string(_line)
            );

        }

        this.tokens.push(new token(TKN_EOF, null, this.pos, this.pos+1, this.lineHandler.get_position_in_line()[0]));
        return this.tokens;
    }
}
