export default class GameOver extends Phaser.Scene {
    constructor() {
        super("gameover");
    }

    currentScore = 0;
    highScore = 0;

    init(data) {
        this.currentScore = data.currentScore;
        this.highScore = localStorage.getItem("score");
        // console.log("score ", data.currentScore);
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

        this.add
            .text(width * 0.5, height * 0.55, "Highscore : " + this.highScore, {
                fontSize: 26,
                color: "#ffffff",
            })
            .setOrigin(0.5);

        this.add
            .text(
                width * 0.5,
                height * 0.6,
                "Your Score : " + this.currentScore,
                {
                    fontSize: 26,
                    color: "#ffffff",
                }
            )
            .setOrigin(0.5);

        this.input.once("pointerdown", () => {
            this.scene.start("game");
        });

        // this.input.keyboard.once("keydown-SPACE", () => {
        //   this.scene.start("game");
        // });
    }
}
