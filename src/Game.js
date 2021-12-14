import Player from "./Player";
import simplify from "./simplify";

export default class Game extends Phaser.Scene {
    //terrain config
    terrainConfig = {
        // start vertical point of the terrain, 0 = very top; 1 = very bottom
        startTerrainHeight: 0.5,
        amplitude: 100,
        slopeLength: [200, 400],
        mountainsAmount: 4,
        slopesPerMountain: 5,
    };

    //physics body
    bodyPool = [];
    bodyPoolId = [];
    mountainGraphics = [];
    mountainStart;
    player;
    posToSpawn = [{}];

    constructor() {
        super("game");
    }

    init() {
        console.log("init");
        this.bodyPool.length = 0;
        this.bodyPoolId.length = 0;
        this.mountainGraphics.length = 0;
    }

    create() {
        console.log("create");
        this.add
            .image(85, this.game.config.height - 25, "logo")
            .setScale(0.5)
            .setDepth(10)
            .setOrigin(0.5)
            .setScrollFactor(0);

        // const snowball = this.matter.add.image(100, 50, "snowball").setScale(0.1);
        // snowball.setBody({ type: "circle", radius: 85 });
        // // snowball.setVelocity(10, 0);
        // snowball.setAngularVelocity(0.01);
        // snowball.setBounce(0.25);
        // snowball.setFriction(0.01, 0.02, 0);
        // snowball.setMass(10);
        // snowball.thrust(0.08); //onupdate
        // snowball.setAngularVelocity(0.1);

        //mountain start coordinate
        this.mountainStart = new Phaser.Math.Vector2(0, -1);

        for (let i = 0; i < this.terrainConfig.mountainsAmount; i++) {
            this.mountainGraphics[i] = this.add.graphics(); // each mountain is a graphic object
            this.mountainStart = this.generateTerrain(
                this.mountainGraphics[i],
                this.mountainStart
            );
        }

        //add player to the scene
        //this.addPlayer();
        this.player = new Player(this);
        this.input.on("pointerdown", this.player.accelerate, this.player);
        this.input.on("pointerup", this.player.decelerate, this.player);

        //this.matter.world.on("collisionstart", this.onCollision, this);
        this.player.playerBody.setOnCollide((pair) => {
            //todo gameover if label === tree
            //todo score if label === snowflake
            if (pair.bodyB.label === "tree") {
                this.scene.start("gameover");
                console.log("gameover");
            }
            // console.log(
            //     `bodyA ${pair.bodyA.label} vs bodyB ${pair.bodyB.label}`
            // );
        });
    }

    update() {
        if (this.player) {
            this.cameras.main.scrollX =
                this.player.playerBody.x - this.game.config.width / 8;

            this.player.update();
        }

        // loop through all mountains
        this.mountainGraphics.forEach(
            function (item) {
                // if the mountain leaves the screen to the left...
                if (this.cameras.main.scrollX > item.x + item.width + 100) {
                    // reuse the mountain
                    console.log("reuse");
                    this.mountainStart = this.generateTerrain(
                        item,
                        this.mountainStart
                    );
                    // this.spawnTree();
                }
            }.bind(this)
        );

        // // get all bodies
        const bodies = this.matter.world.localWorld.bodies;

        // // loop through all bodies
        bodies.forEach(
            function (body) {
                // if the body is out of camera view to the left side and is not yet in the pool..
                if (
                    this.cameras.main.scrollX > body.position.x + 200 &&
                    this.bodyPoolId.indexOf(body.id) == -1
                ) {
                    // ...add the body to the pool
                    this.bodyPool.push(body);
                    this.bodyPoolId.push(body.id);
                }
            }.bind(this)
        );
    } // end update

