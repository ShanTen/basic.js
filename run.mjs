const path_to_file = process.argv[2];
import { Lexer } from './lexer.mjs';
import { Parser } from './parser.mjs';
import fs from 'fs';

try{
    let program = fs.readFileSync(path_to_file, 'utf8');

    let myLexer = new Lexer(program);
    let tokens = myLexer.tokenize();

    // let myParser = new Parser(tokens);
    // let result = myParser.parse();    

    console.log('Tokens are:');
    console.log(tokens);

    // console.log('Result is:');
    // console.log(result);
}
catch(err){
    console.log(err.toString());
    process.exit(1);
}