let characters = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '.']
let operatorPairs = [['(', ')'], ['÷', '×'], ['-', '+']]
let operators = operatorPairs.flat()
let operatorsWithoutRightParen = operators.filter((ope) => ope !== ')')
