/*
  Highlight.js definition for Crespi Language
  Based on the CodeMirror 6 language support in web/src/lib/editor/crespi-lang.ts
*/

hljs.registerLanguage('crespi', function(hljs) {
  const CONTROL_KEYWORDS = [
    // English
    'if', 'else', 'when', 'guard', 'is', 'default', 'while', 'for', 'in', 'break', 'continue', 'return',
    // Spanish
    'si', 'o', 'cuando', 'asegura', 'es', 'defecto', 'mientras', 'repetir', 'en', 'salir', 'continuar', 'resultado'
  ];

  const DECLARATION_KEYWORDS = [
    // English
    'var', 'let', 'public', 'private', 'internal', 'static', 'fn', 'class', 'trait', 'extends', 'implements',
    'operator', 'import', 'extension',
    // Spanish
    'variable', 'immutable', 'publico', 'privado', 'interno', 'estatico', 'bloque', 'tipo', 'anidado', 'trait', 'extiende',
    'implementa', 'operador', 'importar', 'extension'
  ];

  const SPECIAL_KEYWORDS = [
    // English
    'this', 'super',
    // Spanish
    'yo'
  ];

  const OPERATOR_KEYWORDS = [
    // English
    'and', 'or',
    // Spanish
    'menorQue', 'mayorQue', 'menorOIgual', 'mayorOIgual', 'igualA', 'diferenteDe',
    'mas', 'menos', 'por', 'entre', 'modulo'
  ];

  const LITERALS = [
    // English
    'true', 'false', 'null', 'nil',
    // Spanish
    'verdadero', 'falso', 'nada'
  ];

  const BUILTINS = [
    // English
    'print', 'read', 'length', 'len', 'typeof', 'str', 'int', 'float', 'push', 'pop', 'keys', 'values', 'contains', 'memoize',
    // Spanish
    'mostrar', 'leer', 'longitud', 'tipo_de', 'texto', 'entero', 'decimal', 'agregar', 'quitar', 'claves', 'valores', 'contiene', 'memorizar'
  ];

  const KEYWORDS = {
    keyword: [...CONTROL_KEYWORDS, ...DECLARATION_KEYWORDS, ...OPERATOR_KEYWORDS].join(' '),
    literal: LITERALS.join(' '),
    built_in: BUILTINS.join(' '),
    'variable.language': SPECIAL_KEYWORDS.join(' ')
  };

  return {
    name: 'Crespi',
    aliases: ['crespi'],
    keywords: KEYWORDS,
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        className: 'string',
        begin: '"', end: '"',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        className: 'title.class',
        beginKeywords: 'class tipo',
        end: /[{;=]/,
        excludeEnd: true,
        illegal: /[:"\[\]]/
      },
      {
        className: 'title.function',
        beginKeywords: 'fn bloque',
        end: /\(/,
        excludeEnd: true,
        illegal: /[:"\[\]]/
      }
    ]
  };
});
