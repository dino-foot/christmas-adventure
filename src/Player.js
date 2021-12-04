export default class Player {
  scene;
  config = {
    PlayerAcceleration: 0.01,
    PlayerDeacceleration: -0.005,
    maxVelocity: 1.2,
  };
  acceleration = 0;
  velocity = 0;
  playerBody;

  constructor(sceneObj) {
    this.scene = sceneObj;
    this.addPlayer();
  }

  addPlayer() {
    this.playerBody = this.scene.matter.add.polygon(
      this.scene.game.config.width / 8 + 25,
      25,
      12,
      45,
      {
        friction: 1,
        restitution: 0,
      }
    );

    //todo add image and mass etc
    //console.log(poly);
  }

  accelerate() {
    console.log("acce");
    this.acceleration = this.config.PlayerAcceleration;
  }

  decelerate() {
    console.log("deacce");
    this.acceleration = this.config.PlayerDeacceleration;
  }

  update() {
    this.velocity += this.acceleration;

    this.velocity = Phaser.Math.Clamp(
      this.velocity,
      0,
      this.config.maxVelocity
    );
    this.scene.matter.body.setAngularVelocity(this.playerBody, this.velocity);
  }
}
