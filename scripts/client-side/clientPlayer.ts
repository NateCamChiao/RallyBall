import { ANIMATION_DETAILS, DIRECTION, PLAYER_ANIMATION, Coordinates, PlayerStates, POSITION_FUNCTIONS, CLIENT_RENDERING, ClientRenderData, SCALING_UNIT_TO_PLAYER_SIZE } from "./constants.js";



type CoordConversionFn = (x: number, y: number) => Coordinates;

export class PlayerRenderer{
    //render logic members
    dir: DIRECTION;
    startDate: number;
    initialPosition: Coordinates;
    playerState: PlayerStates;
    serverToClientCoords: CoordConversionFn;
    //assets and rendering members
    ctx: CanvasRenderingContext2D;
    spriteMap: any;
    renderData: ClientRenderData;
    playerSize: number;
    constructor(
        ctx: CanvasRenderingContext2D, 
        dir: DIRECTION, 
        initialPosition: Coordinates, 
        startDate: number, 
        spriteMap: any, 
        coordConvertingFunction: CoordConversionFn,
        playerSize: number,
        playerState = PlayerStates.Idle
    ){
        this.ctx = ctx;
        this.dir = dir;
        this.startDate = startDate;
        this.spriteMap = spriteMap;
        this.serverToClientCoords = coordConvertingFunction;
        this.initialPosition = initialPosition;
        this.renderData = CLIENT_RENDERING;
        this.playerState = playerState;
        this.playerSize = playerSize;
    }
    updateScalingUnit(scalingunit: number){
        this.playerSize = scalingunit * SCALING_UNIT_TO_PLAYER_SIZE;
    }
    calculateClientCoords(direction: DIRECTION): Coordinates{
        let {x, y} = this.initialPosition;
        let timeElapsed = Date.now() - this.startDate;
        
        //todo plug into fn(initialPos, t)
        // console.log(PHYSICS_FUNCTIONS[this.playerState](this.initialPosition, direction, timeElapsed));
        return this.serverToClientCoords(x, y);
    }
    render(ctx: CanvasRenderingContext2D, deltatime: number){
        let { maxFrame, mapRow, fps, freezeFrame } = this.renderData[this.playerState].animation;
        //converts to frame length
        let frameLength = 1000 / fps;
        let animationLength = Date.now() - this.startDate;
        let frame: number = Math.floor(animationLength / frameLength) % (maxFrame); // * (delta time) /  mod (maxFrames * )
        // If can't divide by fps then use freezeFrame
        if(frameLength == Infinity || frameLength == 0){
            //zero if freezeFrame isn't available
            frame = freezeFrame ?? 0;
        }
       // console.log(frame, frameLength)
        let coords = this.calculateClientCoords(this.dir);
        ctx.save();
        
        let playerSize;
        ctx.translate(coords.x + this.playerSize / 2, coords.y + this.playerSize / 2);
        if(this.dir == DIRECTION.LEFT){
            ctx.scale(-1, 1);
        }

        ctx.drawImage(
            this.spriteMap, 
            frame * PLAYER_ANIMATION.FRAME_WIDTH,
            mapRow * PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            -this.playerSize / 2,
            -this.playerSize / 2,
            this.playerSize,
            this.playerSize
        );
        ctx.restore();
    }
}

class BallRenderer{
    initialPos: Coordinates;
    init_H: number;
    init_V: number;
    startDate: any;
    constructor(initalCoord: Coordinates, intialHeight: number, intialVelocity: any, startDate: any){
        this.initialPos = initalCoord;
        this.init_H = intialHeight;
        this.init_V = intialVelocity;
        this.startDate = startDate;
    }
}