basic.forever(function () {
    if (robots.getSensorVar() > 500) {
        robots.inputMoter(1023, 1023)
    } else {
        robots.inputMoter(700, -700)
        basic.pause(150)
        robots.stopMoter()
        basic.pause(200)
        
    }
})
