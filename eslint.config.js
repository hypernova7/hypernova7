import { sxzz } from '@sxzz/eslint-config';

export default sxzz().append([
  {
    ignores: ['**/pnpm-lock.yaml']
  },
  {
    rules: {
      eqeqeq: 'error',
      'import/named': 'off',
      'import/extensions': 'error',
      'import/no-default-export': 'off',
      'unused-imports/no-unused-vars': 'off',
      'no-lone-blocks': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }],
      'no-template-curly-in-string': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^(_|err)', ignoreRestSiblings: true }],
      'no-var': 'error',
      'no-restricted-syntax': 'off',
      'object-shorthand': 'error',
      quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
      'space-before-blocks': 'error',
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': 'error',
      'template-curly-spacing': 'error',
      'unicorn/better-regex': 'error',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-null': 'off',
      'sxzz/prefer-string-function': 'off',
      'i18next/no-literal-string': 'off',
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      'perfectionist/sort-imports': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'regexp/optimal-lookaround-quantifier': 'off',
      'regexp/no-dupe-disjunctions': 'off',
      'regexp/no-lazy-ends': 'off',
      'regexp/strict': 'off'
    }
  }
]);
