const GAMESTATE = {
    PAUSED: 0,
    UNPAUSED: 1,
}

const scalingRatio = 1.8; //2.3 width / height
let scalingUnit, //optimal height
heightOffset;
let scalingWidthOffset = 0;

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


class Game{
    constructor(canvas, playerAssests, sceneAssests, gameState = GAMESTATE.UNPAUSED){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.assets = {
            player: playerAssests,
            scene: sceneAssests
        }

        this.state = gameState;
        this.camera = clientCamera;
        this.ball = clientBall;
        this.playerList = [new PlayerRenderer(this.ctx, DIRECTION.RIGHT, {x: 30, y: 30}, new Date(), this.assets.player)];
        this.inputHandler = new InputHandler(5);

        this.stopUpdating = false;        
        this.lastTimeStamp = -1;
        this.setUpKeyListeners();
        this.findScalingUnit(canvas);
        this.updateGame();
    }

    updateGame(currentTime){
        if(this.lastTimeStamp == -1){
            // console.log("sdf")
            this.lastTimeStamp = currentTime;
        }
        
        let deltatime = currentTime - this.lastTimeStamp;
        this.lastTimeStamp = currentTime;
        this.drawScene(deltatime);
        if(!this.stopUpdating)
            requestAnimationFrame(this.updateGame.bind(this));
    }
    onServerData(){}

    findScalingUnit(canvas) {
        if (canvas.height * PERFECT_SCALING_RATIO >= canvas.width) {
            scalingUnit = canvas.width;
            scalingWidthOffset = 0;
            heightOffset = canvas.height - canvas.width / PERFECT_SCALING_RATIO;
            // console.log(canvas.width / PERFECT_SCALING_RATIO, canvas.height);
          // heightOffset =
        } else if (canvas.height * PERFECT_SCALING_RATIO < canvas.width) {
            scalingUnit = canvas.height * 1.8; //0.71 finds target width 1.8 is much closer
            scalingWidthOffset = (canvas.width - scalingUnit) / 2; //half of the target width difference
            heightOffset = 0;
        }
    }

    renderPlayers(deltatime){
        this.playerList.forEach(player => player.render(this.ctx, deltatime, scalingUnit * 0.17));
    }
    
    drawScene(deltatime) {
        // console.log("draw", deltatime)
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        let {cameraX, cameraY} = this.camera.currentPosition();
        this.drawBlankBackground(this.camera.y);
        this.ctx.translate(this.camera.x, this.camera.y);
    
        this.drawBackground();
        this.drawCourt();
        // this.ctx.drawImage(this.assets.scene,0,0,);
        const netDims = {
            w: scalingUnit * 0.04,
            h: scalingUnit * 0.04 * 5.1,
        };
        //net
        this.ctx.drawImage(
            this.assets.scene,
            0,
            0,
            181,
            943,
            canvas.width / 2 - netDims.w / 2,
            canvas.height - netDims.h,
            netDims.w,
            netDims.h
        );
        // this.ctx.fillRect(0,0,400,40);
        this.renderPlayers(deltatime);
        // drawClouds();
        this.ctx.translate(-this.camera.x, -this.camera.y); // restore translation
        this.ctx.beginPath();
        this.ctx.moveTo(scalingWidthOffset, 0);
        this.ctx.lineTo(scalingWidthOffset, 0);
        this.ctx.stroke();
    }
    //sets basic background color in case drawBackground() doesn't work
    drawBlankBackground(offset) {
       this.ctx.translate(0, offset);
       this.ctx.fillStyle = "#d6f2f9ff";
       this.ctx.fillRect(0, -offset, canvas.width, canvas.height);
       this.ctx.fillStyle = "#80e5ffff"; //water
       this.ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.24,
            canvas.width,
            scalingUnit * 0.04
        );
       this.ctx.fillStyle = "#ac9393ff"; //border
       this.ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.2,
            canvas.width,
            scalingUnit * 0.08
        );
    
       this.ctx.fillStyle = "#ffd42aff"; //sand
       this.ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.12,
            canvas.width,
            scalingUnit * 0.12 - offset
        );
       this.ctx.translate(0, -offset);
    }
    drawBackground() {
        //800
        //background
       this.ctx.fillStyle = "#d6f2f9ff";
       this.ctx.fillRect(0, 0, canvas.width, canvas.height);
       this.ctx.fillStyle = "#80e5ffff"; //water
       this.ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.24,
            canvas.width,
            scalingUnit * 0.04
        );
        // drawCrowd();
        //this.ctx.fillStyle = "black";
        //this.ctx.fillRect(0, canvas.height - canvas.width * 0.24 - 100, 400, 400);
       this.ctx.fillStyle = "#ac9393ff"; //border
       this.ctx.fillRect(
            -scalingUnit * 0.06,
            canvas.height - scalingUnit * 0.2,
            canvas.width + scalingUnit * 0.12,
            scalingUnit * 0.08
        );
    
       this.ctx.fillStyle = "#ffd42aff"; //sand
       this.ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.12,
            canvas.width,
            scalingUnit * 0.12
        );
    }
    drawCourt() {
        const points = [
            {
                x: scalingUnit * 0.03 + scalingWidthOffset,
                y: canvas.height - scalingUnit * 0.03 * 0.24,
            },
            {
                x: scalingUnit * 0.06 + scalingWidthOffset,
                y: canvas.height - scalingUnit * 0.06 * 1.72,
            },
            {
                x: canvas.width - scalingUnit * 0.06 - scalingWidthOffset,
                y: canvas.height - scalingUnit * 0.06 * 1.72,
            },
            {
                x: canvas.width - scalingUnit * 0.03 - scalingWidthOffset,
                y: canvas.height - scalingUnit * 0.03 * 0.24,
            },
        ];
       this.ctx.strokeStyle = "white";
       this.ctx.lineWidth = scalingUnit * 0.006;
       this.ctx.beginPath();
       this.ctx.moveTo(points[0].x, points[0].y);
        points.forEach((point) => {
           this.ctx.lineTo(point.x, point.y);
        });
       this.ctx.closePath();
       this.ctx.stroke();
    }

    resize(canvas){
        this.findScalingUnit(canvas);
        this.drawScene();
    }

    setUpKeyListeners(){
        document.addEventListener("keydown", e => {
            
            this.inputHandler.onKeyDown(e);
            //todo grab inputHandler.getKeyData();
            // console.table(this.inputHandler.getKeyData())
        });
        document.addEventListener("keyup", e => {
            this.inputHandler.onKeyUp(e);
            //todo grab inputHandler.getKeyData();
            // console.table(this.inputHandler.getKeyData())

        });
    }

    
}


