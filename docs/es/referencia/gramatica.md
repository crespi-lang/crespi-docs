# Gramatica de Crespi (ANTLR4)

Esta es una gramatica de referencia para Crespi usando sintaxis ANTLR4. Refleja el lenguaje tal
como esta implementado en el parser de Rust, incluyendo las reglas nuevas de `si` (sin parentesis)
y el `si` expresion con bloques obligatorios.

Notas:
- Los punto y coma son opcionales por ASI (insercion automatica); `semi` lo refleja.
- La interpolacion de strings (`$ident` y `${expr}`) se maneja en el lexer con modos en la practica.
  Las reglas del lexer aqui tratan las cadenas como tokens simples por simplicidad.

```antlr
grammar Crespi;

// ===== Reglas del parser =====

program
  : statement* EOF
  ;

statement
  : declaration
  | ifStmt
  | whenStmt
  | whileStmt
  | forStmt
  | guardStmt
  | returnStmt
  | breakStmt
  | continueStmt
  | block
  | exprStmt
  ;

declaration
  : decorator* visibility? (varDecl | letDecl | functionDecl | extensionFunctionDecl | classDecl | traitDecl)
  | extensionDecl
  ;

visibility
  : 'publico' | 'privado' | 'interno' | 'fileprivate'
  ;

decorator
  : '@' IDENTIFIER
  ;

varDecl
  : 'variable' IDENTIFIER typeAnn? ('=' expression)? semi
  ;

letDecl
  : 'immutable' IDENTIFIER typeAnn? '=' expression semi
  ;

functionDecl
  : 'bloque' IDENTIFIER typeParams? '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

extensionFunctionDecl
  : 'bloque' IDENTIFIER '.' IDENTIFIER typeParams? '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

operatorDecl
  : 'operador' operatorName '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

constructorDecl
  : 'constructor' '(' parameters? ')' (':' constructorDelegation)? block
  ;

constructorDelegation
  : 'yo' '(' arguments? ')'
  | 'super' '(' arguments? ')'
  ;

classDecl
  : 'tipo' IDENTIFIER typeParams? ('(' parameters? ')')? (':' parents)? classBody?
  ;

parents
  : IDENTIFIER ('(' arguments? ')')? (',' IDENTIFIER)*
  ;

classBody
  : '{' classMember* '}'
  ;

classMember
  : functionDecl
  | operatorDecl
  | constructorDecl
  | varDecl
  | letDecl
  | staticMember
  ;

staticMember
  : 'estatico' functionDecl
  | 'estatico' varDecl
  | 'estatico' letDecl
  | 'estatico' block
  ;

traitDecl
  : 'trait' IDENTIFIER typeParams? (':' parents)? '{' traitMember* '}'
  ;

traitMember
  : 'bloque' IDENTIFIER '(' parameters? ')' returnType? block?
  ;

extensionDecl
  : 'extension' IDENTIFIER (':' parents)? '{' extensionMember* '}'
  ;

extensionMember
  : functionDecl
  | operatorDecl
  ;

importDecl
  : 'importar' importKind? modulePath importAlias? importSymbols? semi
  ;

importKind
  : 'bloque' | 'tipo' | 'immutable' | 'variable'
  ;

importAlias
  : 'como' IDENTIFIER
  ;

importSymbols
  : '{' importSymbol (',' importSymbol)* '}'
  ;

importSymbol
  : IDENTIFIER importAlias?
  ;

modulePath
  : IDENTIFIER ('.' IDENTIFIER)*
  ;

parameters
  : parameter (',' parameter)*
  ;

parameter
  : IDENTIFIER typeAnn? ('=' expression)?
  ;

typeParams
  : '[' typeParam (',' typeParam)* ']'
  ;

typeParam
  : IDENTIFIER (':' typeExpr)?
  ;

typeAnn
  : ':' typeExpr
  ;

returnType
  : '->' typeExpr
  ;

ifStmt
  : 'si' expression block ('o' (ifStmt | block))?
  ;

guardStmt
  : 'asegura' (guardBind | expression) 'o' blockExpr semi?
  ;

guardBind
  : 'variable' IDENTIFIER '=' expression
  ;

whenStmt
  : 'cuando' expression '{' whenCase* defaultCase? '}'
  ;

whenCase
  : 'es' pattern '=>' block
  ;

defaultCase
  : 'defecto' '=>' block
  ;

whileStmt
  : 'mientras' expression block
  ;

forStmt
  : 'repetir' IDENTIFIER 'en' expression block
  ;

returnStmt
  : 'resultado' expression? semi
  ;

breakStmt
  : 'salir' semi
  ;

continueStmt
  : 'continuar' semi
  ;

exprStmt
  : expression semi
  ;

block
  : '{' statement* '}'
  ;

blockExpr
  : '{' statement* blockExprTail? '}'
  ;

blockExprTail
  : 'resultado' expression?
  | expression
  ;

expression
  : assignment
  ;

assignment
  : conditional (assignmentOp assignment)?
  ;

assignmentOp
  : '=' | '+=' | '-=' | '*=' | '/='
  ;

conditional
  : ifExpr
  | coalesce ('?' expression ':' expression)?
  ;

ifExpr
  : 'si' expression blockExpr 'o' blockExpr
  ;

coalesce
  : logicalOr ('??' logicalOr)*
  ;

logicalOr
  : logicalAnd (('or' | '||') logicalAnd)*
  ;

logicalAnd
  : bitwiseOr (('and' | '&&') bitwiseOr)*
  ;

bitwiseOr
  : bitwiseXor ('|' bitwiseXor)*
  ;

bitwiseXor
  : bitwiseAnd ('^' bitwiseAnd)*
  ;

bitwiseAnd
  : equality ('&' bitwiseAnd)*
  ;

equality
  : comparison (('igualA' | 'diferenteDe' | '==' | '!=') comparison)*
  ;

comparison
  : shift (('menorQue' | 'menorOIgual' | 'mayorQue' | 'mayorOIgual' | '<' | '<=' | '>' | '>=' | 'in') shift)*
  ;

shift
  : term (('<<' | '>>') term)*
  ;

term
  : factor (('mas' | 'menos' | '+' | '-') factor)*
  ;

factor
  : unary (('por' | 'entre' | 'modulo' | '*' | '/' | '%') unary)*
  ;

unary
  : ('!' | '-' | '~') unary
  | call
  ;

call
  : primary callSuffix*
  ;

callSuffix
  : '(' arguments? ')'
  | '.' IDENTIFIER
  | '[' expression ']'
  | '++'
  | '--'
  ;

arguments
  : expression (',' expression)*
  ;

primary
  : literal
  | IDENTIFIER
  | 'yo'
  | 'super' '.' IDENTIFIER
  | lambdaExpr
  | tupleLiteral
  | '(' expression ')'
  | arrayLiteral
  | dictLiteral
  ;

lambdaExpr
  : IDENTIFIER '=>' lambdaBody
  | '(' parameters? ')' returnType? => lambdaBody
  ;

lambdaBody
  : block
  | expression
  ;

tupleLiteral
  : '(' expression ',' (expression (',' expression)*)? ','? ')'
  ;

arrayLiteral
  : '[' (expression (',' expression)*)? ']'
  ;

dictLiteral
  : '{' (dictEntry (',' dictEntry)*)? '}'
  ;

dictEntry
  : (IDENTIFIER | STRING) ':' expression
  ;

pattern
  : '_'
  | IDENTIFIER patternClass?
  | literal
  | listPattern
  | dictPattern
  ;

patternClass
  : '{' patternField (',' patternField)* '}'
  ;

patternField
  : IDENTIFIER ':' pattern
  ;

listPattern
  : '[' (pattern (',' pattern)*)? ']'
  ;

dictPattern
  : '{' (patternEntry (',' patternEntry)*)? '}'
  ;

patternEntry
  : (IDENTIFIER | STRING) ':' pattern
  ;

operatorName
  : '+' | '-' | '*' | '/' | '%'
  | '==' | '!' | '<' | '<=>'
  | 'compare' | 'negate' | 'not'
  | 'increment' | 'decrement'
  | 'get' | 'set' | 'contains' | 'invoke'
  ;

typeExpr
  : unionType
  ;

unionType
  : nullableType ('|' nullableType)*
  ;

nullableType
  : primaryType '?'?
  ;

primaryType
  : arrayType
  | dictType
  | functionType
  | tupleType
  | namedType
  ;

namedType
  : IDENTIFIER ('[' typeExpr (',' typeExpr)* ']')? ('.' '(' parameters? ')' '->' typeExpr)?
  ;

arrayType
  : '[' typeExpr ']'
  ;

dictType
  : '{' typeExpr ':' typeExpr '}'
  ;

functionType
  : '(' typeExpr (',' typeExpr)* ')' '->' typeExpr
  ;

tupleType
  : '(' typeExpr (',' typeExpr)+ ')'
  ;

semi
  : ';'?
  ;

literal
  : INTEGER
  | DECIMAL
  | STRING
  | 'verdadero'
  | 'falso'
  | 'nada'
  ;

pattern
  : '_'
  | IDENTIFIER patternClass?
  | literal
  | listPattern
  | dictPattern
  ;

patternClass
  : '{' patternField (',' patternField)*
  ;

patternField
  : IDENTIFIER ':' pattern
  ;

listPattern
  : '[' (pattern (',' pattern)*)? ']'
  ;

dictPattern
  : '{' (patternEntry (',' patternEntry)*)? '}'
  ;

patternEntry
  : (IDENTIFIER | STRING) ':' pattern
  ;

semi
  : ';'?
  ;

// ===== Reglas del lexer =====

STRING
  : TRIPLE_QUOTED
  | DOUBLE_QUOTED
  ;

fragment ESC
  : '\\' [ntr"\\$]
  ;

DOUBLE_QUOTED
  : '"' (ESC | ~["\\])* '"'
  ;

TRIPLE_QUOTED
  : '"""' .*? '"""'
  ;

DECIMAL
  : [0-9]+ '.' [0-9]+
  ;

INTEGER
  : [0-9]+
  ;

IDENTIFIER
  : [a-zA-Z_] [a-zA-Z0-9_]*
  ;

WS
  : [ \t\r\n]+ -> skip
  ;

LINE_COMMENT
  : '//' ~[\r\n]* -> skip
  ;

BLOCK_COMMENT
  : '/*' .*? '*/' -> skip
  ;
```
