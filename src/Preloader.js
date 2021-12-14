import snowBall from "../public/sprites/snowball.png";
import snowFlake from "../public/sprites/snowflake.png";
import snowMan from "../public/sprites/snowman.png";
import tree1 from "../public/sprites/tree-1.png";
import tree2 from "../public/sprites/tree-2.png";
import logoWhite from "../public/sprites/logo-white.png";
import logoBlue from "../public/sprites/logo-blue.png";
import logo from "../public/sprites/logo.svg";

// import snowManbody from '../public/sprites/body.png'
// import snowManHead from '../public/sprites/head-1.png'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    init() {
        this.load.on("progress", this.onLoading, this);
        this.load.on("complete", this.onCompleteLoading, this);
    }

    preload() {
        const svgConfig = {
            width: 400,
            height: 100,
        };
        this.load.image("snowball", snowBall);
        this.load.image("snowfake", snowFlake);
        this.load.image("snowman", snowMan);
        this.load.image("tree1", tree1);
        this.load.image("tree2", tree2);
        this.load.image("logoWhite", logoWhite);
        this.load.image("logoBlue", logoBlue);
        this.load.svg("logo", logo, svgConfig);
        // this.load.image('body', snowManbody)
        // this.load.image('head', snowManHead)
    }

    create() {}

    onLoading(progress) {
        // console.log("loading assets ", progress);
    }

    onCompleteLoading() {
        // console.log("loading assets done");
        this.scene.start("game");
    }
}
