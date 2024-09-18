import { GAMEOPTIONS } from '../js/GameOptions.js'
import SquareText from '../js/SquareText.js'
import { updatePlayerBalance } from "../js/request.js";
// import * as adMob from '../../js/index.js'

let item
const Random = Phaser.Math.Between
export default class PopupNextLevel extends Phaser.Scene {


    constructor() {
        super({ key: 'popup_nextlevel' })
    }

    create() {

        let rec = this.add.rectangle(this.game.config.width / 2, this.game.config.height / 2, 720, 1280, 0x000000, 0.6)
        let popup = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'popup')
        this.level_text = new SquareText(this, this.game.config.width / 2, 360, "font", 'CLEAR ', 80).setOrigin(0.5);
        this.add.existing(this.level_text);

        let btnNextLevel = this.add.image(this.game.config.width / 2, 900, 'btnPlay').setScale(1.5).setInteractive();
        this.textNextLevel = new SquareText(this, btnNextLevel.x, btnNextLevel.y, "font", 'Next Level', 45 * GAMEOPTIONS.dpi).setOrigin(0.5);
        this.add.existing(this.textNextLevel)
        btnNextLevel.on('pointerdown', function (pointer) {
            tweenAdd(this.scene, btnNextLevel, 'btnNextLevel')
        });

        let i = Random(0, 100)
        if (i >= 0 && i <= 40) item = 'item1'
        if (i > 40 && i <= 80) item = 'item2'
        if (i > 80 && i <= 100) item = 'item3'

        const score = Random(4000, 6000); // 生成 4000 到 6000 之间的随机分数
        this.scoreText = new SquareText(this, this.game.config.width / 2, 450, "font", `You Got: ${score} uPoYs!`, 50).setOrigin(0.5); // 显示分数
        this.add.existing(this.scoreText);
        updatePlayerBalance(score); // 调用 updatePlayerBalance 函数

        this.borderItem = this.add.rectangle(360, 630, 300, 300).setStrokeStyle(2, '0xffffff');
        this.light = this.add.image(360, 580, 'light');
        this.light.alpha = 0.8;
        this.item_icon = this.add.image(360, 580, item).setScale(0.3);

        this.btnFreeItem = this.add.image(this.game.config.width / 2, 725, 'btnVideo').setScale(1.3).setInteractive();
        this.btnFreeItem.tint = '0xF66B0E';

        // this.video_icon = this.add.image(this.btnFreeItem.x - 70, this.btnFreeItem.y - 2, 'video_icon').setScale(0.04);
        this.btnText = new SquareText(this, this.btnFreeItem.x, this.btnFreeItem.y + 2, 'font', '-200 UPOY ', 35);
        this.add.existing(this.btnText);

        this.btnFreeItem.on('pointerdown', () => {
            tweenAdd(this, this.btnFreeItem, 'btnFreeItem');
        });
    }
}

function onComplete(btnType) {
    switch (btnType) {
        case 'btnNextLevel':
            this.scene.start('PlayGame')
            break;
        case 'btnFreeItem':
            if (GAMEOPTIONS.ads.isAds) {
                GAMEOPTIONS.reward.type = item
                //adMob.showInterstitialAd1(this)  
                // adMob.showReward1(this)  
                const balance = localStorage.getItem('Balance')
                if (balance > 200) {
                    updatePlayerBalance(-200)
                    handleReward(this)

                    // 隐藏或销毁所有元素
                    this.borderItem.visible = false;  // 或者 this.borderItem.destroy();
                    this.light.visible = false;       // 或者 this.light.destroy();
                    this.item_icon.visible = false;   // 或者 this.item_icon.destroy();
                    this.btnFreeItem.visible = false; // 或者 this.btnFreeItem.destroy();
                    // this.video_icon.visible = false;  // 或者 this.video_icon.destroy();
                    this.btnText.visible = false;     // 或者 this.btnText.destroy();
                }
            }
            break;

        default:
            break;
    }

}

function handleReward(scene, index) {
    switch (GAMEOPTIONS.reward.type) {
        case 'ball':
            eventsCenter.emit('ads-ball', index)
            break;
        case 'pad':
            eventsCenter.emit('ads-pad', index)
            break;
        case 'item1':
            scene.scene.launch('popup_reward')
            break;
        case 'item2':
            scene.scene.launch('popup_reward')
            break;
        case 'item3':
            scene.scene.launch('popup_reward')
            break;
        default:
            break;
    }
}

function tweenAdd(scene, a, btnType) {
    scene.tweens.add({
        targets: a,
        scale: { from: a.scale - 0.15, to: a.scale },
        ease: 'Bounce',
        duration: 500,
        onComplete: onComplete.bind(scene, btnType),
    })
}