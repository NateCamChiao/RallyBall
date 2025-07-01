import { ClientPlayer, PlayerRenderer } from "./clientPlayer.js";
import { DIRECTION, PERFECT_SCALING_RATIO, PLAYER_ANIMATION, SCALING_UNIT_TO_PLAYER_SIZE } from "./constants.js";
import { InputHandler } from "./inputHandler.js";
import { ConnectionHandler, RealServerHandler, FakeServerHandler } from "./connections.js";


const GAMESTATE = {
    PAUSED: 0,
    UNPAUSED: 1,
}
let clientCamera = {
    x: 0,
    y: 0,
    currentPosition(){
        return {
            cameraX: 0,
            cameraY: 0
        }
    },
}
let clientBall = {
    x: 0,
    y: 0,
    r: 40,
}

export class Game{
    //rendering members
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    assets: { player: CanvasImageSource; scene: CanvasImageSource; };
    scalingUnit: number = 0;
    heightOffset: number = 0;
    scalingWidthOffset: number = 0;
    //game state members
    state: number;
    camera: { x: number; y: number; currentPosition(): { cameraX: number; cameraY: number; }; };
    ball: { x: number; y: number; r: number; };
    playerList: ClientPlayer[];

    inputHandler: any;
    connectionHandler: ConnectionHandler;
    stopUpdating: boolean;
    lastTimeStamp: number;
    constructor(canvas: HTMLCanvasElement, playerAssests: CanvasImageSource, sceneAssests: CanvasImageSource, connectionHandler = new FakeServerHandler(), gameState = GAMESTATE.UNPAUSED){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d") ?? new CanvasRenderingContext2D;
        this.ctx.textAlign = "center";
        this.assets = {
            player: playerAssests,
            scene: sceneAssests
        }

        this.state = gameState;
        this.camera = clientCamera;
        this.ball = clientBall;
        this.playerList = [new ClientPlayer(this.ctx, this.assets.player, this.serverToClientCoords.bind(this), this.scalingUnit * SCALING_UNIT_TO_PLAYER_SIZE)];
        this.inputHandler = new InputHandler(5);
        this.connectionHandler = connectionHandler;

        this.stopUpdating = false;
        this.lastTimeStamp = -1;
        this.setUpKeyListeners();
        this.findScalingUnit(canvas);
        this.ctx.font = PLAYER_ANIMATION.NAME_CONST.NAME_RATIO_TO_SCALING_UNIT * this.scalingUnit + "px san-serif"
        this.updateGame(0);
    }

    updateGame(currentTime: number){
        if(this.lastTimeStamp == -1){
            this.lastTimeStamp = currentTime;
        }
        
        let deltatime = currentTime - this.lastTimeStamp;
        this.lastTimeStamp = currentTime;
        this.drawScene(deltatime);
        if(!this.stopUpdating)
            requestAnimationFrame(this.updateGame.bind(this));
    }

    findScalingUnit(canvas: HTMLCanvasElement) {
        if (canvas.height * PERFECT_SCALING_RATIO >= canvas.width) {
            this.scalingUnit = canvas.width;
            this.scalingWidthOffset = 0;
            this.heightOffset = canvas.height - canvas.width / PERFECT_SCALING_RATIO;
        } else if (canvas.height * PERFECT_SCALING_RATIO < canvas.width) {
            this.scalingUnit = canvas.height * PERFECT_SCALING_RATIO; //0.71 finds target width 1.8 is much closer
            this.scalingWidthOffset = (canvas.width - this.scalingUnit) / 2; //half of the target width difference
            this.heightOffset = 0;
        }

        this.playerList.forEach(clientPlayer => clientPlayer.playerRenderer.updateScalingUnit(this.scalingUnit));
    }

    renderPlayers(deltatime: number){
        this.playerList.forEach(player => player.playerRenderer.render(deltatime));
    }

    serverToClientCoords(x: number, y: number){
        return {
            x: x / 200 * this.scalingUnit + this.scalingWidthOffset,
            y: y / 100 * (this.canvas.height - this.heightOffset) + this.heightOffset
        }
    }
    
