let timerInterval = null
let timerStart = null

function formatTimer(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const hundredths = Math.floor((milliseconds % 1000) / 10)

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(hundredths).padStart(2, '0')}`
}

function renderTimer() {
    const timeDisplay = document.getElementById('time')
    if (!timeDisplay || timerStart === null) {
        return
    }

    timeDisplay.textContent = formatTimer(Date.now() - timerStart)
}

function resetTimer() {
    const timeDisplay = document.getElementById('time')
    if (timeDisplay) {
        timeDisplay.textContent = '00:00:00'
    }
}

function startTimer() {
    stopTimer()
    timerStart = Date.now()
    renderTimer()
    timerInterval = window.setInterval(renderTimer, 10)
}

function stopTimer() {
    if (timerInterval !== null) {
        window.clearInterval(timerInterval)
        timerInterval = null
    }
}

export { startTimer, stopTimer, resetTimer }
