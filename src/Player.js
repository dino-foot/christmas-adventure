export default class Player {
    scene;
    config = {
        PlayerAcceleration: 0.05,
        PlayerDeacceleration: -0.05,
        maxVelocity: 20,
    };
    acceleration = 0;
    velocity = 0;
    playerBody;

    constructor(sceneObj) {
        this.scene = sceneObj;
        this.addPlayer();
    }

    reset() {
        console.log("reset player");
        this.playerBody.setActive(false);
        this.playerBody.setVisible(false);
    }

    addPlayer() {
        console.log("add player");
        this.playerBody = this.scene.matter.add
            .image(200, 200, "snowman", null)
            .setScale(0.35)
            .setOrigin(0.5)
            .setDepth(3)
            .setName("player");

        this.playerBody.setBody(
            {
                type: "circle",
                radius: 75,
            },
            { label: "player" }
        );
        this.playerBody.setFixedRotation();
        this.playerBody.setAngularVelocity(0);
        this.playerBody.setBounce(0.1);
        this.playerBody.setFriction(0.01, 0.005, 0);
        this.playerBody.setMass(20);
        // snowball.thrust(0.08);
        // snowball.setAngularVelocity(0.1);

        // this.playerBody = this.scene.matter.add.polygon(
        //     this.scene.game.config.width / 8 + 25,
        //     25,
        //     10,
        //     45,
        //     {
        //         friction: 1,
        //         restitution: 0,
        //         frictionAir: 0.01,
        //         torque: 0.4,
        //         // slop: 0.05,
        //         mass: 65,
        //     }
        // );
    }

    accelerate() {
        console.log("acce");
        if (this.playerBody) this.acceleration = this.config.PlayerAcceleration;
    }

    decelerate() {
        console.log("deacce");
        if (this.playerBody)
            this.acceleration = this.config.PlayerDeacceleration;
    }

    update() {
        if (this.playerBody !== undefined || this.playerBody !== null) {
            this.velocity += this.acceleration;
            this.velocity = Phaser.Math.Clamp(
                this.velocity,
                0,
                this.config.maxVelocity
            );

            // console.log("player update");
            this.playerBody.setVelocityX(this.velocity);
            // this.playerBody.setAngularVelocity(0);
            this.scene.matter.body.setAngularVelocity(
                this.playerBody,
                this.velocity
            );
        }
    }
}
