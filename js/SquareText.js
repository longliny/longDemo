export default class SquareText extends Phaser.GameObjects.BitmapText {
	constructor(scene, x, y, font, text, size,tint) {
		super(scene, x, y, font, text, size,tint);
		this.setOrigin(0.5);
        this.tint=tint
        this.align = 1
        this.setCenterAlign()

        //this.setScale(0.4);
        //this.setTint(tintColor);
	}
    updateText(text) {
        this.setText(text);
    }
}