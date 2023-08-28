# eslint-plugin-no-async-in-foreach

[![npm version](https://badge.fury.io/js/eslint-plugin-no-async-in-foreach.svg)](https://badge.fury.io/js/eslint-plugin-no-async-in-foreach)

Prevent `.forEach(async` code. Inspired by https://github.com/eslint/eslint/issues/16330.

### Usage

```js
{
  plugins: ['no-async-in-foreach'],
  rules: {
    'no-async-in-foreach/no-async-in-foreach': 'error'
  }
}
```
