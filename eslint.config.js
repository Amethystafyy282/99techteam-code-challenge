import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist', 'src/problem5/data', 'src/problem3/messy.tsx'] },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: { parser: tseslint.parser },
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
      '@stylistic/jsx-newline': ['error', { prevent: false }],
      curly: ['error', 'all'],
      'no-nested-ternary': 'error',
      'no-restricted-syntax': [
        'error',
        { selector: 'IfStatement > .consequent IfStatement', message: 'Do not nest if statements.' },
        { selector: 'IfStatement > BlockStatement.alternate IfStatement', message: 'Do not nest if statements.' },
        {
          selector:
            'VariableDeclarator[id.name=/^[A-Z]/] > ArrowFunctionExpression > ObjectPattern > TSTypeAnnotation > :matches(TSTypeLiteral, TSIntersectionType)',
          message: 'Declare component props as a named interface.',
        },
      ],
    },
  },
);
