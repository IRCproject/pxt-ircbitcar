basic.forever(function () {
    IRCbitCar.whileRunning(function () {
        // ここに好きなブロックを入れる（例：直進する）
        IRCbitCar.inputMoter(1023, 1023)
    })
})
