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

export class InvalidCharacterError extends BaseErrorWithPositionInfo {
    constructor(character, characterPosition, linePosition, lineString) {
        super('InvalidCharacterError', `Invalid character found: [${character}]`, character, characterPosition, linePosition, lineString);
    }    
}

function Demo(){
    try{
        throw new InvalidCharacterError(':', 24, 1, 'There is a a colon beare:');
    }
    catch(e){
        console.log(e.toString());
    }
}

//Demo();