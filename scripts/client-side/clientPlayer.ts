import { ANIMATION_DETAILS, DIRECTION, PLAYER_ANIMATION, Coordinates, PlayerStateLabels, ClientRenderData, SCALING_UNIT_TO_PLAYER_SIZE, ClientInputData, PLAYERTYPE, AnimationDetails, KeybindMap, defaultKeybinds, getAnimationLoopDuration, secondaryKeybinds, debugMode, SERVER, Velocity, MotionSupplier } from "./constants.js";
import { IdleState, PlayerState } from "./playerStateInput.js";
import { PositionFunctions } from "./positionFunctions.js";



type CoordConversionFn = (x: number, y: number) => Coordinates;

export class PlayerRenderer{
    //render logic members
    name: string;//16 character max
    dir: DIRECTION;
    startDate: number;
    initialPosition: Coordinates;
    playerState: PlayerStateLabels;
    serverToClientCoords: CoordConversionFn;
    //assets and rendering members
    ctx: CanvasRenderingContext2D;
    spriteMap: any;
    readonly animationDetails: AnimationDetails;
    scalingUnit: number;
    constructor(
        ctx: CanvasRenderingContext2D, 
        dir: DIRECTION, 
        initialPosition: Coordinates, 
        startDate: number, 
        spriteMap: any, 
        coordConvertingFunction: CoordConversionFn,
        scalingUnit: number,
        playerState = PlayerStateLabels.Idle,
        name: string = ""
    ){
        this.ctx = ctx;
        this.dir = dir;
        this.startDate = startDate;
        
        this.spriteMap = spriteMap;
        this.serverToClientCoords = coordConvertingFunction;
        this.initialPosition = initialPosition;
        this.animationDetails = ANIMATION_DETAILS;
        this.playerState = playerState;
        this.scalingUnit = scalingUnit;
        this.name = name;
    }
    changeState(newState: PlayerStateLabels, dir: DIRECTION, startDate: number){
        this.initialPosition = PositionFunctions[this.playerState](this.initialPosition, this.dir, Date.now() - this.startDate).coords;
        this.playerState = newState;
        this.dir = dir;
        
        this.startDate = startDate;
    }
    updateScalingUnit(scalingunit: number){
        this.scalingUnit = scalingunit;
    }
    calculateClientCoords(): Coordinates{
        let timeElapsed = Date.now() - this.startDate;
        let {x, y} = PositionFunctions[this.playerState](this.initialPosition, this.dir, timeElapsed).coords;
        return this.serverToClientCoords(x, y);
    }
    render(deltatime: number){
        let { maxFrame, mapRow, fps, freezeFrame } = this.animationDetails[this.playerState];
        //converts to frame length
        let frameLength;
        let animationLength = Date.now() - this.startDate;
        //preventing dividing by zero
        if(fps == 0){
            frameLength = Infinity;
        }
        else{
            frameLength = 1000 / fps;
        }
        let frame: number = Math.floor(animationLength / frameLength) % (maxFrame); // * (delta time) /  mod (maxFrames * )
        // If can't divide by fps then use freezeFrame
        if(frameLength == Infinity){
            //zero if freezeFrame isn't available
            frame = freezeFrame ?? 0;
        }
        //if animation is longer than animation cycle duration
        if(animationLength >= getAnimationLoopDuration(this.playerState) && freezeFrame != undefined){
            frame = freezeFrame;
        }

        let coords = this.calculateClientCoords();
        this.ctx.save();
        
        let playerSize = this.scalingUnit * SCALING_UNIT_TO_PLAYER_SIZE;
        this.ctx.translate(coords.x + playerSize / 2, coords.y + playerSize / 2);
        if(this.dir == DIRECTION.LEFT){
            this.ctx.scale(-1, 1);
        }

        this.ctx.drawImage(
            this.spriteMap, 
            frame * PLAYER_ANIMATION.FRAME_WIDTH,
            mapRow * PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            -playerSize / 2,
            -playerSize / 2,
            playerSize,
            playerSize
        );
        if(debugMode){
            this.ctx.strokeRect(-playerSize / 2, -playerSize / 2, playerSize, playerSize);
        }
        this.ctx.restore();
        //draw nametag
        if(this.name.length > 0){
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.name, coords.x + playerSize / 2 + playerSize * PLAYER_ANIMATION.NAME_CONST.LEFT_AMOUNT_BY_PLAYER_SIZE, coords.y + playerSize * PLAYER_ANIMATION.NAME_CONST.DOWN_AMOUNT_BY_PLAYER_SIZE);
        }
    }
    setName(name: string){
        this.name = name;
    }
}

export class ClientPlayer{
    playerType: PLAYERTYPE;
    name: string;
    playerRenderer: PlayerRenderer;
    // inputLogicHandler: PlayerStateInputHandler;
    playerState: PlayerStateLabels = PlayerStateLabels.Running;

    state: PlayerState;
    keybindMap: KeybindMap;
    stateDurationTimerID: number | null; //id of setTimout

    position: Coordinates = {x: 140, y: 63};
    velocity: Velocity = {vx: 0, vy: 0};
    constructor(playerType: PLAYERTYPE, ctx: CanvasRenderingContext2D, playerSpriteMap: any, coordConvertingFn: CoordConversionFn, scalingUnit: number, name: string = ""){
        this.name = name;
        this.playerRenderer = new PlayerRenderer(ctx, DIRECTION.LEFT, {x: 140, y: 63}, Date.now(), playerSpriteMap, coordConvertingFn, scalingUnit, PlayerStateLabels.Idle, name);
        this.playerType = playerType;
        this.keybindMap = defaultKeybinds;
        this.stateDurationTimerID = null;
        this.state = new IdleState(this.keybindMap, DIRECTION.LEFT, this.getMotionSupplier.bind(this));
    }
    getMotionSupplier(){
        return {
            position: this.position,
            velocity: this.velocity
        }
    }
    updateState(newState: PlayerState, startDate = Date.now()){
        this.state = newState;
        this.setDurationTimer(newState);
        this.position = PositionFunctions[this.state.playerState](this.position, this.state.dir, Date.now() - this.playerRenderer.startDate).coords;
        
        this.playerRenderer.changeState(this.state.playerState, this.state.dir, startDate);
    }

    onInput(inputData: ClientInputData){
        let newState: PlayerState | null = this.state.onInput(inputData);
        if(newState != null){
            this.updateState(newState);
        }
    }
    setDurationTimer(currentState: PlayerState){
        //clear existing timer
        if(this.stateDurationTimerID != null){
            clearTimeout(this.stateDurationTimerID);
        }
        let animationData = currentState.getDefaultTimeoutBehavior();
        if(animationData.animationLength == Infinity){
            return this.stateDurationTimerID = null;
        }
        this.stateDurationTimerID = setTimeout(
            () => {
                this.updateState(animationData.playerStateGetter())
            },
            animationData.animationLength
        );
    }
}
class BallController{
    initialPos: Coordinates;
    init_V: Velocity;
    startDate: number;
    ctx: CanvasRenderingContext2D;
    ballImage: any;

    constructor(ctx: CanvasRenderingContext2D, ballImage: any, initalCoord: Coordinates, intialVelocity: Velocity, startDate: any){
        this.ctx = ctx;
        this.ballImage = ballImage;
        this.initialPos = initalCoord;
        this.init_V = intialVelocity;
        this.startDate = startDate;
    }

    addPhysicsEvent(){
        
    }

    render(){

    }
}