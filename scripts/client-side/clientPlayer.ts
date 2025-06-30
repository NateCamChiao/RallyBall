import { ANIMATION_DETAILS, DIRECTION, PLAYER_ANIMATION, Coordinates, PlayerStates, POSITION_FUNCTIONS, CLIENT_RENDERING, ClientRenderData, SCALING_UNIT_TO_PLAYER_SIZE } from "./constants.js";



type CoordConversionFn = (x: number, y: number) => Coordinates;
class RenderState{
    playerSize: number;
    initialPosition: Coordinates;
    startDate: number;
    serverToClientCoords: CoordConversionFn;
    playerState: PlayerStates;
    renderData: ClientRenderData;
    constructor(renderData: ClientRenderData, initalPosition: Coordinates, coordConversion: CoordConversionFn, playerSize = 100, playerState = PlayerStates.Idle, startDate = Date.now()){
        this.renderData = renderData;
        this.initialPosition = initalPosition;
        this.serverToClientCoords = coordConversion;
        this.playerState = playerState;
        this.startDate = startDate;

        this.playerSize = playerSize;
    }

    updatePlayerSize(newSize: number){
        this.playerSize = newSize;
    }

    //client-side prediction
    calculateClientCoords(direction: DIRECTION): Coordinates{
        let {x, y} = this.initialPosition;
        let timeElapsed = Date.now() - this.startDate;
        
        //todo plug into fn(initialPos, t)
        // console.log(PHYSICS_FUNCTIONS[this.playerState](this.initialPosition, direction, timeElapsed));
        return this.serverToClientCoords(x, y);
    }

    render(ctx: CanvasRenderingContext2D, deltatime: number, direction: DIRECTION, spriteMap: CanvasImageSource){
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
        console.log(frame, frameLength)
        let coords = this.calculateClientCoords(direction);
        ctx.save();
        
        ctx.translate(coords.x + this.playerSize / 2, coords.y + this.playerSize / 2);
        if(direction == DIRECTION.LEFT){
            ctx.scale(-1, 1);
        }
        ctx.fillRect(0,0, 100, 100);
        ctx.drawImage(spriteMap, 
            50,
            50,
            PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            40,
            40,
            300,
            300
        );
        ctx.drawImage(
            spriteMap, 
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
/**
 * IdleAnimation is here to avoid confusion. It inherits everything it needs from RenderState
 */
class IdleAnimation extends RenderState{}

class RunningAnimation extends RenderState{

}
//
export class PlayerRenderer{
    ctx: any;
    renderState: RenderState;
    dir: number;
    startDate: Date;
    spriteMap: any;
    constructor(
        ctx: any, 
        dir: number, 
        initialPosition: Coordinates, 
        startDate: Date, 
        spriteMap: any, 
        coordConvertingFunction: CoordConversionFn,
        playerSize: number
    ){
        this.ctx = ctx;
        this.renderState = new RenderState(CLIENT_RENDERING, initialPosition, coordConvertingFunction, playerSize, PlayerStates.Idle);
        this.dir = dir;
        this.startDate = startDate;
        this.spriteMap = spriteMap;
    }
    updateScalingUnit(scalingunit: number){
        this.renderState.updatePlayerSize(scalingunit * SCALING_UNIT_TO_PLAYER_SIZE);
    }
    render(ctx: CanvasRenderingContext2D, deltatime: number){
        this.renderState.render(ctx, deltatime, this.dir, this.spriteMap);
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