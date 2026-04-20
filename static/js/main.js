const ingredients = document.getElementById('all-ingredients').children
var correctIngredients = ["baking_soda", "butter", "cocoa", "eggs", "flour", "milk", "sugar", "vanilla"]
var userIngredients = []


for (const ingredient of ingredients) {
    const styles = window.getComputedStyle(ingredient)
    let newX = styles.getPropertyValue('--x'), newY = styles.getPropertyValue('--y')
    let startX = styles.getPropertyValue('--x'), startY = styles.getPropertyValue('--y')

    ingredient.addEventListener('mousedown', mouseDown)

    function mouseDown(e) {
        e.preventDefault();
        startX = e.clientX
        startY = e.clientY

        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }

    function mouseMove(e) {
        newX = startX - e.clientX
        newY = startY - e.clientY

        startX = e.clientX
        startY = e.clientY

        ingredient.style.top = (ingredient.offsetTop - newY) + 'px'
        ingredient.style.left = (ingredient.offsetLeft - newX) + 'px'

        if (ingredient.id === "whisk"){
            detectMixMotion(ingredient, e)
        }
    }

    function mouseUp(e) {
        document.removeEventListener('mousemove', mouseMove)
        const bowl = document.getElementById("bowl-img")
        var collideWithBowl = boxCollision(ingredient, bowl)

        if (collideWithBowl && !userIngredients.includes(ingredient.id) && ingredient.id !== "whisk") {
            userIngredients.push(ingredient.id) 
            ingredient.classList.add("ingredients-img-bowl")
            ingredient.style.pointerEvents = "none"
        }

        if (userIngredients.length >= 8) {
            var isCorrectIngredients = checkIngredients(correctIngredients, userIngredients)
            if (isCorrectIngredients) {
               document.querySelectorAll('.ingredients-img-bowl').forEach((item) => {
                item.style.display ='none'

                // make unmixed batter image appear
                if (isCorrectIngredients && !(mixState.mixed)){
                    const batterImg = document.getElementById("batter-img-unmixed")
                batterImg.classList.remove("batter-img-hide")
                }
                
                
            })
                
            }
        }

        // whisk 
        if (ingredient.id === "whisk"){
            mixState.lastX = null
            mixState.direction = null
        }

        document.removeEventListener('mouseup', mouseUp)
    }
}

function boxCollision(object1, object2) {
    const rect1 = object1.getBoundingClientRect()
    const rect2 = object2.getBoundingClientRect()

    const hitPadding = 10
    const bowlLeft = rect2.left - hitPadding
    const bowlRight = rect2.right + hitPadding
    const bowlTop = rect2.top - hitPadding
    const bowlBottom = rect2.bottom + hitPadding

    return (
        rect1.right >= bowlLeft &&
        rect1.left <= bowlRight &&
        rect1.bottom >= bowlTop &&
        rect1.top <= bowlBottom
    )
} 

function checkIngredients(correct, user) {
    if (correct.length !== user.length) {
        return false
    }

    const sortedCorrect = [...correct].sort()
    const sortedUser = [...user].sort()

    for (let i = 0; i < sortedCorrect.length; i++) {
        if (sortedCorrect[i] !== sortedUser[i]) {
            return false
        }
    }

    return true
}


// mix logic 
function mixBatter(){
    const whisk = document.getElementById("whisk")
    const unmixedBatter = document.getElementById("batter-img-unmixed")

}


const mixState = {
    active: false,
    lastX : null,
    direction: null,
    swings: 0,
    mixed: false 
}

function resetMixState(){
    mixState.active = false
    mixState.lastX = null
    mixState.direction = null
    mixState.swings = 0
}

function detectMixMotion(whisk,e) {
    if (mixState.mixed) return

    const bowl = document.getElementById("bowl-img")
    const unmixedBatter = document.getElementById("batter-img-unmixed")
    const mixedBatter = document.getElementById("batter-img-mixed")

    // only mix when can mix
    if (!unmixedBatter || unmixedBatter.classList.contains("batter-img-hide")) return
    if(!boxCollision(whisk,bowl)){
        resetMixState()
        return
    }

    if (mixState.lastX === null) {
        mixState.lastX = e.clientX // grab x and put it in 
        return
    }

    const dx = e.clientX - mixState.lastX // calc the change 
    mixState.lastX = e.clientX
    unmixedBatter.classList.add("rotate-batter")
    
    let newDirection = dx > 0? "right": "left"

    // count a swing when change direction
    if (mixState.direction && newDirection!== mixState.direction){
        mixState.swings +=1 
        console.log(`${mixState.swings} swings `)
    
    }
    mixState.direction = newDirection

    

    // adjust how much mixed
    if (mixState.swings >= 30){
        mixState.mixed =true
        unmixedBatter.classList.add("batter-img-hide")
        if (mixedBatter){
            mixedBatter.classList.remove("batter-img-hide")
            unmixedBatter.classList.add("batter-img-hide")
            console.log("Mixed")
        }
    }
}
