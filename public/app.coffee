# CoffeeScript
animateComposer = ->
  console.log "Bluecamo composer ready"
  document.getElementById('mdInput')?.classList.add 'active'

document.addEventListener 'DOMContentLoaded', animateComposer
