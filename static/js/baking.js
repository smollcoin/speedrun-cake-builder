import { stopTimer, resetTimer } from './timer.js'
import { finishRunRequest } from './apiRequest.js'
import { clearCurrentRoundId, getCurrentRoundId } from './startScreen.js'

let finishLocked = false

function initBakingStage() {
    const nextButtonBake = document.getElementById("next-button-bake")
    if (!nextButtonBake) {
        return
    }

    nextButtonBake.addEventListener('mousedown', startBakingAnimation)

}

function startBakingAnimation() {
    const stage1 = document.getElementById("stage-1")
    const stage2 = document.getElementById("stage-2")

    const ovenImg = document.getElementById("oven-img")
    const cakeImg = document.getElementById("cake-img")

    const doneButton = document.getElementById("done-button")

    // Hide stage 1 and show stage 2
    stage1.classList.add("img-hide")

    stage2.classList.remove("img-hide")

    // cake
    setTimeout(() => {
        cakeImg.classList.remove("img-hide")

        // done button
        setTimeout(() => {
            doneButton.classList.remove("img-hide")
            doneButton.addEventListener('mousedown', handleDoneClick)
        }, 1000)
    }, 1000)
}

async function handleDoneClick() {
    if (finishLocked){
        return
    }

    const roundId = getCurrentRoundId()
    if (!roundId){
        alert('PLease press start first')
        return
    }
    stopTimer()

    // input name
    const nameInput = window.prompt("Enter your name to save score")
    if (!nameInput || !nameInput.trim()){
        alert("Name is required. Press Done again to enter")
        return
    }

    finishLocked = true

    const result = await finishRunRequest(roundId, nameInput.trim())

    finishLocked = false

    // call request 
    if (!result.ok){
        alert(result.error)
        return
    }

    alert(`Score saved ${result.score.elapsed_ms} ms`)

    clearCurrentRoundId()
    goToStartScreen()
    window.location.reload()


}


function goToStartScreen() {
    const startScreen = document.getElementById('start-screen')
    const gameScreen = document.getElementById('game-screen')

    const stage1 = document.getElementById('stage-1')
    const stage2 = document.getElementById('stage-2')
    const cakeImg = document.getElementById('cake-img')
    const doneButton = document.getElementById('done-button')
    const nextButton = document.getElementById('next-button-bake')

    if (gameScreen) {
        gameScreen.classList.add('img-hide')
    }

    if (startScreen) {
        startScreen.classList.remove('img-hide')
    }

    if (stage1) {
        stage1.classList.remove('img-hide')
    }

    if (stage2) {
        stage2.classList.add('img-hide')
    }

    if (cakeImg) {
        cakeImg.classList.add('img-hide')
    }

    if (doneButton) {
        doneButton.classList.add('img-hide')
    }

    if (nextButton) {
        nextButton.classList.add('img-hide')
    }

    resetTimer()
}

export { initBakingStage, startBakingAnimation }

