import {GAMEOPTIONS} from '../js/GameOptions.js'
import SquareText from '../js/SquareText.js'
// import * as adMob from '../../js/index.js'

let item
const Random = Phaser.Math.Between
export default class PopupPause extends Phaser.Scene {


    constructor() {
        super({ key: 'popup_pause' })
    }
    
    create() {

        console.log('vv')
        let rec = this.add.rectangle(this.game.config.width/2, this.game.config.height/2, 720 ,1280  , 0x000000,0.6)
        let popup= this.add.image(this.game.config.width/2,this.game.config.height/2,'popup')
        this.level_text = new SquareText(this, this.game.config.width/2 , 360, "font", 'PAUSE', 80).setOrigin(0.5);
        this.add.existing(this.level_text);

        let btnHome = this.add.image(260,900,'btnBG').setScale(0.4).setInteractive();
        let icon_home= this.add.image(btnHome.x,btnHome.y,'btnHome').setScale(0.25)
        btnHome.on('pointerdown', function (pointer) {
            tweenAdd(this.scene,btnHome,'btnHome')
        });

        let btnReload = this.add.image(360,900,'btnBG').setScale(0.4).setInteractive();
        let icon_reload= this.add.image(btnReload.x,btnReload.y,'btnReload').setScale(0.25)
        btnReload.on('pointerdown', function (pointer) {
            tweenAdd(this.scene,btnReload,'btnReload')
        });

        let btnContinue = this.add.image(460,900,'btnBG').setScale(0.4).setInteractive();
        let icon_continue= this.add.image(btnContinue.x,btnContinue.y,'btnPlayContinue').setScale(0.25)
        btnContinue.on('pointerdown', function (pointer) {
            tweenAdd(this.scene,btnContinue,'btnContinue')
           
        });

        let btnClose = this.add.rectangle(600,290,50,50).setStrokeStyle(2, '0xffffff').setInteractive();
        let icon_close= this.add.image(btnClose.x,btnClose.y,'btnClose')
        btnClose.on('pointerdown', function (pointer) {
            this.scene.scene.resume('PlayGame')
            this.scene.scene.sleep('popup_pause')
           
        });

        let i = Random(0,100)
        if(i>=0 && i <=40) item = 'item1'
        if(i>40 && i <=80) item = 'item2'
        if(i>80 && i <=100) item = 'item3'

        //console.log(i)
        // this.borderItem=this.add.rectangle(360,630,300,300).setStrokeStyle(2, '0xffffff');
        // let light = this.add.image(360,580,'light')
        //     light.alpha = 0.8
        // let item_icon= this.add.image(360,580,item).setScale(0.3)
        // let btnFreeItem = this.add.image(this.game.config.width/2,725,'btnVideo').setScale(1.3).setInteractive();
        //     btnFreeItem.tint='0xF66B0E'
        // let video_icon = this.add.image(btnFreeItem.x-70,btnFreeItem.y-2,'video_icon').setScale(0.04)
        // let btnText = new SquareText(this,btnFreeItem.x+30,btnFreeItem.y+2,'font','-200 UPOY',35)
        //     this.add.existing(btnText);

        // btnFreeItem.on('pointerdown', function (pointer) {
        //     tweenAdd(this.scene,btnFreeItem,'btnFreeItem')
        // });
    } 
}

function onComplete(a) {
    
    switch (a) {
        case 'btnHome':
            this.scene.stop('PlayGame')
            this.scene.sleep('popup_pause')
            this.scene.sleep('popup_level')
            this.scene.start('start_menu')
            break;
        case 'btnReload':
            this.scene.sleep('popup_pause')
            this.scene.start('PlayGame')
            break;
        case 'btnContinue':
            this.scene.resume('PlayGame')
            this.scene.sleep('popup_pause')
            break;
        case 'btnFreeItem':
            if(GAMEOPTIONS.ads){
                GAMEOPTIONS.reward.type=item
                //adMob.showInterstitialAd1(this)  
                // adMob.showReward1(this)  
            } 
            
            break;
    
        default:
            break;
    }
    
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
 