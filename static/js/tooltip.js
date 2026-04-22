function showWhiskTooltip(whisk){
    let tooltip = document.getElementById('whisk-tooltip')
    if (!tooltip){
        tooltip = document.createElement('div')
        tooltip.id = 'whisk-tooltip'
        tooltip.textContent = 'Hint: Move Left-Right to stir. Mix batter till its well mixed...'
        tooltip.style.position = 'absolute'
        tooltip.style.background = 'rgba(0,0,0,0.8)'
        tooltip.style.color = 'white'
        tooltip.style.padding = '5px 10px'
        tooltip.style.borderRadius = '5px'
        tooltip.style.fontSize = '14px'
        tooltip.style.pointerEvents = 'none'
        tooltip.style.zIndex = '10'
        document.body.appendChild(tooltip)
    }

    tooltip.style.display = 'block'

        function updateTooltip(e) {
        tooltip.style.left = (e.clientX + 10) + 'px'
        tooltip.style.top = (e.clientY + 10) + 'px'
    }

    whisk.addEventListener('mousemove', updateTooltip)
    whisk.addEventListener('mouseleave', () => {
        whisk.removeEventListener('mousemove', updateTooltip)
        hideWhiskTooltip()
    })

}

function hideWhiskTooltip(){
    const tooltip = document.getElementById('whisk-tooltip')
    if (tooltip){
        tooltip.style.display = 'none'
    }
}


export {showWhiskTooltip, hideWhiskTooltip}
