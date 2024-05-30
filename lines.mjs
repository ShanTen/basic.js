const osFlavour = "WindowsNT" //Options are "WindowsNT" or "Unix";
const newLineChar = osFlavour === "WindowsNT" ? '\r\n' : '\n';

export class Lines {
    constructor(text) {
        this.text = text;
        this.lines = text.split(newLineChar);
    }

    get_line_string(lineNumber){
        return this.lines[lineNumber-1];
    }
}