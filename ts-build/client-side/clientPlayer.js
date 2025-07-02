import { ANIMATION_DETAILS, DIRECTION, PLAYER_ANIMATION, PlayerStates, SCALING_UNIT_TO_PLAYER_SIZE, defaultKeybinds } from "./constants.js";
import { IdleState } from "./playerStateInput.js";
import { PositionFunctions } from "./positionFunctions.js";
export class PlayerRenderer {
    //render logic members
    name; //16 character max
    dir;
    startDate;
    initialPosition;
    playerState;
    serverToClientCoords;
    //assets and rendering members
    ctx;
    spriteMap;
    animationDetails;
    playerSize;
    constructor(ctx, dir, initialPosition, startDate, spriteMap, coordConvertingFunction, playerSize, playerState = PlayerStates.Idle, name = "") {
        this.ctx = ctx;
        this.dir = dir;
        this.startDate = startDate;
        this.spriteMap = spriteMap;
        this.serverToClientCoords = coordConvertingFunction;
        this.initialPosition = initialPosition;
        this.animationDetails = ANIMATION_DETAILS;
        this.playerState = playerState;
        this.playerSize = playerSize;
        this.name = name;
    }
    changeState(newState, dir, startDate) {
        this.initialPosition = PositionFunctions[this.playerState](this.initialPosition, this.dir, Date.now() - this.startDate).coords;
        this.playerState = newState;
        this.dir = dir;
        this.startDate = startDate;
    }
    updateScalingUnit(scalingunit) {
        this.playerSize = scalingunit * SCALING_UNIT_TO_PLAYER_SIZE;
    }
    calculateClientCoords() {
        let { x, y } = this.initialPosition;
        let timeElapsed = Date.now() - this.startDate;
        //todo plug into fn(initialPos, t)
        // console.log(PositionFunctions[this.playerState](this.initialPosition, this.dir, timeElapsed));
        return this.serverToClientCoords(x, y);
    }
    render(deltatime) {
        let { maxFrame, mapRow, fps, freezeFrame } = this.animationDetails[this.playerState];
        //converts to frame length
        let frameLength = 1000 / fps;
        let animationLength = Date.now() - this.startDate;
        let frame = Math.floor(animationLength / frameLength) % (maxFrame); // * (delta time) /  mod (maxFrames * )
        // If can't divide by fps then use freezeFrame
        if (frameLength == Infinity || frameLength == 0) {
            //zero if freezeFrame isn't available
            frame = freezeFrame ?? 0;
        }
        // console.log(frame, frameLength)
        let coords = this.calculateClientCoords();
        this.ctx.save();
        let playerSize;
        this.ctx.translate(coords.x + this.playerSize / 2, coords.y + this.playerSize / 2);
        if (this.dir == DIRECTION.LEFT) {
            this.ctx.scale(-1, 1);
        }
        this.ctx.drawImage(this.spriteMap, frame * PLAYER_ANIMATION.FRAME_WIDTH, mapRow * PLAYER_ANIMATION.FRAME_WIDTH, PLAYER_ANIMATION.FRAME_WIDTH, PLAYER_ANIMATION.FRAME_WIDTH, -this.playerSize / 2, -this.playerSize / 2, this.playerSize, this.playerSize);
        if (true) {
            this.ctx.strokeRect(-this.playerSize / 2, -this.playerSize / 2, this.playerSize, this.playerSize);
        }
        this.ctx.restore();
        //draw nametag
        if (this.name.length > 0) {
            this.ctx.fillStyle = "black";
            this.ctx.fillText(this.name, coords.x + this.playerSize / 2 + this.playerSize * PLAYER_ANIMATION.NAME_CONST.LEFT_AMOUNT_BY_PLAYER_SIZE, coords.y + this.playerSize * PLAYER_ANIMATION.NAME_CONST.DOWN_AMOUNT_BY_PLAYER_SIZE);
        }
    }
    setName(name) {
        this.name = name;
    }
}
export class PlayerStateInputHandler {
    state;
    keybindMap;
    stateDurationTimerID; //id of setTimout
    stateChangeCallback;
    constructor(keybindings = defaultKeybinds, stateChangeCallback, playerState = new IdleState(keybindings, DIRECTION.LEFT)) {
        this.state = playerState;
        this.keybindMap = keybindings;
        this.stateChangeCallback = stateChangeCallback;
        this.stateDurationTimerID = null;
        //setup timer (only matters if state has finite length)
        this.setDurationTimer(this.state);
    }
    onInput(inputData) {
        let newState = this.state.onInput(inputData);
        if (newState != null) {
            this.updatePlayerState(newState);
        }
    }
    setDurationTimer(currentState) {
        //clear existing timer
        if (this.stateDurationTimerID != null) {
            clearTimeout(this.stateDurationTimerID);
        }
        let animationData = currentState.getDefaultTimeoutBehavior();
        if (animationData.animationLength == Infinity) {
            return this.stateDurationTimerID = null;
        }
        this.stateDurationTimerID = setTimeout(() => this.updatePlayerState(new IdleState(this.keybindMap, currentState.dir)), animationData.animationLength);
    }
    updatePlayerState(newState) {
        this.state = newState;
        this.setDurationTimer(newState);
        // this.stateDurationTimer = getCycleTime(this.state.playerState);
        this.stateChangeCallback(this.state.playerState, this.state.dir, Date.now());
    }
    //returns method to call when key events fire
    getCallback() {
        return this.onInput.bind(this);
    }
}
export class ClientPlayer {
    playerType;
    name;
    playerRenderer;
    inputLogicHandler;
    playerState = PlayerStates.Idle;
    constructor(playerType, ctx, playerSpriteMap, coordConvertingFn, playerSize, name = "") {
        this.name = name;
        this.playerRenderer = new PlayerRenderer(ctx, DIRECTION.LEFT, { x: 30, y: 63 }, 0, playerSpriteMap, coordConvertingFn, playerSize, PlayerStates.Idle, name);
        this.inputLogicHandler = new PlayerStateInputHandler(defaultKeybinds, this.updateState.bind(this));
        this.playerType = playerType;
    }
    updateState(newPlayerState, directon, startDate = Date.now()) {
        this.playerRenderer.changeState(newPlayerState, directon, startDate);
    }
    getInputCallback() {
        return this.inputLogicHandler.getCallback().bind(this);
    }
}
class BallRenderer {
    initialPos;
    init_H;
    init_V;
    startDate;
    constructor(initalCoord, intialHeight, intialVelocity, startDate) {
        this.initialPos = initalCoord;
        this.init_H = intialHeight;
        this.init_V = intialVelocity;
        this.startDate = startDate;
    }
}
