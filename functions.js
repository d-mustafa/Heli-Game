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

function drawGameOver() {
  drawMainComponenents();
  drawObjects();

  // Circle around Helicopter
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(heli.offsetX, heli.offsetY, 60, 0, 2 * Math.PI);
  ctx.stroke();

  // Game Over Text
  ctx.font = "40px Consolas";
  ctx.fillStyle = "lightblue";
  ctx.fillText("GAME OVER", 350, 285);
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
  for (let i in heli.hitpoints) {
    const dx = heli.hitpoints[i][0] - powerUp.x;
    const dy = heli.hitpoints[i][1] - powerUp.y;
    const dist = Math.hypot(dx, dy);
    if (dist < powerUp.r + 10) {
      heli.invincible = true;
      powerUp.lastCollected = now;
      heli.hitpoints[i][2] = "rgba(255, 0, 0, 0.5)";
    };
  }
  if (now - powerUp.lastCollected < 3000) { // turns heli's color green
    heliImg.src = 'img/heliGreenTransparent.png';
    if (now - powerUp.lastCollected < 2750) heli.flickerTimer = now;
  }
  else if (now - powerUp.lastCollected < 5000) { // heli's color swaps between green and blue
    if (now - heli.flickerTimer >= 250) {
      heli.flickerTimer = now;
      
      if (heliImg.src.includes('img/heliBlueTransparent.png')) {
        heliImg.src = 'img/heliGreenTransparent.png';
      } else heliImg.src = 'img/heliBlueTransparent.png';
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
  // PowerUp despawning after collection
  if (heli.invincible) {
    powerUp.x = cnv.width + 1250;
    powerUp.y = Math.random() * 300 + 100;
  }
  
  drawPowerUp(powerUp.x, powerUp.y, powerUp.r);
  // PowerUp Hitbox
  ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
  ctx.beginPath();
  ctx.arc(powerUp.x, powerUp.y, powerUp.r + 10, 0, Math.PI*2);
  ctx.fill();

  // Walls
  ctx.fillStyle = "green";
  ctx.fillRect(wall1.x, wall1.y, wall1.w, wall1.h);
  ctx.fillRect(wall2.x, wall2.y, wall2.w, wall2.h);
  ctx.fillRect(wall3.x, wall3.y, wall3.w, wall3.h);
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
    /* hitpoints: [ [202, 261], [229, 255], [245, 253], [256, 253], [268, 255], [279, 262], [269, 277], [268, 289], [238, 288] ] */
    get hitpoints() {
      return [ [this.x+2, this.y+11, 0], [this.x+29, this.y+5, 0], [this.x+45, this.y+3, 0],
      [this.x+56, this.y+3, 0], [this.x+68, this.y+5, 0], [this.x+79, this.y+12, 0],
      [this.x+69, this.y+27, 0], [this.x+68, this.y+39, 0], [this.x+38, this.y+38, 0] ]
    }
    get offsetX() {this.x + this.w/2}
    get offsetY() {this.y + this.h/2)
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
    lastCollected: 0,
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
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(heli.x, heli.y, heli.w, heli.h);
  
  ctx.drawImage(heliImg, heli.x, heli.y);

  // Helicopter hitpoints
  for(let i in heli.hitpoints) {
    if (heli.hitpoints[i][2] === 0) {
      if (heliImg.src.includes('img/heliBlueTransparent.png')) ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
      else ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    }
    else ctx.fillStyle = heli.hitpoints[i][2];
    
    ctx.beginPath();
    ctx.arc(heli.hitpoints[i][0], heli.hitpoints[i][1], 2.5, 0, Math.PI*2);
    ctx.fill();
  }
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
    if (!heli.invincible &&
       heli.offsetX + heli.w/2 >= this.x &&
       heli.offsetX - heli.w/2 <= this.x + this.w &&
       heli.offsetY + heli.h/2 >= this.y &&
       heli.offsetY - heli.h/2 <= this.y + this.h) gameOver();
  }
}
