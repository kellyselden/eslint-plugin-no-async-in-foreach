'use strict';

module.exports = {
  meta: {
    fixable: true
  },

  create(context) {
    let { sourceCode } = context;

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
          message: 'An async callback inside `forEach` swallows promises. You should either convert to `for...of` syntax, or swap `forEach` for `map` and wrap in a `Promise.all`.',
          fix(fixer) {
            if (node.parent.type !== 'ExpressionStatement' && node.parent.type !== 'ChainExpression') {
              return;
            }

            let element = functionExpression.params[0];
            let rightAssignment;

            if (element?.type === 'AssignmentPattern') {
              rightAssignment = sourceCode.getText(element.right);
              element = element.left;
            }

            let array = sourceCode.getText(node.callee.object);

            let object = memberExpression;

            while (object.type === 'MemberExpression' && !object.optional) {
              object = object.object;
            }

            if (object.optional) {
              array = `${array} ?? []`;
            }

            let body = functionExpression.body;
            let bodyType = body.type;

            body = sourceCode.getText(body);

            if (bodyType === 'BlockStatement') {
              body = body.substring(1, body.length - 1);
            }

            if (functionExpression.params.length === 1) {
              // no way to do this in JS
              // for (let { bar } = baz of foo) {}
              if (!(element.type === 'ObjectPattern' && rightAssignment)) {
                element = sourceCode.getText(element);

                let assignment = rightAssignment ? `${element} ??= ${rightAssignment};` : '';

                body = `${assignment}${body}`;

                return fixer.replaceText(node, `for (let ${element} of ${array}) {${body}}`);
              }
            }

            if (element) {
              element = sourceCode.getText(element);
            }

            let index = functionExpression.params[1];

            if (index?.type === 'AssignmentPattern') {
              index = index.left;
            }

            index = index?.name ?? 'i';

            let defaultValue = rightAssignment ? ` ?? ${rightAssignment}` : '';
            let assignment = element ? `let ${element} = ${array}[${index}]${defaultValue};` : '';

            body = `${assignment}${body}`;

            return fixer.replaceText(node, `for (let ${index} = 0; ${index} < ${array}.length; ${index}++) {${body}}`);
          }
        });
      }
    };
  }
};
