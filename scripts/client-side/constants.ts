export const PHYSICS_FUNCTIONS = {
	Idle: function(x: any, y: any, t: any) {
		return {x: x, y: y}
	},
	Running: function(x: any, y: any, t: any){
		return {
			x:0,
			y:0
		}
	},
	Jumping: function(x: any, y: any, t: any){
		return {
			x:0,
			y:0
		}
	},
	Spiking: function(x: any, y: any, t: any){
		return {
			x:0,
			y:0
		}
	},
	Passing: function(x: any, y: any, t: any){
		return {
			x:0,
			y:0
		}
	}
}

export const ANIMATION_DETAILS = {
    Idle: {
		maxFrame: 4,
		mapRow: 1,
        fps:10
	},
	Running: {
		maxFrame: 8,
		mapRow: 0,
        fps:16
	},
	Passing: {
		maxFrame: 7,
		mapRow: 2,
        fps:50
	},
	Jumping: {
		maxFrame: 8,
		mapRow: 3,
        fps:12
	},
	Setting: {
		maxFrame: 6,
		mapRow: 7,
        fps:14
	},
	Spiking: {
		maxFrame: 8,
		mapRow: 4,
        fps:20
	},
	Blocking: {
		maxFrame: 5,
		mapRow: 8,
        fps:14
	},
	Stepback: {
		maxFrame: 3,
		mapRow: 0,
        fps:0
	},
	Falling: {
		freezeFrame: 7,
		maxFrame: 1,
		mapRow: 4,
        fps:0
	},
	Diving: {
		maxFrame: 8,
		mapRow: 6,
        fps:10
	},
	JumpServeTossing: {
		maxFrame: 7,
		mapRow: 9,
        fps:0
	},
}

export const PERFECT_SCALING_RATIO = 1.8;

export const PLAYER_FRAME_WIDTH = 100;// width on sprite map
export const PLAYER_ANIMATION = {
    FRAME_WIDTH: 100,
    WIDTH: 0,
    HEIGHT: 0
}

export enum DIRECTION {
    LEFT = 0,
    RIGHT = 1
}