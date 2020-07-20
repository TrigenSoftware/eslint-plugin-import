import { test, SYNTAX_CASES } from '../utils'
import { RuleTester } from 'eslint'

const ruleTester = new RuleTester()
    , rule = require('rules/match-default-export-name')

ruleTester.run('match-default-export-name', rule, {
  valid: [
    test({ code: 'import "./malformed.js"' }),

    test({ code: 'import myConstant from "./match-default-export-name/id";' }),
    test({ code: 'import myFunction from "./match-default-export-name/fn";' }),
    test({ code: 'import MyClass from "./match-default-export-name/class";' }),
    test({ code: 'import anyNameValue from "./match-default-export-name/expression";' }),

    // es7
    test({
      code: 'export myConstant from "./match-default-export-name/id";',
      parser: require.resolve('babel-eslint'),
    }),
    test({
      code: 'export myFunction from "./match-default-export-name/fn";',
      parser: require.resolve('babel-eslint'),
    }),
    test({
      code: 'export MyClass from "./match-default-export-name/class";',
      parser: require.resolve('babel-eslint'),
    }),
    test({
      code: 'export anyNameValue from "./match-default-export-name/expression";',
      parser: require.resolve('babel-eslint'),
    }),

    // #566: don't false-positive on `default` itself
    test({
      code: 'export default from "./bar";',
      parser: require.resolve('babel-eslint'),
    }),

    ...SYNTAX_CASES,
  ],

  invalid: [
    test({
      code: 'import foo from "./malformed.js"',
      errors: [{
        message: "Parse errors in imported module './malformed.js': 'return' outside of function (1:1)",
        type: 'Literal',
      }],
    }),


    test({
      code: 'import someConstant from "./match-default-export-name/id";',
      output: 'import myConstant from "./match-default-export-name/id";',
      errors: [{
        message: 'Expected import \'someConstant\' to match the default export \'myConstant\'.',
        type: 'ImportDefaultSpecifier',
      }],
    }),
    test({
      code: 'import myFnction from "./match-default-export-name/fn";',
      output: 'import myFunction from "./match-default-export-name/fn";',
      errors: [{
        message: 'Expected import \'myFnction\' to match the default export \'myFunction\'.',
        type: 'ImportDefaultSpecifier',
      }],
    }),
    test({
      code: 'import myClass from "./match-default-export-name/class";',
      output: 'import MyClass from "./match-default-export-name/class";',
      errors: [{
        message: 'Expected import \'myClass\' to match the default export \'MyClass\'.',
        type: 'ImportDefaultSpecifier',
      }],
    }),

    // es7
    test({
      code: 'export someConstant from "./match-default-export-name/id";',
      output: 'export myConstant from "./match-default-export-name/id";',
      parser: require.resolve('babel-eslint'),
      errors: [{
        message: 'Expected export \'someConstant\' to match the default export \'myConstant\'.',
        type: 'ExportDefaultSpecifier',
      }],
    }),
    test({
      code: 'export myFnction from "./match-default-export-name/fn";',
      output: 'export myFunction from "./match-default-export-name/fn";',
      parser: require.resolve('babel-eslint'),
      errors: [{
        message: 'Expected export \'myFnction\' to match the default export \'myFunction\'.',
        type: 'ExportDefaultSpecifier',
      }],
    }),
    test({
      code: 'export myClass from "./match-default-export-name/class";',
      output: 'export MyClass from "./match-default-export-name/class";',
      parser: require.resolve('babel-eslint'),
      errors: [{
        message: 'Expected export \'myClass\' to match the default export \'MyClass\'.',
        type: 'ExportDefaultSpecifier',
      }],
    }),
  ],
})
