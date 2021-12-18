import Phaser from "phaser";
import Preloader from "./Preloader";
import Game from "./Game";
import GameOver from "./Gameover";

const config = {
    type: Phaser.AUTO,
    backgroundColor: "123684",
    audio: {
        disableWebAudio: true,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game",
        width: 1334,
        height: 750,
    },
    physics: {
        default: "matter",
        matter: {
            fps: 60,
            debugBodyColor: 0xff0000,
            debug: false,
            // gravity: {
            //     y: 20,
            // },
        },
    },
    scene: [Preloader, Game, GameOver],
};

const game = new Phaser.Game(config);
