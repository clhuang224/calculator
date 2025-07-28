function getLastNumber (exp) {
    return exp.match(/-?\d+(?:\.\d+)?(?=[^\d.]*$)/)?.[0] ?? ''
}

/**
 * @param {'7' | '8' | '9' | '4' | '5' | '6' | '1' | '2' | '3' | '0' | '00' | '.'} char 
 * @param {string} exp
 * @returns new expression
 */
function appendCharacter (char, exp) {
    if (['0', '00'].includes(char)) {
        if (exp === '0') return '0'
        if (operators.map((ope) => ope.concat('0')).some((el) => exp.endsWith(el))) return exp
        if (exp.endsWith(')')) return exp.concat('0')
        return '0'
    }
    if (char === '.') {
        if (exp.endsWith(')')) return exp.concat('×0.')
        if (exp.endsWith('(')) return exp.concat('0.')
        if (exp.endsWith('.') || getLastNumber(exp).includes('.')) return exp
        if (operators.includes(exp[exp.length - 1])) return exp.concat('0').concat(char)
        return exp.concat(char)
    }
    if (exp.endsWith(')')) return exp.concat('×').concat(char)
    if (exp === '0') return char
    return exp.concat(char)
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
 * @param {'(' | ')' | '÷' | '×' | '+' | '-'} ope 
 * @param {string} exp
 * @returns new expression
 */
function appendOperator (ope, exp) {
    if (exp === '0') {
        if (['-', '('].includes(ope)) return ope
        if (ope === ')') return exp
        return exp.concat(ope)
    }
    let lastChar = exp[exp.length - 1]
    switch (ope) {
        case ')':
            if (!getRightParenQuota(exp)) return exp
            if (operatorsWithoutRightParen.includes(lastChar)) return exp
            break
        case '(':
            if (!operators.includes(lastChar) || lastChar === ')') return exp.concat('×(')
            break
        case '+':
        case '×':
        case '÷':
            if (operatorsWithoutRightParen.includes(lastChar)) {
                return exp.substring(0, exp.length - 1).concat(ope)
            }
            if (lastChar === '(') return exp
            break
        case '-':
            if (operatorsWithoutRightParen.includes(lastChar)) {
                return exp.substring(0, exp.length - 1).concat(ope)
            }
            if (lastChar === '-') return exp.substring(0, exp.length - 1).concat(ope)
    }
    return exp.concat(ope)
}

/**
 * @param {string} exp
 * @returns new result
 */
function backspace(exp) {
    if (exp.length === 1) return '0'
    return exp.substring(0, exp.length - 1)
}

function getPriority(str) {
    return priority?.[str] ?? 0
}

/**
 * @param {string[]} infix
 * @returns {string[]} postfix list
 */
function infixToPostfix (infix) {
    let i = 0
    let stack = []
    let result = []
    while (i <= infix.length) {
        let current = infix?.[i] ?? null
        switch (current) {
            case null:
                return result.concat(stack.slice().reverse())
            case '(':
                stack.push(current)
                break
            case '÷':
            case '×':
            case '+':
            case '-':
                while (stack.length && getPriority(stack[0]) >= getPriority(current)) {
                    result = [stack.pop(), ...result]
                }
                stack.push(current)
                break
            case ')':
                while (stack.length && stack[0] !== '(') {
                    result = [stack.pop(), ...result]
                }
                stack.pop()
                break
            default:
                result = result.concat(current)
        }
        i += 1
    }
}

/**
 * @param {string} exp
 * @returns {string | null} new result
 */
function calculate (exp) {
    if (operatorsWithoutRightParen.some((ope) => exp.endsWith(ope))) return null
    let infixList = (exp.concat(')'.repeat(getRightParenQuota(exp)))).match(/-?\d+(\.\d+)?|[+\-×÷]/g)
    if (infixList.length === 1) return null
    let postfixList = infixToPostfix(infixList)
    let result = new Big(postfixList.shift())
    while (postfixList.length) {
        let current = new Big(postfixList.shift())
        switch (postfixList.shift()) {
            case '+':
                result = result.plus(current)
                break
            case '-':
                result = result.minus(current)
                break
            case '×':
                result = result.times(current)
                break
            case '÷':
                result = result.div(current)
                break
        }
    }
    return result.toString()
}
