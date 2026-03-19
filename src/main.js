// Name: Hyab Isayas
// Game title: What I did last week
// Hours: ~33-37
//Sources: Swithing from exiting Phaser to HTML https://stackoverflow.com/questions/65458003/how-to-embed-phaser3-game-into-html, switching between HTML and Phaser: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams, inputting data from other scenes: Source: https://docs.phaser.io/api-documentation/3.88.2/namespace/types-scenes, Pixel art + more settings in config: https://phaser.io/examples/v3.55.0/game-config/view/pixel-art-mode, Math: https://docs.phaser.io/phaser/concepts/math, Utils: https://docs.phaser.io/phaser/concepts/utils, Phaser: https://docs.phaser.io/api-documentation/function/utils, Events: https://docs.phaser.io/phaser/concepts/events

let config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 750,
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scene: [ Menu, Play, Island, Star, Narration1, Narration2, Narration3, Narration4, Narration5, Narration6, Narration7, Narration8, Narration9]
  }


let game = new Phaser.Game(config)

// wait for Phaser to finish loading
game.events.on('ready', () => {
  // check the URL for a ?scene= parameter
  const params = new URLSearchParams(window.location.search)
  const scene = params.get('scene')
  const state = params.get('state')

  // if a scene was specified in the URL, jump straight to it, source: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams 
  if (scene) {
      game.scene.start(scene)
      game.scene.stop('menuScene')
  }
})

// reserve keyboard bindings for our keybindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT


// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3