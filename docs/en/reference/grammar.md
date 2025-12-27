# Crespi Grammar (ANTLR4)

This is a reference grammar for Crespi using ANTLR4 syntax. It mirrors the language as implemented in the
Rust parser, including the new `if` rules (no parentheses) and block-required `if` expressions.

Notes:
- Semicolons are optional due to ASI (automatic semicolon insertion); `semi` reflects that.
- Language packs provide localized keyword/operator aliases; this grammar uses canonical English forms.
- String interpolation (`$ident` and `${expr}`) is handled by the lexer with modes in practice. The lexer
  rules below treat strings as single tokens for simplicity.
- Import aliases use `as` in canonical syntax; Spanish `como` is accepted at runtime.

```antlr
grammar Crespi;

// ===== Parser rules =====

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
  : importDecl
  | decorator* visibility? (varDecl | letDecl | functionDecl | extensionFunctionDecl | classDecl | traitDecl)
  | extensionDecl
  ;

visibility
  : 'public' | 'private' | 'internal' | 'fileprivate'
  ;

decorator
  : '@' IDENTIFIER
  ;

varDecl
  : 'var' IDENTIFIER typeAnn? ('=' expression)? semi
  ;

letDecl
  : 'let' IDENTIFIER typeAnn? '=' expression semi
  ;

functionDecl
  : 'fn' IDENTIFIER typeParams? '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

extensionFunctionDecl
  : 'fn' IDENTIFIER '.' IDENTIFIER typeParams? '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

operatorDecl
  : 'operator' operatorName '(' parameters? ')' returnType? (block | '=' expression semi)
  ;

constructorDecl
  : 'constructor' '(' parameters? ')' (':' constructorDelegation)? block
  ;

constructorDelegation
  : 'this' '(' arguments? ')'
  | 'super' '(' arguments? ')'
  ;

classDecl
  : 'class' IDENTIFIER typeParams? ('(' parameters? ')')? (':' parents)? classBody?
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
  : 'static' functionDecl
  | 'static' varDecl
  | 'static' letDecl
  | 'static' block
  ;

traitDecl
  : 'trait' IDENTIFIER typeParams? (':' parents)? '{' traitMember* '}'
  ;

traitMember
  : 'fn' IDENTIFIER '(' parameters? ')' returnType? block?
  ;

extensionDecl
  : 'extension' IDENTIFIER (':' parents)? '{' extensionMember* '}'
  ;

extensionMember
  : functionDecl
  | operatorDecl
  ;

importDecl
  : 'import' importKind? modulePath importAlias? importSymbols? semi
  ;

importKind
  : 'fn' | 'class' | 'let' | 'var'
  ;

importAlias
  : 'as' IDENTIFIER
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
  : 'if' expression block ('else' (ifStmt | block))?
  ;

guardStmt
  : 'guard' (guardBind | expression) 'else' blockExpr semi?
  ;

guardBind
  : 'var' IDENTIFIER '=' expression
  ;

whenStmt
  : 'when' expression '{' whenCase* defaultCase? '}'
  ;

whenCase
  : 'is' pattern '=>' block
  ;

defaultCase
  : 'default' '=>' block
  ;

whileStmt
  : 'while' expression block
  ;

forStmt
  : 'for' IDENTIFIER 'in' expression block
  ;

returnStmt
  : 'return' expression? semi
  ;

breakStmt
  : 'break' semi
  ;

continueStmt
  : 'continue' semi
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
  : 'return' expression?
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
  : 'if' expression blockExpr 'else' blockExpr
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
  : comparison (('==' | '!=') comparison)*
  ;

comparison
  : shift (('<' | '<=' | '>' | '>=' | 'in') shift)*
  ;

shift
  : term (('<<' | '>>') term)*
  ;

term
  : factor (('+' | '-') factor)*
  ;

factor
  : unary (('*' | '/' | '%') unary)*
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
  | 'this'
  | 'super' '.' IDENTIFIER
  | lambdaExpr
  | tupleLiteral
  | '(' expression ')'
  | arrayLiteral
  | dictLiteral
  ;

lambdaExpr
  : IDENTIFIER '=>' lambdaBody
  | '(' parameters? ')' returnType? '=>' lambdaBody
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

// ===== Lexer rules =====

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
