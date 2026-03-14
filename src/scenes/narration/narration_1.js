class Narration1 extends Phaser.Scene
{
    constructor() {
        super("narrationScene")
    }

    create() {
        //white background
        this.cameras.main.setBackgroundColor('#ffffff')

        //full narration text
        const fullText = 'Out of curiosity, you try to look closer at the front of the post card...'
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

        //typewriter effect - adds one character every 50ms
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
        this.promptText = this.add.text(game.config.width/2, game.config.height/2 + 80, 'Click to continue...', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#6b3e2e'
        }).setOrigin(0.5).setVisible(false)

        ////click to return to the front of the postcard once typing is done
        this.input.on('pointerdown', () => {
            if (this.typingDone) {
                this.scene.start('menuScene', { returnFromNarration: true }) //set the scene to the menu scene and make "returnFromNarration" -> true
            }
        })
    }

    update() {

    }
}