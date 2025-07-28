function getLastNumber (exp) {
    return exp.match(/-?\d+(?:\.\d+)?(?=[^\d.]*$)/)?.[0] ?? ''
}

/**
 * 
 * @param {string} exp 
 * @returns {number}
 */
function getRightParenQuota (exp) {
    let result = 0
    exp.split('').forEach((char) => {
        switch (char) {
            case '(':
                result++
                break
            case ')':
                result--
                break
        }
    })
    return result
}

/**
 * 
 * @param {string} exp
 * @param {'(' | ')' | '÷' | '×' | '+' | '-' | '7' | '8' | '9' | '4' | '5' | '6' | '1' | '2' | '3' | '00' | '0' | '.'} char 
 * @returns 
 */
function handleExp (exp, char) {
    switch (char) {
        case '00':
        case '0':
            if (exp === '0') return '0'
            if (operators.map((ope) => ope.concat('0')).some((el) => exp.endsWith(el))) return exp
            if (exp.endsWith(')')) return exp.concat('×0')
            return exp.concat(char)
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            if (exp === '0') return char
            if (exp.endsWith(')')) return exp.concat('×').concat(char)
            return exp.concat(char)
        case '.':
            if (exp.endsWith(')')) return exp.concat('×0.')
            if (exp.endsWith('(')) return exp.concat('0.')
            if (exp.endsWith('.') || getLastNumber(exp).includes('.')) return exp
            if (operators.includes(exp[exp.length - 1])) return exp.concat('0').concat(char)
            return exp.concat(char)
        case '(':
            if (exp === '0') return char
            if (!operatorsWithoutRightParen.some((el) => exp.endsWith(el))) return exp.concat('×(')
            return exp.concat(char)
        case ')':
            if (exp === '0') return exp
            if (!getRightParenQuota(exp)) return exp
            if (operatorsWithoutRightParen.some((el) => exp.endsWith(el))) return exp
            return exp.concat(char)
        case '÷':
        case '×':
        case '+':
            if (['÷-', '×-', '+-', '(', '-'].some((el) => exp.endsWith(el))) return exp
            return exp.concat(char)
        case '-':
            if (exp === '0') return char
            if (exp.endsWith('+')) return exp.substring(0, exp.length - 1).concat(char)
            if (exp.endsWith('-')) return exp
            return exp.concat(char)
        default:
            console.error('Something wrong', exp, char)
    }
}

/**
 * @param {string} exp
 * @returns new result
 */
function backspace(exp) {
    if (exp.length === 1) return '0'
    return exp.substring(0, exp.length - 1)
}

function fillRightParens(exp) {
    let amount = getRightParenQuota(exp)
    if (amount) return exp.concat(')'.repeat(amount))
    return exp
}

function canCalculate (exp) {
    if (operatorsWithoutRightParen.some((ope) => exp.endsWith(ope))) return false
    let infixList = tokenize(fillRightParens(exp))
    if (!infixList || infixList.length < 3) return false
    return true
}

/**
 * @param {string} exp '-6×8-4+9÷2.5'
 * @returns {string[]} ['-6', '×', '8', '-', '4', '+', '9', '÷', '2.5']
 */
function tokenize(exp) {
    const rawTokens = exp.match(/\d+(?:\.\d+)?|[+\-×÷()]/g) ?? []
    const tokens = []
    let i = 0
    while (i < rawTokens.length) {
        const token = rawTokens[i]
        const prev = tokens.at(-1)
        const next = rawTokens[i + 1]
        if (token === '-' && (i === 0 || ['+', '-', '×', '÷', '('].includes(prev)) && /^\d+(\.\d+)?$/.test(next)) {
            tokens.push('-' + next)
            i += 2
            continue
        }
        tokens.push(token)
        i += 1
    }
    return tokens
}

/**
 * 
 * @param {'÷' | '×' | '-' | '+'} char 
 * @returns {-1 | -2} ÷× -> -+
 */
function getPriority(char) {
    return 0 - operatorPairs.findIndex((pair) => pair.includes(char))
}

/**
 * @param {string[]} infix
 * @returns {string[]} postfix list
 */
function infixToPostfix (infix) {
    let i = 0
    let stack = ['(']
    let result = []
    infix = [...infix, ')']
    while (i < infix.length) {
        let current = infix[i]
        switch (current) {
            case '(':
                stack.push(current)
                break
            case ')':
                while (stack.length && stack.at(-1) !== '(') {
                    result.push(stack.pop())
                }
                stack.pop()
                break
            case '÷':
            case '×':
            case '+':
            case '-':
                while (stack.length && stack.at(-1) !== '(' && (getPriority(stack.at(-1)) >= getPriority(current))) {
                    result.push(stack.pop())
                }
                stack.push(current)
                break
            default:
                result.push(current)
        }
        i += 1
    }
    return result
}

/**
 * @param {string} exp
 * @returns {string | null} new result
 */
function calculate (exp) {
    let infixList = tokenize(exp)
    let postfixList = infixToPostfix(infixList)
    let stack = []
    for (const token of postfixList) {
        if (!operators.includes(token)) {
            stack.push(new Big(token))
            continue
        }
        let b = stack.pop(), a = stack.pop(), result
        switch (token) {
            case '÷':
                result = a.div(b)
                break
            case '×':
                result = a.times(b)
                break
            case '+':
                result = a.plus(b)
                break
            case '-':
                result = a.minus(b)
                break
            default:
                console.error(token)
        }
        stack.push(result)
    }
    return stack[0].toString()
}
