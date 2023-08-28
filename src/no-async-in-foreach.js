'use strict';

module.exports = {
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') {
          return;
        }

        let memberExpression = node.callee;

        if (memberExpression.property.name !== 'forEach') {
          return;
        }

        let [firstArg] = node.arguments;

        if (!firstArg) {
          return;
        }

        if (firstArg.type !== 'FunctionExpression' && firstArg.type !== 'ArrowFunctionExpression') {
          return;
        }

        let functionExpression = firstArg;

        if (!functionExpression.async) {
          return;
        }

        context.report({
          node,
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.'
        });
      }
    };
  }
};
