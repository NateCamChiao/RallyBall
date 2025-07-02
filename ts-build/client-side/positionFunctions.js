export class PositionFunctions {
    static Idle(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Running(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Jumping(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Spiking(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Passing(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Setting(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Blocking(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Stepback(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Falling(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static Diving(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
    static JumpServeTossing(coords, dir, t) {
        return {
            coords: coords,
            endBehavior: { time: Infinity, newState: null }
        };
    }
}
