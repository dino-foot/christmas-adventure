import logoUrl from "../public/sprites/phaser-logo.png"
import simplify from "./simplify"

export default class Game extends Phaser.Scene {
  terrainConfig = {
    // start vertical point of the terrain, 0 = very top; 1 = very bottom
    startTerrainHeight: 1,
    amplitude: 100,
    slopeLength: [100, 350],
    mountainsAmount: 5,
    slopesPerMountain: 10,
  }

  constructor() {
    super("game")
  }

  init() {
    console.log("init")
  }

  preload() {
    this.load.image("logo", logoUrl)
  }

  create() {
    console.log("create")
    //this.add.image(200, 200, "logo");

    //physics body
    const bodyPool = []
    const bodyPoolId = []

    let list = []
    let mountainGraphics = []
    //mountain start coordinate
    let mountainStart = new Phaser.Math.Vector2(0, 0)

    for (let i = 0; i < this.terrainConfig.mountainsAmount; i++) {
      mountainGraphics[i] = this.add.graphics() // each mountain is a graphic object
      mountainStart = this.generateTerrain(mountainGraphics[i], mountainStart)
    }
  }

  generateTerrain(graphics, mountainStart) {
    // array to store slope points
    let slopePoints = []
    let slopesCount = 0

    let slopeStart = new Phaser.Math.Vector2(0, mountainStart.y)
    let slopeLength = Phaser.Math.Between(
      this.terrainConfig.slopeLength[0],
      this.terrainConfig.slopeLength[1]
    )

    // determine slope end point, with an exception if this is the first slope of the fist mountain: we want it to be flat
    let slopeEnd =
      mountainStart.x == 0
        ? new Phaser.Math.Vector2(
            slopeStart.x + this.terrainConfig.slopeLength[1] * 1.5,
            0
          )
        : new Phaser.Math.Vector2(slopeStart.x + slopeLength, Math.random())

    let pointX = 0
    // while we have less slopes than regular slopes amount per mountain...
    while (slopesCount < this.terrainConfig.slopesPerMountain) {
      // slope interpolation value
      let interpolationVal = this.interpolate(
        slopeStart.y,
        slopeEnd.y,
        (pointX - slopeStart.x) / (slopeEnd.x - slopeStart.x)
      )
      // if current point is at the end of the slope...
      if (pointX == slopeEnd.x) {
        // increase slopes amount
        slopesCount++
        // next slope start position
        slopeStart = new Phaser.Math.Vector2(pointX, slopeEnd.y)
        // next slope end position
        slopeEnd = new Phaser.Math.Vector2(
          slopeEnd.x +
            Phaser.Math.Between(
              this.terrainConfig.slopeLength[0],
              this.terrainConfig.slopeLength[1]
            ),
          Math.random()
        )

        // no need to interpolate, we use slope start y value
        interpolationVal = slopeStart.y
      }
      // current vertical point
      let pointY =
        Number(this.game.config.height) *
          this.terrainConfig.startTerrainHeight +
        interpolationVal * this.terrainConfig.amplitude

      // add new point to slopePoints array
      slopePoints.push(new Phaser.Math.Vector2(pointX, pointY))
      // move on to next point
      pointX++
    } //end loop

    // simplify the slope
    let simpleSlope = simplify(slopePoints, 1, true)

    //todo change later
    return new Phaser.Math.Vector2(0, 0)
  }
  // method to apply a cosine interpolation between two points
  interpolate(vFrom, vTo, delta) {
    let interpolation = (1 - Math.cos(delta * Math.PI)) * 0.5
    return vFrom * (1 - interpolation) + vTo * interpolation
  }
} //end class
