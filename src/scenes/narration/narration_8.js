class Narration8 extends Phaser.Scene
{
    constructor() {
        super("narration8Scene")
    }

    preload() {
        //audio
        this.load.audio('repair-jet', './assets/repair_jetSound.mp3')
    }

    create() {
        //black background
        this.cameras.main.setBackgroundColor('#000000')

        //full narration text
        const fullText = 'After getting all my parts for the airplane, I was able to repair it'
        let displayed = ''
        let i = 0
        this.typingDone = false

        //narration text object
        this.narrationText = this.add.text(game.config.width/2, game.config.height/2, '', {
            fontFamily: 'Palatino, serif',
            fontSize: '24px',
            color: '#ffffff',
            wordWrap: { width: 700 },
            align: 'center'
        }).setOrigin(0.5)

        //prompt text - hidden until typing is done
        this.promptText = this.add.text(game.config.width/2, game.config.height/2 + 90, 'Click to fly plane', {
            fontFamily: 'Georgia, serif',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false)

        //wait 1.5 seconds, then play repair sound and start typewriter effect
        this.time.delayedCall(1500, () => {
            this.sound.play('repair-jet')

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
        })

        //click to continue to star scene once typing is done
        this.input.on('pointerdown', () => {
            if (this.typingDone) {
                this.sound.stopByKey('repair-jet')
                this.scene.start('narration9Scene')
            }
        })
    }

    update() {

    }
}