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
            if (exp === '0') return ope
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

/**
 * 
 * @param {string} char 
 * @returns {1 | 0 | -1 | -2} numbers -> () -> ÷× -> -+
 */
function getPriority(char) {
    return -operatorPairs.findIndex((pair) => pair.includes(char))
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
