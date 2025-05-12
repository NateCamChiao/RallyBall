const DIRECTION = {
    LEFT: 0,
    RIGHT: 1
}
class RenderState{
    constructor(spriteMapRow, framesPerSecond, animationFrameLength, initialPosition, startDate = Date.now()){
        this.mapRow = spriteMapRow;
        this.fps = 1000 / framesPerSecond; //frame length
        this.maxFrames = animationFrameLength; // inclusive
        this.initialPosition = initialPosition;
        this.startDate = startDate;
    }

    calculateCoords(){
        return {
            x: this.initialPosition.x,
            y: this.initialPosition.y
        }
    }

    serverToClientCoords(x, y){
        return {
            x:0,
            y:0
        }
    }

    render(ctx, deltatime, direction, size, spriteMap){
        
        let animationLength = Date.now() - this.startDate;
        let frame = Math.floor(animationLength / this.fps) % (this.maxFrames); // * (delta time) /  mod (maxFrames * )
        let coords = this.calculateCoords(deltatime);
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

class IdleAnimation extends RenderState{
    calculateCoords(){

    }
}

class PlayerRenderer{
    constructor(ctx, dir, initialPosition, startDate, spriteMap){
        this.ctx = ctx;
        this.renderState = new RenderState(0, 13, 8, initialPosition);
        this.dir = dir;
        this.initialPosition = initialPosition;
        this.startDate = startDate;
        this.spriteMap = spriteMap;
    }

    render(ctx, deltatime, size){
        this.renderState.render(ctx, deltatime, this.dir, size, this.spriteMap);
    }
}


class BallRenderer{
    constructor(initialX, initialY, intialHeight, intialVelocity, startDate){
        this.init_X = initialX;
        this.init_Y = initialY;
        this.init_H = intialHeight;
        this.init_V = intialVelocity;
        this.startDate = startDate;
    }
}