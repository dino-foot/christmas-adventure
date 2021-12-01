import Phaser from "phaser";
import Preloader from "./Preloader";
import Game from "./Game";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "87ceeb",
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
      debugBodyColor: 0x000000,
      debug: true,
    },
  },
  scene: [Preloader, Game],
};

const game = new Phaser.Game(config);
