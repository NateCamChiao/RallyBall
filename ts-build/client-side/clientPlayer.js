"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRenderer = void 0;
const constants_1 = require("./constants");
class RenderState {
    mapRow;
    freezeFrame;
    fps;
    maxFrames;
    initialPosition;
    startDate;
    serverToClientCoords;
    constructor(spriteMapRow, framesPerSecond, animationFrameLength, initialPosition, coordConversion, freezeFrame = 0, startDate = Date.now()) {
        this.mapRow = spriteMapRow;
        this.freezeFrame = freezeFrame;
        this.fps = 1000 / framesPerSecond; //frame length
        this.maxFrames = animationFrameLength; // inclusive
        this.initialPosition = initialPosition;
        this.startDate = startDate;
        //method
        this.serverToClientCoords = coordConversion;
    }
    addAnimationInfo(spriteMapRow, framesPerSecond, animationFrameLength, freezeFrame = 0) {
        this.mapRow = spriteMapRow;
        this.fps = framesPerSecond;
        this.maxFrames = animationFrameLength;
        this.freezeFrame = freezeFrame;
        return this;
    }
    addCoordInfo(initialPosition, coordConversion, startDate = Date.now()) {
        this.initialPosition = initialPosition;
        this.serverToClientCoords = coordConversion;
        this.startDate = startDate;
        return this;
    }
    /**
     * Alternate constructor if creating RenderState by passing in the cooresponding ANIMATION_DETAILS
     */
    static createWithAnimationDetails(animationDetails, initialPosition, coordConversion, startDate = Date.now()) {
        return new RenderState(animationDetails.mapRow, animationDetails.fps, animationDetails.maxFrame, initialPosition, coordConversion, animationDetails.freezeFrame ?? 0, startDate);
    }
    calculateCoords() {
        let { x, y } = this.initialPosition;
        let timeElapsed = Date.now() - this.startDate;
        //todo plug into fn(initialPos, t)
        return this.serverToClientCoords(x, y);
    }
    render(ctx, deltatime, direction, size, spriteMap) {
        let animationLength = Date.now() - this.startDate;
        let frame = Math.floor(animationLength / this.fps) % (this.maxFrames); // * (delta time) /  mod (maxFrames * )
        // If can't divide by fps then use freezeFrame
        if (this.fps == Infinity || this.fps == 0) {
            frame = this.freezeFrame;
        }
        console.log(frame, this.fps);
        let coords = this.calculateCoords();
        ctx.save();
        ctx.translate(coords.x + size / 2, coords.y + size / 2);
        if (direction == constants_1.DIRECTION.LEFT) {
            ctx.scale(-1, 1);
        }
        ctx.drawImage(spriteMap, frame * constants_1.PLAYER_ANIMATION.FRAME_WIDTH, this.mapRow * constants_1.PLAYER_ANIMATION.FRAME_WIDTH, constants_1.PLAYER_ANIMATION.FRAME_WIDTH, constants_1.PLAYER_ANIMATION.FRAME_WIDTH, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}
/**
 * IdleAnimation is here to avoid confusion. It inherits everything it needs from RenderState
 */
class IdleAnimation extends RenderState {
}
class RunningAnimation extends RenderState {
}
class PlayerRenderer {
    ctx;
    renderState;
    dir;
    initialPosition;
    startDate;
    spriteMap;
    constructor(ctx, dir, initialPosition, startDate, spriteMap, coordConvertingFunction) {
        this.ctx = ctx;
        this.renderState = RenderState.createWithAnimationDetails(constants_1.ANIMATION_DETAILS.Falling, initialPosition, coordConvertingFunction);
        this.dir = dir;
        this.initialPosition = initialPosition;
        this.startDate = startDate;
        this.spriteMap = spriteMap;
        // this.coordConvertFun = coordConvertingFunction;
    }
    render(ctx, deltatime, size) {
        this.renderState.render(ctx, deltatime, this.dir, size, this.spriteMap);
    }
}
exports.PlayerRenderer = PlayerRenderer;
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
