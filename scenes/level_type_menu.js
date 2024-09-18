//import * as test from './js/SquareText.js'
import {GAMEOPTIONS} from '../js/GameOptions.js'



export default class LevelTypeMenu extends Phaser.Scene {

    // Vars
    // handlerScene = false
    // sceneStopped = false

    constructor() {
        super({ key: 'level_type_menu' })
    }

    preload() {

        // this.sceneStopped = false
        // this.width = this.game.screenBaseSize.width
        // this.height = this.game.screenBaseSize.height
        // this.handlerScene = this.scene.get('handler')
        // this.handlerScene.sceneRunning = 'level_type_menu'
    }

    create() {
        // const { width, height } = this
        // // CONFIG SCENE         
        // this.handlerScene.updateResize(this)

        //localStorage.clear();

        
        
        let rec1 = this.add.rectangle(this.game.config.width/2, this.game.config.height/2-10, this.game.config.width -50 , 100, 0x6666ff,0.5);
        let rec2 = this.add.rectangle(this.game.config.width/2, this.game.config.height/2+100, this.game.config.width -50 , 100, 0x6666ff,0.5);
        var easy_level = this.add.text(this.game.config.width/2, this.game.config.height/2-10, "Easy Level", { font: "40px Arial Black" , align :'center'  }).setInteractive().setOrigin(0.5);
        var hard_level = this.add.text(this.game.config.width/2, this.game.config.height/2+100, "Hard Level", { font: "40px Arial Black", align :'center'  }).setInteractive().setOrigin(0.5);


        //var btnStart = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'heart').setInteractive();

        easy_level.on('pointerdown', function (pointer) {

                GAMEOPTIONS.level_type_menu='easy'
                // this.sceneStopped = true
                // this.scene.scene.stop('level_type_menu')
                // this.scene.handlerScene.launchScene('select_level')
                this.scene.scene.start('select_level')

        });

        hard_level.on('pointerdown', function (pointer) {

            GAMEOPTIONS.level_type_menu='hard'
            // this.sceneStopped = true
            // this.scene.scene.stop('level_type_menu')
            // this.scene.handlerScene.launchScene('select_level')
            this.scene.scene.start('select_level')

         });
    }

    
}