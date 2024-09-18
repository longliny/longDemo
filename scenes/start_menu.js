import { GAMEOPTIONS } from '../js/GameOptions.js';
import SquareText from '../js/SquareText.js'


export default class StartMenu extends Phaser.Scene {

    constructor() {
        super({ key: 'start_menu' })
    }

    
    preload()
    {
        if (localStorage.getItem('data')==null) {
            this.data = this.cache.json.get('data');
            localStorage.setItem('data',JSON.stringify(this.data))
        } else {
            this.data=JSON.parse(localStorage.getItem('data'))
        }
      

    }

    create() {
        //BallController.addNewBall(this)

       
     
       if(!this.scene.isSleeping('popup_ball'))
       {
        this.scene.launch('popup_ball')
       }
       if(!this.scene.isSleeping('popup_pad'))
       {
        this.scene.launch('popup_pad')
       }
   

        GAMEOPTIONS.isPlaying=false
        this.logo1 = this.add.image(this.game.config.width/2,300 ,'logo1').setScale(1.5)
        this.logo = this.add.image(this.game.config.width/2,this.logo1.y + 290 ,'logo').setScale(0.5)

        //let btnStart = this.add.rectangle(this.game.config.width/2, this.logo.y+240, 200 , 65 , 0xff6699).setInteractive();
        let btnStart = this.add.image(this.game.config.width/2, this.logo.y+240, 'btnPlay').setScale(1.5).setInteractive();
        this.textStart = new SquareText(this, btnStart.x , btnStart.y, "font", 'Play', 35 ).setOrigin(0.5);
        this.add.existing(this.textStart);
        let groupStart=[btnStart,this.textStart]

        let btnLevel = this.add.image(this.game.config.width/2, btnStart.y+100, 'btnPlay').setScale(1.5).setInteractive();
        this.textLevel = new SquareText(this, btnLevel.x , btnLevel.y, "font", 'Level Select', 35 ).setOrigin(0.5);
        this.add.existing(this.textLevel);
        let groupLevel=[btnLevel,this.textLevel]
         
        btnStart.on('pointerdown', function (pointer) {
            tweenAdd(this.scene,btnStart,'btnStart')
        
        });

        btnLevel.on('pointerdown', function (pointer) {
            GAMEOPTIONS.tabActive='tabLevel'
            tweenAdd(this.scene,btnLevel,'btnLevel')
            if (!this.scene.scene.isSleeping('popup_ball')) {
                this.scene.scene.launch('popup_ball')
            }
            if (!this.scene.scene.isSleeping('popup_pad')) {
                this.scene.scene.launch('popup_pad')
            }       
        });

        CreateButtonGroup(this)

    }

  
}
function onComplete(a) {
    switch (a) {
        case 'btnStart':
            this.scene.sleep('popup_ball')
            this.scene.sleep('popup_pad')
            this.scene.start('PlayGame')
            break;
        case 'btnLevel':
            this.scene.start('select_level')
            break;
    
        default:
            break;
    }
    
}

function CreateButtonGroup(scene){
    let btnBall= scene.add.image(270, 1050, 'btnBG').setScale(0.4).setInteractive();
    let icon_ball = scene.add.image(btnBall.x,btnBall.y,'btnBall').setScale(0.25)
    btnBall.on('pointerdown', function (pointer) {
        GAMEOPTIONS.tabActive='tabBall'
        tweenAdd(this.scene,btnBall,'btnLevel')

    })

    let btnCart= scene.add.image(360, 1050, 'btnBG').setScale(0.4).setInteractive();
    let icon_cart = scene.add.image(btnCart.x,btnCart.y,'btnCart').setScale(0.25)
    btnCart.on('pointerdown', function (pointer) {
        GAMEOPTIONS.tabActive='tabBall'
        tweenAdd(this.scene,btnCart,'btnLevel')

    })

    let btnPad= scene.add.image(450, 1050, 'btnBG').setScale(0.4).setInteractive();
    let icon_pad = scene.add.image(btnPad.x,btnPad.y,'btnPad').setScale(0.25)
    btnPad.on('pointerdown', function (pointer) {
        GAMEOPTIONS.tabActive='tabPad'
        tweenAdd(this.scene,btnPad,'btnLevel')

    })


}

function tweenAdd(scene,a,name)
{
    scene.tweens.add({
        targets: a,
        scale: { from : a.scale-0.15, to : a.scale},
        ease: 'Bounce',
        duration: 500,
        onComplete: onComplete.bind(scene,name),
    })
}