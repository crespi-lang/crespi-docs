/*
  Highlight.js definition for ANTLR grammar snippets
*/

hljs.registerLanguage('antlr', function(hljs) {
  const KEYWORDS = {
    keyword: 'grammar parser lexer fragment options tokens returns locals throws catch finally mode channel',
    literal: 'true false'
  };

  const RULE_NAME = {
    className: 'title',
    begin: /^[a-z][A-Za-z0-9_]*/,
    relevance: 0
  };

  const TOKEN_NAME = {
    className: 'symbol',
    begin: /\b[A-Z][A-Z0-9_]*\b/,
    relevance: 0
  };

  return {
    name: 'ANTLR',
    keywords: KEYWORDS,
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      RULE_NAME,
      TOKEN_NAME
    ]
  };
});
