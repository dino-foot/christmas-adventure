export default class Player {
    scene;
    config = {
        PlayerAcceleration: 0.01,
        PlayerDeacceleration: -0.005,
        maxVelocity: 2,
    };
    acceleration = 0;
    velocity = 0;
    snowManBody;
    snowManHead;

    constructor(sceneObj) {
        this.scene = sceneObj;
        this.addPlayer();
    }

    addPlayer() {
        // this.playerBody = this.scene.matter.add.polygon(
        //   this.scene.game.config.width / 8 + 25,
        //   25,
        //   12,
        //   45,
        //   {
        //     friction: 0,
        //     restitution: 0,
        //   }
        // );

        this.snowManBody = this.scene.matter.add.image(
            this.scene.game.config.width / 8 + 25,
            25,
            "snowball"
        );
        this.snowManBody.setBounce(0.25);
        this.snowManBody.setFriction(0.2, 0.02, 0);
        this.snowManBody.setMass(1);
        //this.snowManBody.thrust(0.08); //onupdate
        //this.snowManBody.setAngularVelocity(0.1);

        this.snowManBody.setScale(0.1);

        this.snowManBody.setBody({
            type: "circle",
            radius: 80,
        });
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
        // this.scene.matter.body.setAngularVelocity(this.snowManBody, this.velocity);
        this.snowManBody.setAngularVelocity(this.velocity);
    }
}
