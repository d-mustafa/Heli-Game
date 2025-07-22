console.log('invincibility file added')
// Helicopter Game Start
// Set up canvas and graphics context
const cnv = document.getElementById("my-canvas");
const ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

// Global Variables (Once)
let mouseIsPressed = false;
let now = Date.now();

let heliImg = document.createElement("img");
heliImg.src = "img/heliBlueTransparent.png";

const explosion = document.createElement("audio");
explosion.src = "sound/explosion.wav";
explosion.preload = "none";

const propeller = document.createElement("audio");
propeller.src = "sound/propeller.wav";
propeller.preload = "none";
let propellerPromise;

const invincibility = document.createElement("audio");
invincibility.src = "sound/invincibility.mp3";
invincibility.preload = "none";

// Global Variables (Reset)
let state;
let heli;
let wall1, wall2, wall3;
let distance;
let powerUp;
let best = 0;
reset();

// Draw Function
window.addEventListener("load", draw);
function draw() {
  now = Date.now();
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
document.addEventListener("mousedown", pressHandler);
document.addEventListener("mouseup", releaseHandler);

// Keyboard
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") pressHandler();
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") releaseHandler();
});

// Touchscreen
document.addEventListener("touchstart", (event) => {
  pressHandler();
  event.preventDefault(); // Prevent long-press and selection
}, { passive: false });

document.addEventListener("touchend", releaseHandler, false);
document.addEventListener("touchcancel", releaseHandler, false);

document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
}, false);

// Handlers
function pressHandler() {
  mouseIsPressed = true;

  // Play propeller sound
  propeller.currentTime = 0;
  propellerPromise = propeller.play();

  // Start Game on Mousedown
  if (state === "start") {
    state = "gameon";
  }
}

function releaseHandler() {
  mouseIsPressed = false;

  // Pause propeller sound without causing errors
  if (propellerPromise !== undefined) {
    propellerPromise.then(_ => {
      // Automatic playback started!
      // Show playing UI.
      // We can now safely pause video...
      propeller.pause();
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
      console.warn(error);
    });
  }
}

// User Data
const localData = localStorage.getItem('localHeliGameData');
let userData;
let resetLocalData = false;
let lastSave = 0;

if (localData) {
  try {
    userData = JSON.parse(localData);
    ['best'].forEach(data =>{
      if(!(data in userData)) userData[data] = eval(data)
    })
    best = userData.best;
  }
  catch (e) {
    console.warn('invalid local data; resetting.\n', e);
    localStorage.removeItem('localHeliGameData');
    resetLocalData = true;
  }
}
if (resetLocalData || !localData) {
  userData = {best: best,};
  localStorage.setItem('localHeliGameData', JSON.stringify(userData));
}
// if the user crashes
window.addEventListener('beforeunload', () => {
  userData.best = best;
  localStorage.setItem('localHeliGameData', JSON.stringify(userData))
})

// Dev Tools
let track = false;
let enableHitPoints = false;
cnv.addEventListener('mousemove', (event) => {
    if (track) {
        const rect = cnv.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
        console.log(`x:${mouseX}\ny:${mouseY}`);
    }
});
