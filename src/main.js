// Name: Hyab Isayas
// Game title: What I did last week
// Hours: 4+6+5

let config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 750,
    scene: [ Menu, Play, Island, Star]
  }


let game = new Phaser.Game(config)

// reserve keyboard bindings for our keybindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT


// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3