const path_to_file = process.argv[2];
import { Lexer, Parser } from './main.mjs';
import fs from 'fs';

let program = fs.readFileSync(path_to_file, 'utf8');

let myLexer = new Lexer(program);
let tokens = myLexer.tokenize();

let myParser = new Parser(tokens);
let result = myParser.parse();

console.log('Tokens are:');
console.log(tokens);
console.log('Result is:');
console.log(result);