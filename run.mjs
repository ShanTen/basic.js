const path_to_file = process.argv[2];
import { Lexer } from './lexer.mjs';
import { LineHandler } from './lines.mjs';
import { Parser } from './parser.mjs';
import fs from 'fs';

const args = process.argv.slice();

try{
    let program = fs.readFileSync(path_to_file, 'utf8');
    let programLineHandler = new LineHandler(program);
    let programLines = programLineHandler.lines;

    let myLexer = new Lexer(program, programLineHandler);
    let tokens = myLexer.tokenize();

    if(['tokens', 'show-tokens'].includes(args[3])){
        console.log('Tokens are:');
        console.log(tokens);
    }

    let myParser = new Parser(tokens, programLineHandler);
    let result = myParser.parse();
    console.log('Result is:');
    console.log(JSON.stringify(result, null, 2));
}
catch(err){
    console.log(err.toString());
    process.exit(1);
}