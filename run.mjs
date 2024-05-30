const path_to_file = process.argv[2];
import { Lexer } from './lexer.mjs';
import { Lines } from './lines.mjs';
import { Parser } from './parser.mjs';
import fs from 'fs';

try{
    let program = fs.readFileSync(path_to_file, 'utf8');
    let programLines = new Lines(program);

    let myLexer = new Lexer(program, programLines);
    let tokens = myLexer.tokenize();
    console.log('Tokens are:');
    console.log(tokens);

    let myParser = new Parser(tokens, programLines);
    let result = myParser.parse();
    console.log('Result is:');
    console.log(result);
}
catch(err){
    console.log(err.toString());
    process.exit(1);
}