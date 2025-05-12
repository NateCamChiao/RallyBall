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
    constructor(ctx, canvas, playerAssests, sceneAssests, gameState = GAMESTATE.UNPAUSED){
        this.ctx = ctx;
        this.canvas = canvas;
        this.assets = {
            player: playerAssests,
            scene: sceneAssests
        }
        this.state = gameState;
        this.camera = clientCamera;
        this.ball = clientBall;
        this.stopUpdating = false;
        this.playerList = [new PlayerRenderer(this.ctx, DIRECTION.RIGHT, {x: 30, y: 30}, new Date(), this.assets.player)];
        this.findScalingUnit(canvas);
        this.updateGame();
        // setInterval(this.updateGame.bind(this), 100);

        this.lastTimeStamp = -1;
        this.inputHandler = new InputHandler(5);
        this.setUpKeyListeners();
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
    recieveServerData(){}

    findScalingUnit(canvas) {
        if (canvas.height * scalingRatio >= canvas.width) {
            scalingUnit = canvas.width;
            scalingWidthOffset = 0;
            heightOffset = canvas.height - canvas.width / scalingRatio;
            // console.log(canvas.width / scalingRatio, canvas.height);
          // heightOffset =
        } else if (canvas.height * scalingRatio < canvas.width) {
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        let {cameraX, cameraY} = this.camera.currentPosition();
        this.drawBlankBackground(this.camera.y);
        ctx.translate(this.camera.x, this.camera.y);
    
        this.drawBackground();
        this.drawCourt();
        // ctx.drawImage(this.assets.scene,0,0,);
        const netDims = {
            w: scalingUnit * 0.04,
            h: scalingUnit * 0.04 * 5.1,
        };
        //net
        ctx.drawImage(
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
        ctx.translate(-this.camera.x, -this.camera.y); // restore translation
        ctx.beginPath();
        ctx.moveTo(scalingWidthOffset, 0);
        ctx.lineTo(scalingWidthOffset, 0);
        ctx.stroke();
    }
    //sets basic background color in case drawBackground() doesn't work
    drawBlankBackground(offset) {
        ctx.translate(0, offset);
        ctx.fillStyle = "#d6f2f9ff";
        ctx.fillRect(0, -offset, canvas.width, canvas.height);
        ctx.fillStyle = "#80e5ffff"; //water
        ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.24,
            canvas.width,
            scalingUnit * 0.04
        );
        ctx.fillStyle = "#ac9393ff"; //border
        ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.2,
            canvas.width,
            scalingUnit * 0.08
        );
    
        ctx.fillStyle = "#ffd42aff"; //sand
        ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.12,
            canvas.width,
            scalingUnit * 0.12 - offset
        );
        ctx.translate(0, -offset);
    }
    drawBackground() {
        //800
        //background
        ctx.fillStyle = "#d6f2f9ff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#80e5ffff"; //water
        ctx.fillRect(
            0,
            canvas.height - scalingUnit * 0.24,
            canvas.width,
            scalingUnit * 0.04
        );
        // drawCrowd();
        // ctx.fillStyle = "black";
        // ctx.fillRect(0, canvas.height - canvas.width * 0.24 - 100, 400, 400);
        ctx.fillStyle = "#ac9393ff"; //border
        ctx.fillRect(
            -scalingUnit * 0.06,
            canvas.height - scalingUnit * 0.2,
            canvas.width + scalingUnit * 0.12,
            scalingUnit * 0.08
        );
    
        ctx.fillStyle = "#ffd42aff"; //sand
        ctx.fillRect(
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
        ctx.strokeStyle = "white";
        ctx.lineWidth = scalingUnit * 0.006;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.stroke();
    }

    resize(canvas){
        this.findScalingUnit(canvas);
        this.drawScene();
    }

    setUpKeyListeners(){
        document.addEventListener("keydown", e => {
            
            this.inputHandler.onKeyDown(e);
            //todo grab inputHandler.getKeyData();
            console.table(this.inputHandler.getKeyData())
        });
        document.addEventListener("keyup", e => {
            this.inputHandler.onKeyUp(e);
            //todo grab inputHandler.getKeyData();
            console.table(this.inputHandler.getKeyData())

        });
    }

    
}


