# Basic.js 

When I first started this project, I wanted to write javascript (or atleast the basic javascript syntax within javascript). It was ambitious but mostly stupid because writing anything in javascript, let alone a lexer, parser and interpreted programming language is a bad idea.


I was following along this tutorial where a guy implemented his own basic parser in high level python, and wanted to do the same except bring in some of the core syntax features of javascript (essentially have a javascript skin on top of the basic language if that makes sense). 


But alas, I never got that far. I finished the parse tree for PEDMAS operations but more than that, it just did not feel nice for a shitpost. 


Besides based of the tutorial I was following, I couldnt even implement a recursive descent parser and had to probably have done some other high level function. This pissed me off,


The sheer amount of javascript to try to write and debug make it such a pain. This project was supposed to be done within maximum one month, like my other parser projects. But this remains incomplete.


I have lost motivation to complete this project, given that is is impractical, useless, has no value, and is nothing more than a mere shitpost. 

If I attempt another parser project again, it will be in C/C++.


I still want to put up the code on github, for no other reason than self preservation, I will not be making any future references to this in linkedin or my blog. 

Thus, disgracefully I am ending this project...half finished.

Output 

```
> node run.mjs test.basic 


{
  "leftNode": {
    "leftNode": {
      "error": null,
      "node": {
        "value": 1
      }
    },
    "rightNode": {
      "leftNode": {
        "error": null,
        "node": {
          "value": 2
        }
      },
      "rightNode": {
        "error": null,
        "node": {
          "value": 4
        }
      },
      "operator": {
        "type": "MUL",
        "value": "*",
        "pos_start": 3,
        "pos_end": 4,
        "line_number": 1
      }
    },
    "operator": {
      "type": "PLUS",
      "value": "+",
      "pos_start": 1,
      "pos_end": 2,
      "line_number": 1
    }
  },
  "rightNode": {
    "error": null,
    "node": {
      "value": 3
    }
  },
  "operator": {
    "type": "MINUS",
    "value": "-",
    "pos_start": 5,
    "pos_end": 6,
    "line_number": 1
  }
}
Found binary operator node
Interpreter {}
Found binary operator node
Interpreter {}
Error: No visit_ParseResult method
```