class Narration3 extends Phaser.Scene
{
    constructor() {
        super("narration3Scene")
    }

    create() {
        //white background
        this.cameras.main.setBackgroundColor('#ffffff')

        //full narration text
        const fullText = 'It was easiest to find my propeller because it was in plain sight.'
        let displayed = ''
        let i = 0
        this.typingDone = false

        //narration text object
        this.narrationText = this.add.text(game.config.width/2, game.config.height/2, '', {
            fontFamily: 'Palatino, serif',
            fontSize: '24px',
            color: '#3a2424',
            wordWrap: { width: 600 },
            align: 'center'
        }).setOrigin(0.5)

        //I use this method instead of typechunks instead. typechunks is better (and easier to read imo) for longer text that are different paragraphs.
        //This method is simple for just one line of narration
        this.time.addEvent({
            delay: 50,
            repeat: fullText.length - 1,
            callback: () => {
                displayed += fullText[i]
                this.narrationText.setText(displayed)
                i++

                //set flag when typing is done
                if (i >= fullText.length) {
                    this.typingDone = true
                    this.promptText.setVisible(true)
                }
            }
        })

        //prompt text - hidden until typing is done
        this.promptText = this.add.text(game.config.width/2, game.config.height/2 + 80, 'Click to continue', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#6b3e2e'
        }).setOrigin(0.5).setVisible(false)

        //click to return to island once typing is done
        this.input.on('pointerdown', () => {
            if (this.typingDone) {
                this.scene.stop()
                this.scene.resume('islandScene')
            }
        })
    }

    update() {

    }
}