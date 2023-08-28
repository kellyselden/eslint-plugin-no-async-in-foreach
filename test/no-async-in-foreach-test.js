'use strict';

const { RuleTester } = require('eslint');
const rule = require('../src/no-async-in-foreach');

new RuleTester({
  parserOptions: {
    ecmaVersion: '2021'
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
      code: 'async()=>{foo.forEach(async function(){await 1})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let i = 0; i < foo.length; i++) {await 1}}'
    },
    {
      code: 'async()=>{foo.forEach(async function(bar){await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let bar of foo) {await bar}}'
    },
    {
      code: 'async()=>{foo.forEach(async(bar)=>{await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let bar of foo) {await bar}}'
    },
    {
      code: 'async()=>{foo.forEach(async(bar,baz)=>{await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let baz = 0; baz < foo.length; baz++) {let bar = foo[baz];await bar}}'
    },

    // desctructuring and default values
    {
      code: 'async()=>{foo.forEach(async(bar=bar2)=>{await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let bar of foo) {bar ??= bar2;await bar}}'
    },
    {
      code: 'async()=>{foo.forEach(async({bar})=>{await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let {bar} of foo) {await bar}}'
    },
    {
      code: 'async()=>{foo.forEach(async({bar}=bar2)=>{await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let i = 0; i < foo.length; i++) {let {bar} = foo[i] ?? bar2;await bar}}'
    },
    {
      code: 'async()=>{foo.forEach(async(bar=bar2,baz=baz2)=>{await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let baz = 0; baz < foo.length; baz++) {let bar = foo[baz] ?? bar2;await bar}}'
    },
    {
      code: 'async()=>{foo.forEach(async({bar},{baz})=>{await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let i = 0; i < foo.length; i++) {let {bar} = foo[i];await bar}}'
    },
    {
      code: 'async()=>{foo.forEach(async({bar}=bar2,{baz}=baz2)=>{await bar})}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let i = 0; i < foo.length; i++) {let {bar} = foo[i] ?? bar2;await bar}}'
    },

    // no block in arrow func
    {
      code: 'async()=>{foo.forEach(async(bar)=>await bar)}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let bar of foo) {await bar}}'
    },

    // optional chaining
    {
      code: 'async()=>{foo?.forEach(async(bar)=>await bar)}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let bar of foo ?? []) {await bar}}'
    },
    {
      code: 'async()=>{foo?.bar.forEach(async(bar)=>await bar)}',
      errors: [
        {
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          type: 'CallExpression'
        }
      ],
      output: 'async()=>{for (let bar of foo?.bar ?? []) {await bar}}'
    }
  ]
});
