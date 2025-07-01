
export interface Coordinates{
	x: number,
    y: number
}
export interface Velocity{
	vx: number,
	vy: number
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

export type PositionFunctions = {
	[key: string]: (coords: Coordinates, dir: DIRECTION, t:any) => Coordinates
}

export const POSITION_FUNCTIONS: PositionFunctions = {
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
	
}
/*
todo delete this
ball positioning for later
Ball: function(coords: Coordinates, velocity: {vx: number, vy: number}, t:any): Coordinates{
		return {x: coords.x, y: coords.y};
	},
*/

export const calculateGravity = (yInitial: number, gravity: number, time: number): Coordinates => {
	return {
		x: 0,
		y: 0
	}
}

export type AnimationDetails = {
	[key: string]: {
		maxFrame: number,
		mapRow: number,
		fps: number,
		freezeFrame?: number
	}
}


export const ANIMATION_DETAILS: AnimationDetails = {
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
export type ClientRenderData = {
	[key: string]: {
		animation: AnimationDetails[typeof key],
		position: any
	}
}
export const CLIENT_RENDERING: ClientRenderData = {
	Idle:{
		animation: ANIMATION_DETAILS.Idle,
		position: POSITION_FUNCTIONS.Idle
	},
	Running:{
		animation: ANIMATION_DETAILS.Running,
		position: POSITION_FUNCTIONS.Running
	},
	Passing:{
		animation: ANIMATION_DETAILS.Passing,
		position: POSITION_FUNCTIONS.Passing
	},
	Jumping:{
		animation: ANIMATION_DETAILS.Jumping,
		position: POSITION_FUNCTIONS.Jumping
	},
	Setting:{
		animation: ANIMATION_DETAILS.Setting,
		position: POSITION_FUNCTIONS.Setting
	},
	Spiking:{
		animation: ANIMATION_DETAILS.Spiking,
		position: POSITION_FUNCTIONS.Spiking
	},
	Blocking:{
		animation: ANIMATION_DETAILS.Blocking,
		position: POSITION_FUNCTIONS.Blocking
	},
	Stepback:{
		animation: ANIMATION_DETAILS.Stepback,
		position: POSITION_FUNCTIONS.Stepback
	},
	Falling:{
		animation: ANIMATION_DETAILS.Falling,
		position: POSITION_FUNCTIONS.Falling
	},
	Diving:{
		animation: ANIMATION_DETAILS.Diving,
		position: POSITION_FUNCTIONS.Diving
	},
	JumpServeTossing:{
		animation: ANIMATION_DETAILS.JumpServeTossing,
		position: POSITION_FUNCTIONS.JumpServeTossing
	},
}

export const PERFECT_SCALING_RATIO = 1.8;
export const SCALING_UNIT_TO_PLAYER_SIZE = 0.17;//multiply by scaling unit to get player size

export const PLAYER_FRAME_WIDTH = 100;// width on sprite map
export const PLAYER_ANIMATION = {
	FRAME_WIDTH: 100, //width of player in assets
    WIDTH: 0,
    HEIGHT: 0,
	NAME_CONST: {
		NAME_RATIO_TO_SCALING_UNIT: 25/1638,
		LEFT_AMOUNT_BY_PLAYER_SIZE: -0.05,
		DOWN_AMOUNT_BY_PLAYER_SIZE: 0.15
	}
}

export enum DIRECTION {
	LEFT = 0,
    RIGHT = 1
}

export enum GAMESTATES {
	QUEING,
	SERVING,
	PLAYING,
	PAUSED,
	ENDED,
	SANDBOX
}

export type BallStateData = {
	initialPosition: Coordinates,
	initialVelocity: Velocity,
	startDate: Date
}

export type PlayerStateData = {
	dir: DIRECTION,
	initalPosition: Coordinates,
	startData: Date,
	playerState: PlayerStates
}

export type GameStateData = {
	players: PlayerStateData[],
	gameState: GAMESTATES,
	ball: BallStateData
}
export type ClientInputData = {
	keysDown: any[],
	keysUp: any[],
	keysHeld: Set<string>
}