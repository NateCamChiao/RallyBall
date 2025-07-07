import { DIRECTION, SERVER, ANIMATION_DETAILS } from "./constants.js";
export class PositionFunctionUtils {
    static getLandingTime(a, b, c) {
        let discriminant = b * b - 4 * a * c;
        if (discriminant <= 0 || a == 0)
            return 0;
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return Math.max(root1, root2);
    }
    static calculateTrajectory(initialPosition, initialVelocity, time, groundLevel = SERVER.player.floorLevel, gravity = SERVER.player.gravity) {
        let landingTime = this.getLandingTime(1 / 2 * gravity, initialVelocity.vy, initialPosition.y - groundLevel);
        let newPosition = {
            x: initialVelocity.vx * time + initialPosition.x,
            y: initialPosition.y + initialVelocity.vy * time + 1 / 2 * gravity * time * time
        };
        if (time > landingTime) {
            newPosition.x = initialPosition.x + initialVelocity.vx * landingTime;
            newPosition.y = groundLevel;
        }
        return {
            coords: {
                x: newPosition.x,
                y: newPosition.y
            },
            landingTime: landingTime
        };
    }
    static millisToSec(milliseconds) {
        return milliseconds / 1000;
    }
}
export class PositionFunctions {
    static timeFromDist(distance, distPerSec) {
        if (distPerSec == 0) {
            return 0;
        }
        return 1 / distPerSec * Math.abs(distance);
    }
    static Idle(initialPosition, dir, t) {
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Running(initialPosition, dir, t) {
        let newPosition = { x: 0, y: initialPosition.y };
        let maxPositionX = dir == DIRECTION.LEFT ? SERVER.netPos.bottom.x + SERVER.netPos.bottom.w : SERVER.netPos.bottom.x - SERVER.player.size;
        newPosition.x = PositionFunctionUtils.millisToSec(t) * SERVER.player.runningSpeed;
        if (dir == DIRECTION.LEFT) {
            newPosition.x = -newPosition.x;
        }
        maxPositionX *= 200;
        newPosition.x += initialPosition.x;
        if (dir == DIRECTION.LEFT && initialPosition.x >= maxPositionX && t > this.timeFromDist(initialPosition.x - maxPositionX, SERVER.player.runningSpeed) * 1000) {
            newPosition.x = maxPositionX;
        }
        else if (dir == DIRECTION.RIGHT && initialPosition.x <= maxPositionX && t > this.timeFromDist(initialPosition.x - maxPositionX, SERVER.player.runningSpeed) * 1000) {
            newPosition.x = maxPositionX;
        }
        return {
            coords: newPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Jumping(initialPosition, dir, t) {
        let newPosition = { x: initialPosition.x, y: initialPosition.y };
        const jumpTime = 1 / ANIMATION_DETAILS.Jumping.fps * 7;
        let trajectoryData = PositionFunctionUtils.calculateTrajectory(initialPosition, { vx: 0, vy: SERVER.player.jumpForce }, PositionFunctionUtils.millisToSec(t) - jumpTime, SERVER.player.floorLevel, SERVER.player.gravity);
        if (PositionFunctionUtils.millisToSec(t) >= jumpTime) {
            newPosition = trajectoryData.coords;
        }
        return {
            coords: newPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Spiking(initialPosition, dir, t) {
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Passing(initialPosition, dir, t) {
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Setting(initialPosition, dir, t) {
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Blocking(initialPosition, dir, t) {
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Stepback(initialPosition, dir, t) {
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Falling(initialPosition, dir, t) {
        let newPosition = PositionFunctionUtils.calculateTrajectory(initialPosition, { vx: 0, vy: 0 }, PositionFunctionUtils.millisToSec(t), SERVER.player.floorLevel, SERVER.player.gravity);
        console.log(initialPosition, newPosition.coords);
        return {
            coords: newPosition.coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Diving(initialPosition, dir, t) {
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static JumpServeTossing(initialPosition, dir, t) {
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        };
    }
}
