let characters = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '.']
let operators = ['(', ')', '÷', '×', '+', '-']
let operatorsWithoutRightParen = operators.filter((ope) => ope !== ')')
let priority = {
    '÷': 2,
    '×': 2,
    '+': 1,
    '-': 1
}
