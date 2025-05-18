import { Game } from "./game";


let canvas: HTMLCanvasElement = document.querySelector("#game-canvas") || new HTMLCanvasElement;

// let ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let sceneAssets: HTMLImageElement;
let playerAssets: HTMLImageElement;
sceneAssets = new Image();
sceneAssets.src = "assets/Assets(v.0.2).svg";
playerAssets = new Image();
playerAssets.src = "assets/Stick(0.23).svg";
let game: { resize: (arg0: HTMLCanvasElement) => void; };

async function waitForImage(image: HTMLImageElement) {
    return new Promise<void>((resolve, reject) => {
        image.onload = function(){
            resolve();
        }
        image.onerror = function(){
            reject();
        }
    });
}

async function loadAssets(){
    try {
        await Promise.all([waitForImage(sceneAssets), waitForImage(playerAssets)]);
        createClientGame();
    } catch (error) {
        console.error(error);
    }
}
loadAssets();

function createClientGame(){
    game = new Game(canvas, playerAssets, sceneAssets);
}
// createClientGame();

window.addEventListener("resize", (e) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    game?.resize(canvas);
});