    generateTerrain(graphics, mountainStart) {
        // array to store slope points
        let slopePoints = [];
        let slopesCount = 0;

        let slopeStart = new Phaser.Math.Vector2(0, mountainStart.y);
        let slopeLength = Phaser.Math.Between(
            this.terrainConfig.slopeLength[0],
            this.terrainConfig.slopeLength[1]
        );

        // determine slope end point, with an exception if this is the first slope of the fist mountain: we want it to be flat
        let slopeEnd =
            mountainStart.x == 0
                ? new Phaser.Math.Vector2(
                      slopeStart.x + this.terrainConfig.slopeLength[1] * 1.5,
                      0
                  )
                : new Phaser.Math.Vector2(
                      slopeStart.x + slopeLength,
                      Math.random() * -1
                  );

        let pointX = 0;
        // while we have less slopes than regular slopes amount per mountain...
        while (slopesCount < this.terrainConfig.slopesPerMountain) {
            let interpolationVal = this.interpolate(
                slopeStart.y,
                slopeEnd.y,
                (pointX - slopeStart.x) / (slopeEnd.x - slopeStart.x)
            );

            // if current point is at the end of the slope...
            if (pointX == slopeEnd.x) {
                // increase slopes amount
                slopesCount++;
                // next slope start position
                slopeStart = new Phaser.Math.Vector2(pointX, slopeEnd.y);
                // next slope end position
                slopeEnd = new Phaser.Math.Vector2(
                    slopeEnd.x +
                        Phaser.Math.Between(
                            this.terrainConfig.slopeLength[0],
                            this.terrainConfig.slopeLength[1]
                        ),
                    Math.random()
                );

                // no need to interpolate, we use slope start y value
                interpolationVal = slopeStart.y;
            }
            // current vertical point
            let pointY =
                Number(this.game.config.height) *
                    this.terrainConfig.startTerrainHeight +
                interpolationVal * this.terrainConfig.amplitude;

            // add new point to slopePoints array
            slopePoints.push(new Phaser.Math.Vector2(pointX, pointY));
            // move on to next point
            pointX++;
        } //end loop

        // simplify the slope
        let simpleSlope = simplify(slopePoints, 1, true);

        // place graphics object
        graphics.x = mountainStart.x;

        // draw the ground
        this.drawGround(graphics, simpleSlope, pointX);

        // loop through all simpleSlope points starting from the second
        for (let i = 1; i < simpleSlope.length; i++) {
            // define a line between previous and current simpleSlope points
            let line = new Phaser.Geom.Line(
                simpleSlope[i - 1].x,
                simpleSlope[i - 1].y,
                simpleSlope[i].x,
                simpleSlope[i].y
            );

            // calculate line length, which is the distance between the two points
            let distance = Phaser.Geom.Line.Length(line);

            // calculate the center of the line
            let center = Phaser.Geom.Line.GetPoint(line, 0.5);

            // calculate line angle
            let angle = Phaser.Geom.Line.Angle(line);

            // if the pool is empty...
            if (this.bodyPool.length == 0) {
                // create a new rectangle body
                this.matter.add.rectangle(
                    center.x + mountainStart.x,
                    center.y,
                    distance,
                    10,
                    {
                        label: "terrain",
                        isStatic: true,
                        angle: angle,
                        friction: 1,
                        restitution: 0,
                    }
                );
            }

            // if the pool is not empty...
            else {
                // get the body from the pool
                let body = this.bodyPool.shift();
                this.bodyPoolId.shift();

                // reset, reshape and move the body to its new position
                this.matter.body.setPosition(body, {
                    x: center.x + mountainStart.x,
                    y: center.y,
                });
                let length = body.area / 10;
                this.matter.body.setAngle(body, 0);
                this.matter.body.scale(body, 1 / length, 1);
                this.matter.body.scale(body, distance, 1);
                this.matter.body.setAngle(body, angle);

                //todo spawn tree
                if (i == 2 || i == 5) {
                    this.spawnTree({
                        x: center.x + mountainStart.x,
                        y: center.y - 120,
                    });
                    console.log("pos to spawn");
                }
            }

            // this.posToSpawn.push({
            //     x: center.x + mountainStart.x,
            //     y: center.y,
            // });
        }

        // assign a custom "width" property to the graphics object
        graphics.width = pointX - 1;
        //todo change later
        return new Phaser.Math.Vector2(graphics.x + pointX - 1, slopeStart.y);
    }

    drawGround(graphics, simpleSlope, pointX) {
        graphics.clear();
        graphics.moveTo(0, this.game.config.height);
        graphics.fillStyle(0xe44d0be);
        graphics.beginPath();
        simpleSlope.forEach(
            function (point) {
                graphics.lineTo(point.x, point.y);
            }.bind(this)
        );
        graphics.lineTo(pointX, this.game.config.height);
        graphics.lineTo(0, this.game.config.height);
        graphics.closePath();
        graphics.fillPath();

        // draw the grass
        graphics.lineStyle(16, 0xfffafa);
        graphics.beginPath();
        simpleSlope.forEach(function (point) {
            graphics.lineTo(point.x, point.y);
        });
        graphics.strokePath();
    }

    spawnTree(pos) {
        // console.log(pos);
        let rnd = Phaser.Math.Between(0, 100);
        const key = rnd < 50 ? "tree1" : "tree2";

        const tree = this.matter.add
            .image(pos.x, pos.y, key)
            .setOrigin(1)
            .setScale(0.25)
            .setDepth(2)
            .setName("tree");
        tree.setBody(
            {
                type: "rectangle",
                width: 30,
                height: 200,
            },
            { label: "tree" }
        );
        tree.setMass(100);
        tree.setStatic(true);

        // tree.setVisible(false);
        // this.posToSpawn.length = 0;
    }

    onCollision(event, bodyA, bodyB) {
        //if (bodyA.label === "player")
        console.log(bodyB.label);
        // console.log("collide with tree, gameover ", bodyA);
    }

    // method to apply a cosine interpolation between two points
    // can achieve better results by using cubic interpolation or Bezier curves but it’s not in the scope of this tutorial.
    interpolate(vFrom, vTo, delta) {
        let interpolation = (1 - Math.cos(delta * Math.PI)) * 0.5;
        return vFrom * (1 - interpolation) + vTo * interpolation;
    }
} //end class
