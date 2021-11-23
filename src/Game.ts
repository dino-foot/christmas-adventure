import logoUrl from "../public/sprites/phaser-logo.png";

export default class Game extends Phaser.Scene {
  terrainConfig = {
    // start vertical point of the terrain, 0 = very top; 1 = very bottom
    startTerrain: 1,
    amplitude: 100,
    slopeLength: [100, 350],
    mountainsAmount: 5,
    slopesPerMountain: 10,
  };
  constructor() {
    super("game");
  }

  init() {
    console.log("init");
  }

  preload() {
    this.load.image("logo", logoUrl);
  }

  create() {
    console.log("create");
    this.add.image(200, 200, "logo");

    //physics body
    const bodyPool = [];
    const bodyPoolId = [];

    let list: number[] = [];
    let mountainGraphics: Phaser.GameObjects.Graphics[] = [];
    const mountainStart = new Phaser.Math.Vector2(0, 0);

    for (let i = 0; i < this.terrainConfig.mountainsAmount; i++) {
      mountainGraphics[i] = this.add.graphics();
    }
  }
}
