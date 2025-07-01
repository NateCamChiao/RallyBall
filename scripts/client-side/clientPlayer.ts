import { ANIMATION_DETAILS, DIRECTION, PLAYER_ANIMATION, Coordinates, PlayerStates, POSITION_FUNCTIONS, CLIENT_RENDERING, ClientRenderData, SCALING_UNIT_TO_PLAYER_SIZE, ClientInputData, PLAYERTYPE } from "./constants.js";



type CoordConversionFn = (x: number, y: number) => Coordinates;

export class PlayerRenderer{
    //render logic members
    name: string;//16 character max
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
        playerState = PlayerStates.Idle,
        name: string = ""
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
        this.name = name;
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
    render(deltatime: number){
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
        this.ctx.save();
        
        let playerSize;
        this.ctx.translate(coords.x + this.playerSize / 2, coords.y + this.playerSize / 2);
        if(this.dir == DIRECTION.LEFT){
            this.ctx.scale(-1, 1);
        }

        this.ctx.drawImage(
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
        if(true){
            this.ctx.strokeRect(-this.playerSize / 2, -this.playerSize / 2, this.playerSize, this.playerSize);
        }
        this.ctx.restore();
        //draw nametag
        if(this.name.length > 0){
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.name, coords.x + this.playerSize / 2 + this.playerSize * PLAYER_ANIMATION.NAME_CONST.LEFT_AMOUNT_BY_PLAYER_SIZE, coords.y + this.playerSize * PLAYER_ANIMATION.NAME_CONST.DOWN_AMOUNT_BY_PLAYER_SIZE);
        }
    }
    setName(name: string){
        this.name = name;
    }
}

interface PlayerStateInputLogic{
    onInput: (inputData: ClientInputData) => PlayerStateInputLogic | null;
}
export class IdleState implements PlayerStateInputLogic{
    onInput(inputData: ClientInputData): PlayerStateInputLogic | null{
        console.log(inputData.keysHeld);
        return null;
    }
}

export class PlayerStateInputHandler{
    playerState: PlayerStateInputLogic;

    constructor(playerState = new IdleState()){
        this.playerState = playerState;
    }
    onInput(inputData: ClientInputData){
        let newState: PlayerStateInputLogic | null = this.playerState.onInput(inputData);
        if(newState != null){
            this.playerState = newState;
        }
    }
    getCallback(): (inputData: ClientInputData) => void {
        return this.onInput.bind(this);
    }
}
export class ClientPlayer{
    playerType: PLAYERTYPE;
    name: string;
    playerRenderer: PlayerRenderer;
    inputLogicHandler: PlayerStateInputHandler;
    playerState: PlayerStates = PlayerStates.Idle;
    constructor(playerType: PLAYERTYPE, ctx: CanvasRenderingContext2D, playerSpriteMap: any, coordConvertingFn: CoordConversionFn, playerSize: number, name: string = ""){
        this.name = name;
        this.playerRenderer = new PlayerRenderer(ctx, DIRECTION.LEFT, {x: 30, y: 63}, 0, playerSpriteMap, coordConvertingFn, playerSize, PlayerStates.Idle, name);
        this.inputLogicHandler = new PlayerStateInputHandler();
        this.playerType = playerType;
    }
    getInputCallback(): (inputData: ClientInputData) => void {
        return this.inputLogicHandler.getCallback().bind(this);
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