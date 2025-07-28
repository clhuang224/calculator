(function () {
    let lastExpElement = document.querySelector('.expression .last')
    let currentExpElement = document.querySelector('.expression .current')
    let clearElement = document.querySelector('.clear')
    let backspaceElement = document.querySelector('.backspace')
    let charactersElement = document.querySelector('.characters')
    let operatorsElement = document.querySelector('.operators')
    let equalElement = document.createElement('button')
    equalElement.innerText = '='
    equalElement.classList.add('equal')

    characters.forEach((char) => {
        let element = document.createElement('button')
        element.classList.add('character')
        element.innerText = char
        element.addEventListener('click', function () {
            if (lastExpElement.value) {
                lastExpElement.value = ''
                currentExpElement.value = '0'
            }
            currentExpElement.value = handleExp(currentExpElement.value, char)
            currentExpElement.scrollLeft = currentExpElement.scrollWidth
        })
        charactersElement.appendChild(element)
    })

    operators.forEach((ope) => {
        let element = document.createElement('button')
        element.classList.add('operator')
        element.innerText = ope
        element.addEventListener('click', function () {
            if (lastExpElement.value) {
                lastExpElement.value = ''
            }
            currentExpElement.value = handleExp(currentExpElement.value, ope)
            currentExpElement.scrollLeft = currentExpElement.scrollWidth
        })
        operatorsElement.appendChild(element)
    })
    operatorsElement.appendChild(equalElement)

    clearElement.addEventListener('click', function (){
        lastExpElement.value = ''
        currentExpElement.value = '0'
    })

    backspaceElement.addEventListener('click', function (){
        if (lastExpElement.value) {
            lastExpElement.value = ''
        }
        currentExpElement.value = backspace(currentExpElement.value)
    })

    equalElement.addEventListener('click', function () {
        if (!canCalculate(currentExpElement.value)) return
        lastExpElement.value = fillRightParens(currentExpElement.value)
        currentExpElement.value = calculate(lastExpElement.value)
    })
})()
