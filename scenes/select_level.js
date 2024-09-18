import SquareText from '../js/SquareText.js'
import {GAMEOPTIONS} from '../js/GameOptions.js'
import eventsCenter from '../js/event.js'


export default class SelectLevel extends Phaser.Scene {

    constructor() {
        super({ key: 'select_level' })
    }

    preload ()
    {
         this.saveData = localStorage.getItem(GAMEOPTIONS.localStorageName) == null ? { level: 1} : JSON.parse(localStorage.getItem(GAMEOPTIONS.localStorageName));
    }

    create()
    {
        // console.log('bbb')
        //this.scene.get('start_menu').events.on('myEvent', function (num) {console.log(num)});
        this.add.rectangle(this.game.config.width/2, this.game.config.height/2, 720 , 2000, '0x000', 0.7).setDepth(-1);
        

        //load popup
        this.popup= this.add.image(this.game.config.width/2,this.game.config.height/2,'popup').setScale(1.1,1.2)
        this.level_text = new SquareText(this, this.game.config.width/2,200, "font", 'Level '+GAMEOPTIONS.level.level_curent+'/'+GAMEOPTIONS.level.max_level, 32).setOrigin(0.5);
        this.add.existing(this.level_text);

        //load Tab
        let tabBall = this.add.image(180,335,'btnPlay2').setInteractive();
            tabBall.tint='0xF66B0E'
        let tabBall_txt=new SquareText(this, tabBall.x,tabBall.y, "font", 'Ball Skin ', 30).setOrigin(0.5);
        this.add.existing(tabBall_txt);

        let tabLevel = this.add.image(this.game.config.width/2,335,'btnPlay2').setInteractive();
            tabLevel.tint='0x112B3C'
        let tabLevel_txt=new SquareText(this, tabLevel.x,tabLevel.y, "font", 'Level ', 30).setOrigin(0.5);
        this.add.existing(tabLevel_txt);


        let tabPad = this.add.image(540,335,'btnPlay2').setInteractive();
            tabPad.tint='0xF66B0E'
        let tabPad_txt=new SquareText(this, tabPad.x,tabPad.y, "font", 'Baffle Skin ', 30).setOrigin(0.5);
        this.add.existing(tabPad_txt);


         //start button
        let btnPlay = this.add.image(this.game.config.width/2, 1000, 'btnPlay').setScale(1.3).setInteractive();
        this.textStart = new SquareText(this, btnPlay.x , btnPlay.y, "font", 'Play', 35 ).setOrigin(0.5);
        this.add.existing(this.textStart)

        let btnNext = this.add.image(570, btnPlay.y-2,'btnNext').setScale(1.3).setInteractive();
        
        let btnPre = this.add.image(150, btnPlay.y-2,'btnNext').setScale(1.3).setInteractive();
        btnPre.flipX = 90

        // Load Map
        this.scene.launch('popup_level');

        //close button
        let btnClose = this.add.rectangle(630,205,40,40).setStrokeStyle(2, '0xffffff').setInteractive();
        let icon_Close=this.add.image(btnClose.x, btnClose.y, 'btnClose').setScale(1)
            btnClose.on('pointerdown', function (pointer) {
                //console.log(this.scene.scene.isPaused('PlayGame'))
                if(!this.scene.scene.isPaused('PlayGame'))
                {
                    console.log('a')
                    this.scene.scene.sleep('popup_ball');
                    this.scene.scene.sleep('popup_pad');
                    this.scene.scene.sleep('popup_level');
                    this.scene.scene.sleep('select_level');
                    this.scene.scene.start('start_menu')
                }
                else{
                    console.log('b')
                    this.scene.scene.sleep('popup_ball');
                    this.scene.scene.sleep('popup_pad');
                    this.scene.scene.sleep('popup_level');
                    this.scene.scene.sleep('select_level');
                    this.scene.scene.run('PlayGame')
                }
              
            });

        
        
       
        tabBall.on('pointerdown', function (pointer) {
            tabActive(this.scene, tabBall,tabLevel,tabPad,'tabBall')
        });

        tabLevel.on('pointerdown', function (pointer) {
            tabActive(this.scene, tabBall,tabLevel,tabPad,'tabLevel')
        });

        tabPad.on('pointerdown', function (pointer) {  
            tabActive(this.scene, tabBall,tabLevel,tabPad,'tabPad')
        });

        btnPlay.on('pointerdown', function (pointer) {
            tweenAdd(this.scene,btnPlay,'btnPlay')
        });

        btnPre.on('pointerdown', function (pointer) {
            tweenAdd(this.scene,btnPre,'btnPre')
        });

        btnNext.on('pointerdown', function (pointer) {
            tweenAdd(this.scene,btnNext,'btnNext')
        });     
        
       
        tabActive(this, tabBall,tabLevel,tabPad,GAMEOPTIONS.tabActive)
        eventsCenter.on('tabActive', function(){
            //console.log(tabBall)
            tabActive(this, tabBall,tabLevel,tabPad,GAMEOPTIONS.tabActive)},this)

        

    }    
   
}


