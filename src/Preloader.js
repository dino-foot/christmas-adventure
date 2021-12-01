import snowBall from "../public/sprites/snowball.png";
import snowFlake from "../public/sprites/snowflake.png";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  init() {
    this.load.on("progress", this.onLoading, this);
    this.load.on("complete", this.onCompleteLoading, this);
  }

  preload() {
    this.load.image("snowball", snowBall);
    this.load.image("snowfake", snowFlake);
  }

  create() {}

  onLoading(progress) {
    console.log("loading assets ", progress);
  }

  onCompleteLoading() {
    console.log("loading assets done");
    this.scene.start("game");
  }
}
