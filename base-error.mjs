/*
    Function approach seems convoluted and misleading based off what I've read, 
    I will be implementing all errors as classes that modify the Error class
*/

export class BaseError extends Error {
    constructor(message, name) {
        super(message);
        this.name = name;
    }

    toString() {
        return `${this.name}: ${this.message}`;
    }
}

export class SyntaxError extends BaseError {
    constructor(message) {
        super(message, 'SyntaxError');
    }
}

export class BaseErrorWithPositionInfo extends BaseError {
    constructor(name, message, character, characterPosition, linePosition, lineString) {
        super(message, name);
        this.character = character;
        this.characterPosition = characterPosition;
        this.linePosition = linePosition;
        this.lineString = lineString;
        this.errorMarker = '';
    }

    setErrorMarker(){
        for(let i = 0; i < this.characterPosition; i++){
            this.errorMarker += '-';
        }
        this.errorMarker += '^';
    }

    toString() {
        this.setErrorMarker();
        //Prajol suggestion
        let line2 = `${this.linePosition}\t${this.lineString}\n\t${this.errorMarker}`;
        return `${this.name}: ${this.message} at position ${this.characterPosition} in line ${this.linePosition}:\n\n${line2}`;
    }
}

export class BaseErrorWithStartEndPosInfo extends Error {
    constructor(name, message, start, end, linePosition, lineString) {
        super(message);
        this.name = name;
        this.start = start;
        this.end = end;
        this.linePosition = linePosition;
        this.lineString = lineString;
    }

    toString() {
        let line2 = `${this.linePosition}\t${this.lineString}\n\t`;
        for(let i = 0; i < this.start; i++){
            line2 += '-';
        }
        for(let i = this.start; i < this.end; i++){
            line2 += '^';
        }
        return `${this.name}: ${this.message} at position ${this.start} to ${this.end} in line ${this.linePosition}:\n\n${line2}`;
    }
}

export class InvalidCharacterError extends BaseErrorWithPositionInfo {
    constructor(character, characterPosition, linePosition, lineString) {
        super('InvalidCharacterError', `Invalid character found: [${character}]`, character, characterPosition, linePosition, lineString);
    }    
}

class InvalidNumberError extends BaseErrorWithStartEndPosInfo {
    constructor(number, start, end, linePosition, lineString) {
        super('InvalidNumberError', `Invalid number found: [${number}]`, start, end, linePosition, lineString);
    }        
}

function Demo(){
    try{
        let line = `124.24.1 + 393 + 292`
        throw new InvalidNumberError('124.24.1', 0, 7, 1, line);
    }
    catch(e){
        console.log(e.toString());
    }
}

//Demo();