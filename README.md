# Calculator

A pure JavaScript calculator application with support for parentheses, decimal numbers, negative numbers, and operator precedence.

## How to Use

1. Visit [calculator.lynns.me](https://calculator.lynns.me) or open `index.html` locally in a browser.
2. Use the on-screen buttons to build an expression.
3. Press `=` to evaluate the current expression.
4. Press `C` to clear everything, or `⌫` to remove the last character.

### Supported Input

- Numbers: `0-9` and `00`
- Decimal point: `.`
- Operators: `+`, `-`, `×`, `÷`
- Parentheses: `(` and `)`

### Input Rules

- The calculator prevents invalid input such as repeated decimal points in the same number.
- If a number is entered immediately after `)`, the calculator inserts `×` automatically.
- If `(` is entered after a number, the calculator inserts `×(` automatically.
- Missing closing parentheses are completed automatically before evaluation.
- Expressions ending with an operator are not evaluated.

## Algorithm

This calculator evaluates expressions in three main steps:

1. Normalize the expression.
   User input is filtered and adjusted in real time by `handleExp()` so the expression stays valid while typing.

2. Tokenize the infix expression.
   `tokenize()` converts the expression string into tokens such as numbers, operators, and parentheses. It also merges unary minus with the following number, so values like `-2.5` are treated as one token.

3. Convert infix to postfix and evaluate it.
   `infixToPostfix()` uses a stack-based approach similar to the shunting-yard algorithm to apply operator precedence and parentheses correctly. The postfix expression is then evaluated in `calculate()` with another stack.

### Why Big.js Is Used

This project uses big.js to avoid the range and precision limitations of native JavaScript numbers, especially when expressions involve very large or very small values.

## Project Structure

- `index.html`: page structure
- `css/all.css`: calculator styles
- `js/consts.js`: constants for characters and operators
- `js/functions.js`: expression handling and calculation logic
- `js/main.js`: DOM setup and button events
- `favicon.svg`: site icon

## License

[MIT License.](./LICENSE)
