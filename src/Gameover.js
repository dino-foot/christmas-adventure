export default class GameOver extends Phaser.Scene {
    constructor() {
        super("gameover");
    }

    create() {
        console.log("game-over scene");

        const width = this.scale.width;
        const height = this.scale.height;

        this.add
            .text(width * 0.5, height * 0.5, "Game Over ! Click to Restart", {
                fontSize: 26,
                color: "#ffffff",
            })
            .setOrigin(0.5);

        this.input.once("pointerdown", () => {
            this.scene.start("game");
        });

        // this.input.keyboard.once("keydown-SPACE", () => {
        //   this.scene.start("game");
        // });
    }
}
