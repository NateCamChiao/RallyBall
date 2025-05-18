"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
let canvas = document.querySelector("#game-canvas") || new HTMLCanvasElement;
// let ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
let sceneAssets;
let playerAssets;
sceneAssets = new Image();
sceneAssets.src = "assets/Assets(v.0.2).svg";
playerAssets = new Image();
playerAssets.src = "assets/Stick(0.23).svg";
let game;
async function waitForImage(image) {
    return new Promise((resolve, reject) => {
        image.onload = function () {
            resolve();
        };
        image.onerror = function () {
            reject();
        };
    });
}
async function loadAssets() {
    try {
        await Promise.all([waitForImage(sceneAssets), waitForImage(playerAssets)]);
        createClientGame();
    }
    catch (error) {
        console.error(error);
    }
}
loadAssets();
function createClientGame() {
    game = new game_1.Game(canvas, playerAssets, sceneAssets);
}
// createClientGame();
window.addEventListener("resize", (e) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    game?.resize(canvas);
});
