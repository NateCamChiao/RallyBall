const DIRECTION = {
    LEFT: 0,
    RIGHT: 1
}
class RenderState{
    constructor(spriteMapRow, framesPerSecond, animationFrameLength){
        this.frame = 0;
        this.mapRow = spriteMapRow;
        this.fps = 1000 / framesPerSecond;
        this.maxFrames = animationFrameLength; // inclusive
    }


    render(ctx, direction, size, coords, spriteMap){
        ctx.save();
        
        ctx.translate(coords.x + size / 2, coords.y + size / 2);
        if(direction == DIRECTION.LEFT){
            ctx.scale(-1, 1);
        }
        // ctx.drawImage(spriteMap, 0,0);
        // console.log(spriteMap);
        ctx.drawImage(
            spriteMap, 
            this.frame * PLAYER_ANIMATION.FRAME_WIDTH,
            this.mapRow * PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            PLAYER_ANIMATION.FRAME_WIDTH,
            -size / 2,
            -size / 2,
            size,
            size
        );
        ctx.restore();
        // ctx.fillRect(100,100, 50,50);
    }
}

class IdleAnimation extends RenderState{
    constructor(){
        super()
    }
}

class PlayerRenderer{
    constructor(ctx, dir, initialPosition, startDate, spriteMap){
        this.ctx = ctx;
        this.renderState = new RenderState(0, 10, 8);
        this.dir = dir;
        this.initialPosition = initialPosition;
        this.startDate = startDate;
        this.spriteMap = spriteMap;
    }

    calculateCoords(){
        return {
            x: 300,
            y: 1000
        }
    }

    render(ctx, size){
        this.renderState.render(ctx, this.dir, size, this.calculateCoords(), this.spriteMap);
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