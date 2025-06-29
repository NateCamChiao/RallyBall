
export interface Coordinates{
	x: number,
    y: number
}

export enum PlayerStates {
	Idle = "Idle",
	Running = "Running",
	Passing = "Passing", 
	Jumping = "Jumping",
	Setting = "Setting",
	Spiking = "Spiking",
	Blocking = "Blocking",
	Stepback = "Stepback",
	Falling = "Falling",
	Diving = "Diving",
	JumpServeTossing = "JumpServeTossing",
}

export const POSITION_FUNCTIONS = {
	Idle: function(coords: Coordinates, dir: DIRECTION, t: any) : Coordinates {
		return {x: coords.x, y: coords.y};
	},
	Running: function(coords: Coordinates, dir: DIRECTION, t: any): Coordinates {
		return {x: coords.x, y: coords.y};
	},
	Jumping: function(coords: Coordinates, dir: DIRECTION, t: any): Coordinates {
		return {x: coords.x, y: coords.y};
	},
	Spiking: function(coords: Coordinates, dir: DIRECTION, t: any): Coordinates {
		return {x: coords.x, y: coords.y};
	},
	Passing: function(coords: Coordinates, dir: DIRECTION, t: any): Coordinates {
		return {x: coords.x, y: coords.y};
	},
	Setting: function(coords: Coordinates, dir: DIRECTION, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
	Blocking: function(coords: Coordinates, dir: DIRECTION, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
	Stepback: function(coords: Coordinates, dir: DIRECTION, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
	Falling: function(coords: Coordinates, dir: DIRECTION, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
	Diving: function(coords: Coordinates, dir: DIRECTION, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
	JumpServeTossing: function(coords: Coordinates, dir: DIRECTION, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
	Ball: function(coords: Coordinates, velocity: {vx: number, vy: number}, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
}

export const calculateGravity = (yInitial: number, gravity: number, time: number): Coordinates => {
	return {
		x: 0,
		y: 0
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

export const CLIENT_RENDERING = {
	Idle:{
		Animation: ANIMATION_DETAILS.Idle,
		Position: POSITION_FUNCTIONS.Idle
	},
	Running:{
		Animation: ANIMATION_DETAILS.Running,
		Position: POSITION_FUNCTIONS.Running
	},
	Passing:{
		Animation: ANIMATION_DETAILS.Passing,
		Position: POSITION_FUNCTIONS.Passing
	},
	Jumping:{
		Animation: ANIMATION_DETAILS.Jumping,
		Position: POSITION_FUNCTIONS.Jumping
	},
	Setting:{
		Animation: ANIMATION_DETAILS.Setting,
		Position: POSITION_FUNCTIONS.Setting
	},
	Spiking:{
		Animation: ANIMATION_DETAILS.Spiking,
		Position: POSITION_FUNCTIONS.Spiking
	},
	Blocking:{
		Animation: ANIMATION_DETAILS.Blocking,
		Position: POSITION_FUNCTIONS.Blocking
	},
	Stepback:{
		Animation: ANIMATION_DETAILS.Stepback,
		Position: POSITION_FUNCTIONS.Stepback
	},
	Falling:{
		Animation: ANIMATION_DETAILS.Falling,
		Position: POSITION_FUNCTIONS.Falling
	},
	Diving:{
		Animation: ANIMATION_DETAILS.Diving,
		Position: POSITION_FUNCTIONS.Diving
	},
	JumpServeTossing:{
		Animation: ANIMATION_DETAILS.JumpServeTossing,
		Position: POSITION_FUNCTIONS.JumpServeTossing
	},
}

export const PERFECT_SCALING_RATIO = 1.8;

export const PLAYER_FRAME_WIDTH = 100;// width on sprite map
export const PLAYER_ANIMATION = {
	FRAME_WIDTH: 100, //width of player in assets
    WIDTH: 0,
    HEIGHT: 0
}

export enum DIRECTION {
	LEFT = 0,
    RIGHT = 1
}