// Name: Hyab Isayas
// Game title: What I did last week
// Hours: 4+6+

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play, Island, Star]
  }


let game = new Phaser.Game(config)

// reserve keyboard bindings for our keybindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT


// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3