    drawScene(deltatime: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        let {cameraX, cameraY} = this.camera.currentPosition();
        this.drawBlankBackground(this.camera.y);
        this.ctx.translate(this.camera.x, this.camera.y);
    
        this.drawBackground();
        this.drawCourt();
        const netDims = {
            w: this.scalingUnit * 0.04,
            h: this.scalingUnit * 0.04 * 5.1,
        };
        //net
        this.ctx.drawImage(
            this.assets.scene,
            0,
            0,
            181,
            943,
            this.canvas.width / 2 - netDims.w / 2,
            this.canvas.height - netDims.h,
            netDims.w,
            netDims.h
        );
        this.renderPlayers(deltatime);
        // drawClouds();
        this.ctx.translate(-this.camera.x, -this.camera.y); // restore translation
        this.ctx.beginPath();
        this.ctx.moveTo(this.scalingWidthOffset, 0);
        this.ctx.lineTo(this.scalingWidthOffset, 0);
        this.ctx.stroke();
    }
    //sets basic background color in case drawBackground() doesn't work
    drawBlankBackground(offset: number) {
       this.ctx.translate(0, offset);
       this.ctx.fillStyle = "#d6f2f9ff";
       this.ctx.fillRect(0, -offset, this.canvas.width, this.canvas.height);
       this.ctx.fillStyle = "#80e5ffff"; //water
       this.ctx.fillRect(
            0,
            this.canvas.height - this.scalingUnit * 0.24,
            this.canvas.width,
            this.scalingUnit * 0.04
        );
       this.ctx.fillStyle = "#ac9393ff"; //border
       this.ctx.fillRect(
            0,
            this.canvas.height - this.scalingUnit * 0.2,
            this.canvas.width,
            this.scalingUnit * 0.08
        );
    
       this.ctx.fillStyle = "#ffd42aff"; //sand
       this.ctx.fillRect(
            0,
            this.canvas.height - this.scalingUnit * 0.12,
            this.canvas.width,
            this.scalingUnit * 0.12 - offset
        );
       this.ctx.translate(0, -offset);
    }
    drawBackground() {
        //background
        this.ctx.fillStyle = "#d6f2f9ff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#80e5ffff"; //water
        this.ctx.fillRect(
            0,
            this.canvas.height - this.scalingUnit * 0.24,
            this.canvas.width,
            this.scalingUnit * 0.04
        );
        // drawCrowd();
        this.ctx.fillStyle = "#ac9393ff"; //border
        this.ctx.fillRect(
            -this.scalingUnit * 0.06,
            this.canvas.height - this.scalingUnit * 0.2,
            this.canvas.width + this.scalingUnit * 0.12,
            this.scalingUnit * 0.08
        );
    
       this.ctx.fillStyle = "#ffd42aff"; //sand
       this.ctx.fillRect(
            0,
            this.canvas.height - this.scalingUnit * 0.12,
            this.canvas.width,
            this.scalingUnit * 0.12
        );
    }
    drawCourt() {
        //these are the edges of the court
        //trust the magic
        const points = [
            {
                x: this.scalingUnit * 0.03 + this.scalingWidthOffset,
                y: this.canvas.height - this.scalingUnit * 0.03 * 0.24,
            },
            {
                x: this.scalingUnit * 0.06 + this.scalingWidthOffset,
                y: this.canvas.height - this.scalingUnit * 0.06 * 1.72,
            },
            {
                x: this.canvas.width - this.scalingUnit * 0.06 - this.scalingWidthOffset,
                y: this.canvas.height - this.scalingUnit * 0.06 * 1.72,
            },
            {
                x: this.canvas.width - this.scalingUnit * 0.03 - this.scalingWidthOffset,
                y: this.canvas.height - this.scalingUnit * 0.03 * 0.24,
            },
        ];
       this.ctx.strokeStyle = "white";
       this.ctx.lineWidth = this.scalingUnit * 0.006;
       this.ctx.beginPath();
       this.ctx.moveTo(points[0].x, points[0].y);
        points.forEach((point) => {
           this.ctx.lineTo(point.x, point.y);
        });
       this.ctx.closePath();
       this.ctx.stroke();
    }

    resize(canvas: HTMLCanvasElement){
        this.findScalingUnit(canvas);
        this.drawScene(0);
    }

    setUpKeyListeners(){
        document.addEventListener("keydown", e => this.inputHandler.onKeyDown(e));
        document.addEventListener("keyup", e => this.inputHandler.onKeyUp(e));
    }
}