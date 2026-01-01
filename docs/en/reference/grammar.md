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
  | tryStmt
  | throwStmt
  | deferStmt
  | returnStmt
  | breakStmt
  | continueStmt
  | block
  | exprStmt
  ;

declaration
  : importDecl
  | decorator* visibility? (varDecl | letDecl | functionDecl | extensionFunctionDecl | classDecl | traitDecl | enumDecl)
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
  : 'async'? 'fn' IDENTIFIER typeParams? '(' parameters? ')' throwsAnn? returnType? (block | '=' expression semi)
  ;

extensionFunctionDecl
  : 'async'? 'fn' IDENTIFIER '.' IDENTIFIER typeParams? '(' parameters? ')' throwsAnn? returnType? (block | '=' expression semi)
  ;

throwsAnn
  : 'throws'
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

// ===== Enum Declarations =====

enumDecl
  : 'indirect'? 'enum' IDENTIFIER typeParams? '{' enumVariants '}'
  ;

enumVariants
  : ('case' enumVariant (',' enumVariant)* )+
  ;

enumVariant
  : IDENTIFIER enumVariantFields?
  ;

enumVariantFields
  : '(' enumField (',' enumField)* ')'
  ;

enumField
  : (IDENTIFIER ':')? typeExpr
  ;

// ===== Traits and Extensions =====

traitDecl
  : 'trait' IDENTIFIER typeParams? (':' parents)? '{' traitMember* '}'
  ;

traitMember
  : 'async'? 'fn' IDENTIFIER '(' parameters? ')' throwsAnn? returnType? block?
  ;

extensionDecl
  : 'extension' IDENTIFIER (':' parents)? '{' extensionMember* '}'
  ;

extensionMember
  : functionDecl
  | operatorDecl
  ;

// ===== Imports =====

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

// ===== Parameters and Types =====

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

// ===== Control Flow Statements =====

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
  : 'case' pattern '->' block
  ;

defaultCase
  : 'default' '->' block
  ;

whileStmt
  : 'while' expression block
  ;

forStmt
  : 'for' IDENTIFIER 'in' expression block
  ;

// ===== Error Handling Statements =====

tryStmt
  : 'try' block catchClause+
  ;

catchClause
  : 'catch' catchPattern? block
  ;

catchPattern
  : pattern                    // Pattern match: catch FileError.notFound(path) { }
  | IDENTIFIER                 // Binding: catch error { }
  ;

throwStmt
  : 'throw' expression semi
  ;

deferStmt
  : 'defer' block
  ;

// ===== Other Statements =====

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

// ===== Expressions =====

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
  : range (('<' | '<=' | '>' | '>=' | 'in') range)*
  ;

range
  : shift (('..' | '..<') shift)?
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
  : ('!' | '-' | '~' | 'await') unary
  | tryExpr
  ;

tryExpr
  : call ('try?' | 'try!')?
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
  : 'async'? '{' lambdaParams? '->' lambdaBody '}'
  | 'async'? lambdaParams '=>' expression               // Arrow syntax: x => x + 1
  ;

lambdaParams
  : IDENTIFIER (',' IDENTIFIER)*
  | '(' (IDENTIFIER typeAnn? (',' IDENTIFIER typeAnn?)*)? ')'
  ;

lambdaBody
  : statement* expression?
  ;

tupleLiteral
  : '(' expression ',' (expression (',' expression)*)? ','? ')'
  ;

arrayLiteral
  : '[' (expression (',' expression)*)? ']'
  ;

dictLiteral
  : '[' ':' ']'                              // empty dict
  | '[' dictEntry (',' dictEntry)* ','? ']'  // non-empty
  ;

dictEntry
  : expression ':' expression
  ;

// ===== Patterns =====

pattern
  : '_'
  | literal
  | enumPattern
  | classPattern
  | listPattern
  | dictPattern
  | IDENTIFIER
  ;

enumPattern
  : '.' IDENTIFIER enumPatternFields?                    // Shorthand: .variant or .variant(x, y)
  | IDENTIFIER '.' IDENTIFIER enumPatternFields?        // Qualified: EnumName.variant(x, y)
  ;

enumPatternFields
  : '(' (pattern (',' pattern)*)? ')'
  ;

classPattern
  : IDENTIFIER '{' patternField (',' patternField)* '}'
  ;

patternField
  : IDENTIFIER ':' pattern
  ;

listPattern
  : '[' (pattern (',' pattern)*)? ']'
  ;

dictPattern
  : '[' (patternEntry (',' patternEntry)*)? ']'
  ;

patternEntry
  : STRING ':' pattern
  ;

// ===== Operators =====

operatorName
  : '+' | '-' | '*' | '/' | '%'
  | '==' | '!' | '<' | '<=>'
  | 'compare' | 'negate' | 'not'
  | 'increment' | 'decrement'
  | 'get' | 'set' | 'contains' | 'invoke'
  ;

// ===== Type Expressions =====

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
