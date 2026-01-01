# Crespi Grammar (ANTLR4)

This is a reference grammar for Crespi using ANTLR4 syntax. It mirrors the language as implemented in the
Rust parser, including the new `if` rules (no parentheses) and block-required `if` expressions.

Notes:
- Semicolons are optional due to ASI (automatic semicolon insertion); `semi` reflects that.
- Language packs provide localized keyword/operator aliases; this grammar uses canonical English forms.
- String interpolation (`$ident` and `${expr}`) is handled by the lexer with modes in practice. The lexer
  rules below treat strings as single tokens for simplicity.
- Import aliases use `as` in canonical syntax; Spanish `como` is accepted at runtime.
- Lambdas use Kotlin-style brace syntax: `{ x -> x * 2 }`, `{ it * 2 }` (implicit parameter).
- Trailing lambdas can follow function calls: `list.map { x -> x * 2 }`.
- Range operators: `..` is inclusive, `..<` is exclusive (half-open).

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
  | decorator* visibility? (varDecl | letDecl | constDecl | functionDecl | extensionFunctionDecl | externFunctionDecl | classDecl | traitDecl | enumDecl)
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

constDecl
  : 'const' IDENTIFIER typeAnn? '=' expression semi
  ;

functionDecl
  : 'async'? 'fn' IDENTIFIER typeParams? '(' parameters? ')' throwsAnn? returnType? (block | '=' expression semi)
  ;

extensionFunctionDecl
  : 'async'? 'fn' IDENTIFIER '.' IDENTIFIER typeParams? '(' parameters? ')' throwsAnn? returnType? (block | '=' expression semi)
  ;

externFunctionDecl
  : attribute? 'extern' 'fn' IDENTIFIER '(' parameters? ')' returnType?
  ;

attribute
  : '#' '[' IDENTIFIER '=' STRING ']'
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
  : classModifier? 'class' IDENTIFIER typeParams? ('(' classParameters? ')')? (':' parents)? classBody?
  ;

classModifier
  : 'nested' | 'inner'
  ;

classParameters
  : classParameter (',' classParameter)*
  ;

classParameter
  : ('var' | 'let')? IDENTIFIER typeAnn? ('=' expression)?
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
  : 'indirect'? 'enum' IDENTIFIER typeParams? '{' enumVariants enumMember* '}'
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

enumMember
  : functionDecl
  | operatorDecl
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
  : range (('<' | '<=' | '>' | '>=' | 'in' | 'is' | '!is') range)*
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
  : primary callSuffix* trailingLambda?
  ;

callSuffix
  : '(' arguments? ')'
  | '.' IDENTIFIER
  | '[' expression ']'
  | '++'
  | '--'
  ;

trailingLambda
  : lambdaExpr
  ;

arguments
  : argument (',' argument)*
  ;

argument
  : (IDENTIFIER '=')? expression
  ;

primary
  : literal
  | IDENTIFIER
  | 'this'
  | 'super' '.' IDENTIFIER
  | enumVariantShorthand
  | lambdaExpr
  | anonymousFn
  | tupleLiteral
  | '(' expression ')'
  | arrayLiteral
  | dictLiteral
  ;

literal
  : INTEGER
  | DECIMAL
  | STRING
  | 'true'
  | 'false'
  | 'null'
  ;

enumVariantShorthand
  : '.' IDENTIFIER ('(' arguments? ')')?
  ;

lambdaExpr
  : 'async'? '{' (lambdaParams '->')? lambdaBody '}'
  ;

lambdaParams
  : IDENTIFIER (',' IDENTIFIER)*
  | '(' (IDENTIFIER typeAnn? (',' IDENTIFIER typeAnn?)*)? ')'
  ;

lambdaBody
  : statement* expression?
  ;

anonymousFn
  : 'async'? 'fn' '(' parameters? ')' returnType? (block | '=' expression)
  ;

tupleLiteral
  : '(' expression ',' (expression (',' expression)*)? ','? ')'
  ;

arrayLiteral
  : '[' (expression (',' expression)* ','?)? ']'
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
  | extensionFunctionType
  | tupleType
  | namedType
  ;

namedType
  : IDENTIFIER ('[' typeExpr (',' typeExpr)* ']')?
  ;

arrayType
  : '[' typeExpr ']'
  ;

dictType
  : '{' typeExpr ':' typeExpr '}'
  ;

functionType
  : '(' (typeExpr (',' typeExpr)*)? ')' '->' typeExpr
  ;

extensionFunctionType
  : IDENTIFIER '.' '(' (typeExpr (',' typeExpr)*)? ')' '->' typeExpr
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
