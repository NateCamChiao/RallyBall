import {DIRECTION, Coordinates, PlayerStates, SERVER, getAnimationLoopDuration, ANIMATION_DETAILS} from "./constants.js";

interface PositionData{
    coords: Coordinates;
    endBehavior: {
        time: number, //sec
        newState: PlayerStates | null
    }
}
export class PositionFunctionUtils{
    static getLandingTime(a: number, b: number, c: number): number{
        let discriminant = b * b - 4 * a * c;
        if(discriminant <= 0 || a == 0) 
            return 0;
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return Math.max(root1, root2);
    }
    static calculateTrajectory(initialPosition: Coordinates, initialVelocity: {vx: number, vy: number}, time: number, groundLevel = SERVER.player.floorLevel, gravity = SERVER.player.gravity): {coords: Coordinates, landingTime: number}{
        let landingTime = this.getLandingTime(1/2 * gravity, initialVelocity.vy, initialPosition.y - groundLevel);
        let newPosition = {
            x: initialVelocity.vx * time + initialPosition.x,
            y: initialPosition.y + initialVelocity.vy * time + 1/2 * gravity * time * time
        }
        if(time > landingTime){
            newPosition.x = initialPosition.x + initialVelocity.vx * landingTime;
            newPosition.y = groundLevel;
        }
        return {
            coords: {
                x: newPosition.x,
                y: newPosition.y
            },
            landingTime: landingTime
        }
    }
}
export class PositionFunctions{
    static timeFromDist(distance: number, distPerSec: number): number{
        if(distPerSec == 0){
            return 0;
        }
        return 1 / distPerSec * Math.abs(distance);
    }
    static Idle(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Running(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        let secondsPassed = t / 1000;
        let newPosition: Coordinates = {x:0, y: initialPosition.y};
        let maxPositionX = dir == DIRECTION.LEFT ? SERVER.netPos.bottom.x + SERVER.netPos.bottom.w : SERVER.netPos.bottom.x - SERVER.player.size;
        newPosition.x = secondsPassed * SERVER.player.runningSpeed;
        if(dir == DIRECTION.LEFT){
            newPosition.x = -newPosition.x;
        }
        maxPositionX *= 200;
        newPosition.x += initialPosition.x;
        if(dir == DIRECTION.LEFT && initialPosition.x > maxPositionX && t > this.timeFromDist(initialPosition.x - maxPositionX, SERVER.player.runningSpeed) * 1000){
            newPosition.x = maxPositionX;
        }
        else if(dir == DIRECTION.RIGHT && initialPosition.x < maxPositionX && t > this.timeFromDist(initialPosition.x - maxPositionX, SERVER.player.runningSpeed) * 1000){
            newPosition.x = maxPositionX;
        }
        return {
            coords: newPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Jumping(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        let newPosition: Coordinates = {x:initialPosition.x, y: initialPosition.y};
        const jumpTime = 1 / ANIMATION_DETAILS.Jumping.fps * 7;
        let secondsPassed = t / 1000;
        let trajectoryData = PositionFunctionUtils.calculateTrajectory(initialPosition, {vx: 0, vy: SERVER.player.jumpForce}, secondsPassed - jumpTime, SERVER.player.floorLevel, SERVER.player.gravity);
        if(secondsPassed >= jumpTime){
            newPosition = trajectoryData.coords;
        }
        return {
            coords: newPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Spiking(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Passing(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Setting(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Blocking(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Stepback(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Falling(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static Diving(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }
    static JumpServeTossing(initialPosition: Coordinates, dir: DIRECTION, t: any): PositionData{
        return {
            coords: initialPosition,
            endBehavior: { time: Infinity, newState: null }
        }
    }

}