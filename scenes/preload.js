import { GAMEOPTIONS } from '../js/GameOptions.js';
import { getBalance } from "../js/request.js";

export default class Preload extends Phaser.Scene {

    constructor() {
        super({ key: 'preload' })
    }

    preload() {
        getBalance()
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(200, 1280 / 2, 320, 50);

        var width = 720;
        var height = 1280;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 30,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 25,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(206, 1280 / 2 + 8, 300 * value, 30);
        });


        this.load.on('complete', function () {
            // progressBar.destroy();
            // progressBox.destroy();
            // loadingText.destroy();
            // percentText.destroy();

        });



        // Images
        this.load.image('play', 'assets/images/button.png')
        this.load.image('logo1', 'assets/images/brickbreaker.png')
        this.load.image('logo', 'assets/logo/brick_breaker_logo_512x512.png')
        this.load.image('guide', 'assets/images/540x960-guide.png')
        this.load.image('button', 'assets/images/button.png')
        this.load.image("circle", "assets/images/circle.png");
        this.load.image("blockboder", "assets/images/blockboder.png");
        this.load.image("blockboder1", "assets/tilesets/blockboder.png");
        this.load.image('bg', 'assets/images/background.png')
        this.load.image('player', 'assets/images/player.png')
        this.load.image("video_icon", "assets/images/video_icon.png")
        this.load.image("line", "assets/images/line.png")


        //load ball
        this.load.image('ball0', 'assets/ball/0.png')
        this.load.image('ball1', 'assets/ball/1.png')
        this.load.image('ball2', 'assets/ball/2.png')
        this.load.image('ball3', 'assets/ball/3.png')
        this.load.image('ball4', 'assets/ball/4.png')
        this.load.image('ball5', 'assets/ball/5.png')
        this.load.image('ball6', 'assets/ball/6.png')
        this.load.image('ball7', 'assets/ball/7.png')
        this.load.image('ball8', 'assets/ball/8.png')
        this.load.image('ball9', 'assets/ball/9.png')
        this.load.image('ball10', 'assets/ball/10.png')
        this.load.image('ball11', 'assets/ball/11.png')
        this.load.image('ball12', 'assets/ball/12.png')
        this.load.image('ball13', 'assets/ball/13.png')
        this.load.image('ball14', 'assets/ball/14.png')
        this.load.image('ball15', 'assets/ball/15.png')
        this.load.image('ball16', 'assets/ball/16.png')


        //load pad
        this.load.image('pad0', 'assets/pad/0.png')
        this.load.image('pad1', 'assets/pad/1.png')
        this.load.image('pad2', 'assets/pad/2.png')
        this.load.image('pad3', 'assets/pad/3.png')
        this.load.image('pad4', 'assets/pad/4.png')
        this.load.image('pad5', 'assets/pad/5.png')
        this.load.image('pad6', 'assets/pad/6.png')
        this.load.image('pad7', 'assets/pad/7.png')
        this.load.image('pad8', 'assets/pad/8.png')
        this.load.image('pad9', 'assets/pad/9.png')
        this.load.image('pad10', 'assets/pad/10.png')
        this.load.image('pad11', 'assets/pad/11.png')
        this.load.image('pad12', 'assets/pad/12.png')
        this.load.image('pad13', 'assets/pad/13.png')
        this.load.image('pad14', 'assets/pad/14.png')
        this.load.image('pad15', 'assets/pad/15.png')
        this.load.image('pad16', 'assets/pad/16.png')

        //load tilesets
        this.load.image("block_border_grey", "assets/tilesets/block_border_grey.png");
        this.load.image("block_blue", "assets/tilesets/block_blue.png");
        this.load.image("block_green", "assets/tilesets/block_green.png");
        this.load.image("block_pink", "assets/tilesets/block_pink.png");
        this.load.image("block_red", "assets/tilesets/block_red.png");
        this.load.image("block_white", "assets/tilesets/block_white.png");
        this.load.image("block_yellow", "assets/tilesets/block_yellow.png");
        this.load.image("block_xanhngoc", "assets/tilesets/block_xanhngoc.png");
        this.load.image("block_orange", "assets/tilesets/block_orange.png");

        //load popup
        this.load.image("popup", "assets/popup/popup.png")
        this.load.image("btnPlay", "assets/popup/btnPlay.png")
        this.load.image("btnPlay2", "assets/popup/btnPlay2.png")
        this.load.image("btnNext", "assets/popup/btnNext.png")
        this.load.image("btnClose", "assets/popup/btnClose.png")
        this.load.image("btnStore", "assets/popup/btnStore.png")
        this.load.image("btnVideo", "assets/popup/btnVideo.png")
        this.load.image("btnRestart", "assets/popup/btnRestart.png")
        this.load.image("btnPause", "assets/popup/btnPause.png")
        this.load.image("btnCart", "assets/popup/btnCart.png")
        this.load.image("btnBall", "assets/popup/btnBall.png")
        this.load.image("btnHome", "assets/popup/btnHome.png")
        this.load.image("btnReload", "assets/popup/btnReload.png")
        this.load.image("btnPad", "assets/popup/btnPad.png")
        this.load.image("btnBG", "assets/popup/btnBG.png")
        this.load.image("btnPlayContinue", "assets/popup/btnPlayContinue.png")





        this.load.image("light", "assets/popup/light.png")

        //load item
        this.load.image("item1", "assets/images/item1.png");
        this.load.image("item2", "assets/images/item2.png");
        this.load.image("item3", "assets/images/item3.png");

        this.load.image("block", "assets/images/block.png");
        this.load.image("block1", "assets/tilesets/block.png");

        this.load.image("topbar", "assets/images/topbar.png")
        this.load.image("heart", "assets/images/heart.png")
        this.load.bitmapFont("font", "assets/fonts/font.png", "assets/fonts/font.fnt");

        //load data ball
        this.load.json('data', "assets/data/data.json")

        //load audio
        this.load.audio('hit', "assets/audio/hit.mp3")
        this.load.audio('point', "assets/audio/point.mp3")
        this.load.audio('click', "assets/audio/click.mp3")

        //Hard Level
        //this.load.tilemapTiledJSON('hard_lv1', 'assets/tilemaps/hard_lv/lv1.json');


        // load level
        this.load.json('lv1', "assets/level/1.json")
        // this.load.json('lv2',"assets/level/2.json")
        // this.load.json('lv3',"assets/level/3.json")
        // this.load.json('lv4',"assets/level/4.json")
        // this.load.json('lv5',"assets/level/5.json")
        // this.load.json('lv6',"assets/level/6.json")
        // this.load.json('lv7',"assets/level/7.json")
        //this.load.json('lv'+GAMEOPTIONS.level.level_curent,"assets/level/"+GAMEOPTIONS.level.level_curent+".json")

        this.saveData = localStorage.getItem(GAMEOPTIONS.localStorageName) == null ? { level: 1 } : JSON.parse(localStorage.getItem(GAMEOPTIONS.localStorageName));
        GAMEOPTIONS.level.level_curent = this.saveData.level

    }

    create() {
        //         localStorage.clear('data')
        this.scene.start('start_menu');
    }
}
