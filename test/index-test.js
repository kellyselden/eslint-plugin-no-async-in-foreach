'use strict';

const { RuleTester } = require('eslint');
const rule = require('../src');

new RuleTester({
  parserOptions: {
    ecmaVersion: '2017'
  }
}).run('no-async-in-foreach', rule, {
  valid: [
    'foo.forEach',
    'foo.forEach()',
    'foo.forEach({})',
    'foo.forEach(function(){})',
    'foo.forEach(()=>{})',
    'forEach(async function(){})'
  ],
  invalid: [
    {
      code: 'foo.forEach(async function(){})',
      errors: [
        {
          message:
            'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: 'foo.forEach(async()=>{})',
      errors: [
        {
          message:
            'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ]
    }
  ]
});
