import { resetTimer, startTimer } from './timer.js'

function initStartScreen() {
    const startButton = document.getElementById('start-button')
    if (!startButton) {
        return
    }

    startButton.addEventListener('mousedown', handleStartClick)
}

function handleStartClick() {
    const startScreen = document.getElementById('start-screen')
    const gameScreen = document.getElementById('game-screen')

    if (startScreen) {
        startScreen.classList.add('img-hide')
    }

    if (gameScreen) {
        gameScreen.classList.remove('img-hide')
    }

    resetTimer()
    startTimer()
}

export { initStartScreen }
