// FUNCTIONS

// Draw Start Screen
function drawStart() {
  drawMainComponenents();

  // Start Text
  ctx.font = "40px Consolas";
  ctx.fillStyle = "lightblue";
  ctx.fillText("CLICK TO START", 350, 285);

  ctx.font = "25px Consolas";
  ctx.fillText("CLICK AND HOLD LEFT MOUSE BUTTON TO GO UP", 100, 450);
  ctx.fillText("RELEASE TO GO DOWN", 415, 480);
}

// Draw Game Elements
function runGame() {
  // contains all the necessary functions for the game to run
  // LOGIC
  moveHeli();
  moveWalls();
  checkCollisions();
  addDistance();

  // DRAW
  drawGame();
}

function addDistance() {
  // increase the distance over time
  distance.d += distance.speed;
  distance.speed += distance.accel;

  if (distance.speed > 0.5) {
    distance.speed = 0.5;
  }
}

function checkCollisions() {
  // Collisions with Top and Bottom Green Bars
  if (heli.y < 50) {
    gameOver();
  } else if (heli.y + heli.h > cnv.height - 50) {
    gameOver();
  }

  // Collsions wih the Walls
  if (
    heli.x + heli.w / 2 >= wall1.x - wall1.w / 2 &&
    heli.x + heli.w / 2 <= wall1.x + wall1.w / 2 &&
    heli.y - heli.h / 2 >= wall1.y - wall1.h / 2 &&
    heli.y - heli.h / 2 <= wall1.y + wall1.h - wall1.w / 2
  ) {
    gameOver();
  }
  if (
    heli.x + heli.w / 2 >= wall2.x - wall2.w / 2 &&
    heli.x + heli.w / 2 <= wall2.x + wall2.w / 2 &&
    heli.y - heli.h / 2 >= wall2.y - wall2.h / 2 &&
    heli.y - heli.h / 2 <= wall2.y + wall2.h - wall2.w / 2
  ) {
    gameOver();
  }
  if (
    heli.x + heli.w / 2 >= wall3.x - wall3.w / 2 &&
    heli.x + heli.w / 2 <= wall3.x + wall3.w / 2 &&
    heli.y - heli.h / 2 >= wall3.y - wall3.h / 2 &&
    heli.y - heli.h / 2 <= wall3.y + wall3.h - wall3.w / 2
  ) {
    gameOver();
  }
}

function gameOver() {
  if (distance.d > best) {
    best = Math.floor(distance.d);
  }

  explosion.play();
  state = "gameover";

  setTimeout(reset, 2000);
}

function moveWalls() {
  // Wall1
  wall1.x += wall1.speed;
  wall1.speed += wall1.accel;
  if (wall1.x + wall1.w < 0) {
    wall1.x = wall3.x + 500;
    wall1.y = Math.random() * 300 + 100;
  }

  // Wall2
  wall2.x += wall2.speed;
  wall2.speed += wall2.accel;
  if (wall2.x + wall2.w < 0) {
    wall2.x = wall1.x + 500;
    wall2.y = Math.random() * 300 + 100;
  }

  // Wall3
  wall3.x += wall3.speed;
  wall3.speed += wall3.accel;
  if (wall3.x + wall3.w < 0) {
    wall3.x = wall2.x + 500;
    wall3.y = Math.random() * 300 + 100;
  }
}

function moveHeli() {
  // Accelerate upward if mouse pressed
  if (mouseIsPressed) {
    heli.speed += -1;
  }

  // Apply Gravity(accel)
  heli.speed += heli.accel;

  // Constrain Speed (max/min)
  if (heli.speed > 5) {
    heli.speed = 5;
  } else if (heli.speed < -5) {
    heli.speed = -5;
  }

  // Move Helicopter by its soeed
  heli.y += heli.speed;
}

function drawGame() {
  drawMainComponenents();
  drawWalls();
}

// Draw Game Over Screen
function drawGameOver() {
  drawMainComponenents();
  drawWalls();

  // Circle around Helicopter
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(heli.x + heli.w / 2, heli.y + heli.h / 2, 60, 0, 2 * Math.PI);
  ctx.stroke();

  // Game Over Text
  ctx.font = "40px Consolas";
  ctx.fillStyle = "lightblue";
  ctx.fillText("GAME OVER", 350, 285);
}

// HELPER FUNCTIONS
function reset() {
  // Completely restrarts the game
  state = "start";
  heli = {
    x: 200,
    y: 250,
    w: 80,
    h: 40,
    speed: 0,
    accel: 0.5,
  };

  class Wall {
    constructor(x, y, w, h, speed, accel) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.speed = speed;
      this.accel = accel;
    }

    moveWall(nextWallWidth) {
      this.x += this.speed;
      this.speed += this.accel;

      // If out of bounds
      if (this.x + this.w < 0) {
        this.x = cnv.width + nextWallWidth;
        this.y = Math.random() * 300 + 100;
      }
  }

  //let newWall1 = new Wall(cnv.width, Math.random()*300+100, 50, 100, -3, -0.0025);
  //let newWall2 = new Wall(cnv.width+500, Math.random()*300+100, 50, 100, -3, -0.0025);
  //let newWall3 = new Wall(cnv.width+1000, Math.random()*300+100, 50, 100, -3, -0.0025);
  
  wall1 = {
    x: cnv.width,
    y: Math.random() * 300 + 100,
    w: 50,
    h: 100,
    speed: -3,
    accel: -0.0025,
  };
  wall2 = {
    x: cnv.width + 500,
    y: Math.random() * 300 + 100,
    w: 50,
    h: 100,
    speed: -3,
    accel: -0.0025,
  };
  wall3 = {
    x: cnv.width + 1000,
    y: Math.random() * 300 + 100,
    w: 50,
    h: 100,
    speed: -3,
    accel: -0.0025,
  };
  distance = {
    d: 0,
    speed: 0.025,
    accel: 0.00001,
  };
}

function drawWalls() {
  ctx.fillStyle = "green";
  ctx.fillRect(wall1.x, wall1.y, wall1.w, wall1.h);
  ctx.fillRect(wall2.x, wall2.y, wall2.w, wall2.h);
  ctx.fillRect(wall3.x, wall3.y, wall3.w, wall3.h);
}

function drawMainComponenents() {
  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  // Green Bars
  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, cnv.width, 50);
  ctx.fillRect(0, cnv.height - 50, cnv.width, 50);

  // Green Bar Text
  ctx.font = "30px Consolas";
  ctx.fillStyle = "black";
  ctx.fillText("HELICOPTER GAME", 25, 35);
  ctx.fillText(`DISTANCE: ${Math.floor(distance.d)}`, 25, cnv.height - 15);
  ctx.fillText(`BEST: ${best}`, cnv.width - 250, cnv.height - 15);

  // Helicopter
  ctx.drawImage(heliImg, heli.x, heli.y);

  // Power Up (DIDNT HAVE ENOUGH TIME TO GET THE POWER UP WORKING SORRY, BUT HERES THE DESIGN)
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(750, 25, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = "lime";
  ctx.beginPath();
  ctx.arc(750, 25, 20, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "lime";
  ctx.beginPath();
  ctx.moveTo(750, 12);
  ctx.lineTo(760, 28);
  ctx.lineTo(740, 28);
  ctx.lineTo(750, 12);
  ctx.fill();

  ctx.fillStyle = "lime";
  ctx.fillRect(745, 25, 10, 12);
  ctx.fill();
}
