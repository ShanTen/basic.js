const osFlavour = "WindowsNT" //Options are "WindowsNT" or "Unix";
const newLineChar = osFlavour === "WindowsNT" ? '\r\n' : '\n';

export class LineHandler {
    constructor(text) {
        this.text = text;
        this.lines = text.split(newLineChar); //does this work?
    }

    get_line_string(lineNumber){
        return this.lines[lineNumber-1];
    }

    __get_position_in_line(charPos){
        let line = 1;
        let pos = 0;
        for (let i = 0; i < charPos; i++){
            if(this.text[i] === newLineChar){
                line++;
                pos = 0;
            }
            else{
                pos++;
            }
        }
        return [line, pos];
    }

    get_position_in_line(charPos){
        /*
            translates overall position to position within it's respective line, 
            it does this by skipping lines with \r\n or whatever escape char
        */

        let line = 1;
        let posInLine = 0
        for(let i = 0; i < charPos; i++){

            posInLine++;

            if(osFlavour!='WindowsNT' && this.text[i] === newLineChar){
                line++;
                posInLine = 0;
            }
            else if(osFlavour==='WindowsNT' && this.text[i] === '\n' && this.text[i-1] === '\r'){
                line++;
                posInLine = 0;
            }
            
        }

        return [line, posInLine];
    }

}

//lines test
// const path_to_file = process.argv[2];
// let program = fs.readFileSync(path_to_file, 'utf8');
// let programLines = new LineHandler(program);
// console.log(programLines);