function tabActive(scene,tabBall,tabLevel,tabPad,btnType) {
    // console.log('a1')
    switch (btnType) {
        case 'tabBall':
            //console.log('ballll')
            scene.scene.sleep('popup_pad');
            scene.scene.sleep('popup_level');
            scene.scene.resume('popup_ball');
            scene.scene.setVisible(true, 'popup_ball');

 
            tabBall.tint='0x112B3C'
            tabLevel.tint='0xF66B0E'
            tabPad.tint='0xF66B0E'
            break;
        case 'tabLevel':
            scene.scene.sleep('popup_ball');
            scene.scene.sleep('popup_pad');
            scene.scene.resume('popup_level');
            scene.scene.setVisible(true, 'popup_level');
    
            tabBall.tint='0xF66B0E'   
            tabLevel.tint='0x112B3C'
            tabPad.tint='0xF66B0E'
            break;  
        case 'tabPad':
            scene.scene.sleep('popup_level');
            scene.scene.sleep('popup_ball');
            scene.scene.resume('popup_pad');
            scene.scene.setVisible(true, 'popup_pad');
         
            tabBall.tint='0xF66B0E'
            tabLevel.tint='0xF66B0E'
            tabPad.tint='0x112B3C'
                break;     
    
        default:
            break;
    }
    
}

function onComplete(btnType) {
    switch (btnType) {
        case 'btnPlay':
            this.scene.sleep('popup_ball');
            this.scene.sleep('popup_pad');
            this.scene.sleep('popup_level');
            this.scene.sleep('select_level');
            this.scene.start('PlayGame')
            break;
        case 'btnPre':
            if (GAMEOPTIONS.level.level_curent >1)
            {
                GAMEOPTIONS.level.level_curent= GAMEOPTIONS.level.level_curent -1;
                this.level_text.setText('Level '+GAMEOPTIONS.level.level_curent +  ' / '+GAMEOPTIONS.level.max_level)
                GAMEOPTIONS.tabActive='btnLevel'
                this.scene.restart('popup_level');
            } 
            break;
        case 'btnNext':
            if (GAMEOPTIONS.level.level_curent < this.saveData.level)
            {
                GAMEOPTIONS.level.level_curent++
                this.level_text.setText('Level '+GAMEOPTIONS.level.level_curent  + ' / '+GAMEOPTIONS.level.max_level)
                GAMEOPTIONS.tabActive='btnLevel'
                this.scene.restart('popup_level');
            }
            break;
        default:
            break;
    }
    
}

function tweenAdd(scene,a,btnType)
{
    scene.tweens.add({
        targets: a,
        scale: { from : a.scale-0.15, to : a.scale},
        ease: 'Bounce',
        duration: 500,
        onComplete: onComplete.bind(scene,btnType),
    })
}