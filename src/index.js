import Phaser from "phaser";
import Game from "./Game";
import logoUrl from "../public/sprites/phaser-logo.png";

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
  scene: [Game],
};

const game = new Phaser.Game(config);

// function preload() {
//   this.load.image("logo", logoUrl);
// }

// function create() {
//   this.add.image(400, 300, "logo");
// }

// function update() {}
