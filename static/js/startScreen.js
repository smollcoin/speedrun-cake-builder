import { resetTimer, startTimer } from './timer.js'
import { getLeaderboardRequest, startRunRequest } from './apiRequest.js'

let currentRoundId = null

function getCurrentRoundId() {
    return currentRoundId

}

function clearCurrentRoundId() {
    currentRoundId = null
}

function initStartScreen() {
    const startButton = document.getElementById('start-button')
    if (startButton) {
        startButton.addEventListener('mousedown', handleStartClick)

    }

    loadLeaderboard()
}


// start click
async function handleStartClick() {
    const startResult = await startRunRequest()

    if (!startResult.ok) {
        alert(startResult.error)
        return
    }


    currentRoundId = startResult.roundId

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


// load leaderboard on home screen
async function loadLeaderboard() {
    const panel = document.getElementById('leaderboard-panel')
    const list = document.getElementById('leaderboard-list')

    if (!panel || !list) {
        return
    }

    list.innerHTML = '<li>Loading...</li>'

    const result = await getLeaderboardRequest(10)

    if (!result.ok) {
        list.innerHTML = `<li>${result.error}</li>`
        return
    }

    list.innerHTML = ''

    if (result.leaderboard.length === 0) {
        list.innerHTML = '<li>No scores yet</li>'
        return
    }

    for (const score of result.leaderboard) {
        const item = document.createElement('li')
        item.textContent = `${score.name} - ${score.elapsed_ms} ms`
        list.appendChild(item)
    }
}

export { initStartScreen, getCurrentRoundId, clearCurrentRoundId }
