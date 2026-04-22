import { stopTimer } from './timer.js'

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

function handleDoneClick() {
    stopTimer()
}

export { initBakingStage, startBakingAnimation }
