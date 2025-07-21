// Helicopter Game Start

// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

// Global Variables (Once)
let heliImg = document.createElement("img");
heliImg.src = "img/heliBlueTransparent.png";

let explosion = document.createElement("audio");
explosion.src = "sound/explosion.wav";

let propeller = document.createElement("audio");
propeller.src = "sound/propeller.wav";

let mouseIsPressed = false;

// Global Variables (Reset)
let state;
let heli;
let wall1, wall2, wall3;
let distance;
let best = 0;
reset();

// Draw Function
window.addEventListener("load", draw);

function draw() {
  if (state === "start") {
    drawStart();
  } else if (state === "gameon") {
    runGame();
  } else if (state === "gameover") {
    drawGameOver();
  }

  // Request Animation Frame
  requestAnimationFrame(draw);
}

// EVENT STUFF
// Mouse
document.addEventListener("mousedown", mousedownHanlder);
document.addEventListener("mouseup", mouseupHandler);

// Keyboard
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") mousedownHanlder;
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") mouseupHanlder;
});

// Touchscreen
document.addEventListener("touchstart", (event) => {
  mousedownHanlder();
  event.preventDefault(); // Prevent long-press and selection
}, { passive: false });

document.addEventListener("touchend", mouseupHanlder, false);
document.addEventListener("touchcancel", mouseupHanlder, false);

document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
}, false);

// Handlers
function mousedownHanlder() {
  mouseIsPressed = true;

  // Play propeller sound
  propeller.currentTime = 0;
  propeller.play();

  // Start Game on Mousedown
  if (state === "start") {
    state = "gameon";
  }
}

function mouseupHandler() {
  mouseIsPressed = false;
  propeller.pause();
}
