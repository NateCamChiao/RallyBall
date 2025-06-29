import { ANIMATION_DETAILS, DIRECTION, PLAYER_ANIMATION, Coordinates, PlayerStates, POSITION_FUNCTIONS, CLIENT_RENDERING } from "./constants.js";



type CoordConversionFn = (x: number, y: number) => Coordinates;
class RenderState{
    mapRow: number;
    freezeFrame: number;
    fps: number;
    maxFrames: number;
    initialPosition: Coordinates;
    startDate: number;
    serverToClientCoords: CoordConversionFn;
    playerState: PlayerStates;
    renderingData: any;
    constructor(spriteMapRow: number, 
        framesPerSecond: number, 
        animationFrameLength: number, 
        initialPosition: Coordinates, 
        coordConversion: CoordConversionFn, 
        freezeFrame = 0, 
        startDate = Date.now(),
        playerState = PlayerStates.Idle){
        this.mapRow = spriteMapRow;
        this.freezeFrame = freezeFrame;
        this.fps = 1000 / framesPerSecond; //frame length
        this.maxFrames = animationFrameLength; // inclusive
        this.initialPosition = initialPosition;
        this.startDate = startDate;
        this.playerState = playerState;
        //method
        this.serverToClientCoords = coordConversion;
    }
    /**
     * @deprecated
     * @param spriteMapRow 
     * @param framesPerSecond 
     * @param animationFrameLength 
     * @param freezeFrame 
     * @returns 
     */
    addAnimationInfo(spriteMapRow: number, framesPerSecond: number, animationFrameLength: number, freezeFrame = 0){
        this.mapRow = spriteMapRow;
        this.fps = framesPerSecond;
        this.maxFrames = animationFrameLength;
        this.freezeFrame = freezeFrame;
        return this;
    }
    /**
     * @deprecated
     * @param initialPosition 
     * @param coordConversion 
     * @param startDate 
     * @returns 
     */
    addCoordInfo(initialPosition: Coordinates, coordConversion: CoordConversionFn, startDate = Date.now()){
        this.initialPosition = initialPosition;
        this.serverToClientCoords = coordConversion;
        this.startDate = startDate;
        return this;
    }

    /**
     * Alternate constructor if creating RenderState by passing in the cooresponding ANIMATION_DETAILS
     */

    static createWithAnimationDetails(animationDetails: any, initialPosition: Coordinates, coordConversion: CoordConversionFn, startDate = Date.now()){
        return new RenderState(
            animationDetails.animation.mapRow,
            animationDetails.animation.fps,
            animationDetails.animation.maxFrame,
            initialPosition,
            coordConversion,
            animationDetails.freezeFrame ?? 0,
            startDate,
            animationDetails
        );
    }
    addClientRenderingData(clientRenderingData: any){
        this.renderingData = clientRenderingData;
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
        let animationLength = Date.now() - this.startDate;
        let frame = Math.floor(animationLength / this.fps) % (this.maxFrames); // * (delta time) /  mod (maxFrames * )
        // If can't divide by fps then use freezeFrame
        if(this.fps == Infinity || this.fps == 0){
            frame = this.freezeFrame;
        }
        console.log(frame, this.fps)
        let coords = this.calculateClientCoords(direction);
        ctx.save();
        
        ctx.translate(coords.x + size / 2, coords.y + size / 2);
        if(direction == DIRECTION.LEFT){
            ctx.scale(-1, 1);
        }
        ctx.drawImage(
            spriteMap, 
            frame * PLAYER_ANIMATION.FRAME_WIDTH,
            this.mapRow * PLAYER_ANIMATION.FRAME_WIDTH,
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
        this.renderState = RenderState.createWithAnimationDetails(CLIENT_RENDERING.Idle, initialPosition, coordConvertingFunction);
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