class Narration7 extends Phaser.Scene
{
    constructor() {
        super("narration7Scene")
    }

    create() {
        //white background
        this.cameras.main.setBackgroundColor('#ffffff')

        //full narration text
        const fullText = 'Oh, the stabilizer was hidden under the sand.'
        let displayed = ''
        let i = 0
        this.typingDone = false

        //narration text object
        this.narrationText = this.add.text(game.config.width/2, game.config.height/2, '', {
            fontFamily: 'Palatino, serif',
            fontSize: '24px',
            color: '#3a2424',
            wordWrap: { width: 700 },
            align: 'center'
        }).setOrigin(0.5)

        //typewriter effect
        this.time.addEvent({
            delay: 50,
            repeat: fullText.length - 1,
            callback: () => {
                displayed += fullText[i]
                this.narrationText.setText(displayed)
                i++

                if (i >= fullText.length) {
                    this.typingDone = true
                    this.promptText.setVisible(true)
                }
            }
        })

        //prompt text
        this.promptText = this.add.text(game.config.width/2, game.config.height/2 + 90, 'Click to continue', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#6b3e2e'
        }).setOrigin(0.5).setVisible(false)

        //click to return to island once typing is done
        this.input.on('pointerdown', () => {
            if (this.typingDone) {
                const islandScene = this.scene.get('islandScene')
        
                //if parts found on the island is 5 or more (for some reason, bc setting it to = doesn't work? idk i js tried it and it works...), go to narration8
                if (islandScene.partsFound >= 5) 
                {
                    this.scene.stop('islandScene')
                    this.scene.start('narration8Scene')
                } 
                else 
                {
                    this.scene.stop()
                    this.scene.resume('islandScene')
                }
            }
        })
    }

    update() {

    }
}