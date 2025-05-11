let canvas = document.querySelector("#game-canvas");

let ctx = canvas.getContext("2d");

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
    game = new Game(ctx, canvas, playerAssets, sceneAssets);
}
// createClientGame();

window.addEventListener("resize", (e) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    game?.resize(canvas);
});