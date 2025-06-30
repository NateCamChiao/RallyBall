import { DIRECTION, PLAYER_ANIMATION, PlayerStates, CLIENT_RENDERING, SCALING_UNIT_TO_PLAYER_SIZE } from "./constants.js";
class RenderState {
    playerSize;
    initialPosition;
    startDate;
    serverToClientCoords;
    playerState;
    renderData;
    constructor(renderData, initalPosition, coordConversion, playerSize = 100, playerState = PlayerStates.Idle, startDate = Date.now()) {
        this.renderData = renderData;
        this.initialPosition = initalPosition;
        this.serverToClientCoords = coordConversion;
        this.playerState = playerState;
        this.startDate = startDate;
        this.playerSize = playerSize;
    }
    updatePlayerSize(newSize) {
        this.playerSize = newSize;
    }
    //client-side prediction
    calculateClientCoords(direction) {
        let { x, y } = this.initialPosition;
        let timeElapsed = Date.now() - this.startDate;
        //todo plug into fn(initialPos, t)
        // console.log(PHYSICS_FUNCTIONS[this.playerState](this.initialPosition, direction, timeElapsed));
        return this.serverToClientCoords(x, y);
    }
    render(ctx, deltatime, direction, spriteMap) {
        let { maxFrame, mapRow, fps, freezeFrame } = this.renderData[this.playerState].animation;
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
        let coords = this.calculateClientCoords(direction);
        ctx.save();
        ctx.translate(coords.x + this.playerSize / 2, coords.y + this.playerSize / 2);
        if (direction == DIRECTION.LEFT) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(spriteMap, frame * PLAYER_ANIMATION.FRAME_WIDTH, mapRow * PLAYER_ANIMATION.FRAME_WIDTH, PLAYER_ANIMATION.FRAME_WIDTH, PLAYER_ANIMATION.FRAME_WIDTH, -this.playerSize / 2, -this.playerSize / 2, this.playerSize, this.playerSize);
        ctx.restore();
    }
}
//
export class PlayerRenderer {
    ctx;
    renderState;
    dir;
    startDate;
    spriteMap;
    constructor(ctx, dir, initialPosition, startDate, spriteMap, coordConvertingFunction, playerSize) {
        this.ctx = ctx;
        this.renderState = new RenderState(CLIENT_RENDERING, initialPosition, coordConvertingFunction, playerSize, PlayerStates.Diving);
        this.dir = dir;
        this.startDate = startDate;
        this.spriteMap = spriteMap;
    }
    updateScalingUnit(scalingunit) {
        this.renderState.updatePlayerSize(scalingunit * SCALING_UNIT_TO_PLAYER_SIZE);
    }
    render(ctx, deltatime) {
        this.renderState.render(ctx, deltatime, this.dir, this.spriteMap);
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
