import { ANIMATION_DETAILS, DIRECTION, PLAYER_ANIMATION, Coordinates, PlayerStates, POSITION_FUNCTIONS, CLIENT_RENDERING, ClientRenderData } from "./constants.js";



type CoordConversionFn = (x: number, y: number) => Coordinates;
class RenderState{
    initialPosition: Coordinates;
    startDate: number;
    serverToClientCoords: CoordConversionFn;
    playerState: PlayerStates;
    renderData: ClientRenderData;
    constructor(renderData: ClientRenderData, initalPosition: Coordinates, coordConversion: CoordConversionFn, playerState = PlayerStates.Idle, startDate = Date.now()){
        this.renderData = renderData;
        this.initialPosition = initalPosition;
        this.serverToClientCoords = coordConversion;
        this.playerState = playerState;
        this.startDate = startDate;
    }

    //client-side prediction
    calculateClientCoords(direction: DIRECTION): Coordinates{
        let {x, y} = this.initialPosition;
        let timeElapsed = Date.now() - this.startDate;
        
        //todo plug into fn(initialPos, t)
        // console.log(PHYSICS_FUNCTIONS[this.playerState](this.initialPosition, direction, timeElapsed));
        return this.serverToClientCoords(x, y);
    }

    render(ctx: CanvasRenderingContext2D, deltatime: number, direction: DIRECTION, size: number, spriteMap: CanvasImageSource){
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
        
        ctx.translate(coords.x + size / 2, coords.y + size / 2);
        if(direction == DIRECTION.LEFT){
            ctx.scale(-1, 1);
        }
        ctx.drawImage(
            spriteMap, 
            frame * PLAYER_ANIMATION.FRAME_WIDTH,
            mapRow * PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            -size / 2,
            -size / 2,
            size,
            size
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

export class PlayerRenderer{
    ctx: any;
    renderState: RenderState;
    dir: number;
    initialPosition: { x: number; y: number; };
    startDate: Date;
    spriteMap: any;
    constructor(ctx: any, dir: number, initialPosition: { x: number; y: number; }, startDate: Date, spriteMap: any, coordConvertingFunction: CoordConversionFn){
        this.ctx = ctx;
        this.renderState = new RenderState(CLIENT_RENDERING, initialPosition, coordConvertingFunction, PlayerStates.Idle);
        this.dir = dir;
        this.initialPosition = initialPosition;
        this.startDate = startDate;
        this.spriteMap = spriteMap;
        // this.coordConvertFun = coordConvertingFunction;
    }
    render(ctx: any, deltatime: any, size: number){
        this.renderState.render(ctx, deltatime, this.dir, size, this.spriteMap);
    }
}

class BallRenderer{
    initialPos: Coordinates;
    init_H: any;
    init_V: any;
    startDate: any;
    constructor(initalCoord: Coordinates, intialHeight: any, intialVelocity: any, startDate: any){
        this.initialPos = initalCoord;
        this.init_H = intialHeight;
        this.init_V = intialVelocity;
        this.startDate = startDate;
    }
}