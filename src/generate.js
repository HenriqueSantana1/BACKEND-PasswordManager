const generate = ( CharNum, incUp, incNum, incSym) => {
    let Chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    let UpChars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    let NumChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let SymChars = [':',';','<','=','>','?','!','+','-','@','[',']','^','_','{','}','|','~']
    let password = ''

    if (incUp) {
        Chars = Chars.concat(UpChars)
    }
    if (incNum) {
        Chars = Chars.concat(NumChars)
    }
    if (incSym) {
        Chars = Chars.concat(SymChars)
    }

    let CharsLen = Chars.length

    for (let i = 0; i < CharNum; i++) {
        let x = Math.floor(Math.random() * CharsLen)
        password = password + Chars[x]
    }
    
    return password
}

module.exports = { generate }