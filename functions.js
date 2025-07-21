// FUNCTIONS

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

function runGame() {
  // LOGIC
  moveHeli();
  moveObjects();
  checkCollisions();
  addDistance();

  // DRAW
  drawMainComponenents();
  drawObjects();
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
    if (heli.invincible) heli.y = 50;
    else gameOver();
  } else if (heli.y + heli.h > cnv.height - 50) {
    if (heli.invincible) heli.y = cnv.height - 50 - heli.h;
    else gameOver();
  }

  // Collisions with the Walls
  wall1.checkCollisions()
  wall2.checkCollisions()
  wall3.checkCollisions()
  
  // Collisions with the powerUp
  const dx = heli.x - powerUp.x;
  const dy = heli.y - powerUp.y;
  const dist = Math.hypot(dx, dy);

  if (dist < powerUp.r + 20) {
    heli.invincible = true;
    powerUp.x = cnv.width + 1250;
    powerUp.y = Math.random() * 300 + 100;
    powerUp.speed = -3;
    powerUp.lastCollected = now;
  };

  if (now - powerUp.lastCollected < 3) { // turns heli's color green
    heliImg.src = 'img/heliGreenTransparent.png';
    if (now - powerUp.lastCollected < 2.5) heli.flickerTimer = now;
  }
  else if (now - powerUp.lastCollected < 5) { // heli's color swaps between green and blue
    if (now - heli.flickerTimer >= 0.5) {
      heli.flickerTimer = now;
      
      if (heliImg.src === 'img/heliGreenTransparent.png') {
        heliImg.src = 'img/heliBlueTransparent.png';
      } elseheliImg.src = 'img/heliGreenTransparent.png';
    }
  } else { // turns heli's color blue
    heli.invincible = false;
    heliImg.src = 'img/heliBlueTransparent.png';
  }
}

function gameOver() {
  if (distance.d > best) {
    best = Math.floor(distance.d);
  }

  explosion.play();
  state = "gameover";

  setTimeout(reset, 1500);
}

function moveObjects() {
  wall1.moveWall(wall3)
  wall2.moveWall(wall1)
  wall3.moveWall(wall2)
  
  powerUp.x += powerUp.speed;
  powerUp.speed += powerUp.accel;
  if (powerUp.x + powerUp.r < 0) {
    powerUp.x = cnv.width + 1250;
    powerUp.y = Math.random() * 300 + 100;
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

function drawObjects() {
  drawPowerUp(powerUp.x, powerUp.y, powerUp.r);
  
  ctx.fillStyle = "green";
  ctx.fillRect(wall1.x, wall1.y, wall1.w, wall1.h);
  ctx.fillRect(wall2.x, wall2.y, wall2.w, wall2.h);
  ctx.fillRect(wall3.x, wall3.y, wall3.w, wall3.h);
}

function drawGameOver() {
  drawMainComponenents();
  drawObjects();

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
  // Restarts the game
  state = "start";
  heli = {
    x: 200,
    y: 250,
    w: 80,
    h: 40,
    speed: 0,
    accel: 0.5,
    invincible: false,
    flickerTimer: null,
  };
  wall1 = new Wall(cnv.width);
  wall2 = new Wall(cnv.width + 500);
  wall3 = new Wall(cnv.width + 1000);
  distance = {
    d: 0,
    speed: 0.025,
    accel: 0.00001,
  };
  powerUp = {
    x: cnv.width + 1250,
    y: Math.random() * 300 + 100,
    r: 20,
    speed: -3,
    accel: -0.003,
    lastCollected: null,
  };
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
}

function drawPowerUp(x, y, r) {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = "lime";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "lime";
  ctx.beginPath();
  ctx.moveTo(x, y-13);
  ctx.lineTo(x+10, y+3);
  ctx.lineTo(x-10, y+3);
  ctx.lineTo(x, y-13);
  ctx.fill();

  ctx.fillRect(x-5, y, 10, 12);
  ctx.fill();
}

class Wall {
  constructor(x) {
    this.x = x;
    this.y = Math.random() * 300 + 100,
    this.w = 50;
    this.h = 100;
    this.speed = -3;
    this.accel = -0.0025;
  }

  moveWall(wallahead) {
    this.x += this.speed;
    this.speed += this.accel;

    // If out of bounds
    if (this.x + this.w < 0) {
      this.x = wallahead.x + 500;
      this.y = Math.random() * 300 + 100;
    }
  }

  checkCollisions() {
    if (
      heli.x + heli.w / 2 >= this.x - this.w / 2 &&
      heli.x + heli.w / 2 <= this.x + this.w / 2 &&
      heli.y - heli.h / 2 >= this.y - this.h / 2 &&
      heli.y - heli.h / 2 <= this.y + this.h - this.w / 2 &&
      !heli.invincible
    ) gameOver();
  }
}
