const path_to_file = process.argv[2];
import { Interpreter } from './interpreter.mjs';
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
    let AST = myParser.parse();
    
    

    let myInterpreter = new Interpreter(AST)
    myInterpreter.processAST()

}
catch(err){
    console.log(err.toString());
    process.exit(1);
}