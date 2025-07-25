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
  if (distance.d > best) {
    best = Math.floor(distance.d);
    userData.best = best
    
    // save every 3 seconds
    if (now - lastSave >= 3000) {
      localStorage.setItem('localHeliGameData', JSON.stringify(userData));
      lastSave = Date.now();
    }
  }
}

function checkCollisions() {
  // Collisions with the Walls
  wall1.checkCollisions()
  wall2.checkCollisions()
  wall3.checkCollisions()
  
  for (let i in heli.hitpoints) {
    // Collisions with Top and Bottom Green Bars
    if (heli.hitpoints[i][1] < 50 || heli.hitpoints[i][1] > cnv.height - 50) {
      if (heli.invincible) heli.y -= heli.speed;
      else {
        heli.hitpointDetected = i;
        gameOver();
      }
    }
    
    // Collisions with the powerUp
    const dx = heli.hitpoints[i][0] - powerUp.x;
    const dy = heli.hitpoints[i][1] - powerUp.y;
    const dist = Math.hypot(dx, dy);
    if (dist < powerUp.r + 10) {
      heli.hitpointDetected = i;
      heli.invincible = true;
      powerUp.lastCollected = Date.now();
      invincibility.play();
    };
  }

  // Flicker
  if (now - powerUp.lastCollected < 3000) { // turns heli's color green
    heliImg.src = 'img/heliGreenTransparent.png';
    if (now - powerUp.lastCollected < 2750) heli.flickerTimer = Date.now();
  }
  else if (now - powerUp.lastCollected < 5000) { // heli's color swaps between green and blue
    if (now - heli.flickerTimer >= 250) {
      heli.flickerTimer = Date.now();
      
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
    userData.best = best;
    localStorage.setItem('localHeliGameData', JSON.stringify(userData));
  }
  // Pause propeller sound without causing errors
  if (propellerPromise !== undefined) {
    propellerPromise.then(_ => {
      propeller.pause();
    })
    .catch(error => {
      console.warn(error);
    });
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
  if (mouseIsPressed) heli.speed -= heli.lift
  // Apply Gravity
  else heli.speed += heli.gravity;

  // Constrain Speed (max/min)
  if (heli.speed < heli.max) {
    heli.speed = heli.max;
  } else if (heli.speed > heli.min) {
    heli.speed = heli.min;
  }

  // Move Helicopter by its speed
  heli.y += heli.speed;
}

function drawObjects() {
  // PowerUp
  drawPowerUp(powerUp.x, powerUp.y, powerUp.r);
  if (heli.invincible) {
    powerUp.x = cnv.width + 1250;
    powerUp.y = Math.random() * 300 + 100;
  }

  // Walls
  ctx.fillStyle = "green";
  ctx.fillRect(wall1.x, wall1.y, wall1.w, wall1.h);
  ctx.fillRect(wall2.x, wall2.y, wall2.w, wall2.h);
  ctx.fillRect(wall3.x, wall3.y, wall3.w, wall3.h);

  // Helicopter hitpoints
  if (enableHitPoints) {
    for(let i in heli.hitpoints) {
      if (heli.hitpointDetected === i) ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      else {
        if (heliImg.src.includes('img/heliBlueTransparent.png')) ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        else ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      }
      
      ctx.beginPath();
      ctx.arc(heli.hitpoints[i][0], heli.hitpoints[i][1], 2.5, 0, Math.PI*2);
      ctx.fill();
    }
  }
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
    lift: 0.5,
    gravity: 0.3,
    max: -6,
    min: 5,
    invincible: false,
    hitpointDetected: -1,
    /* hitpoints: [
    [202, 261], [229, 255], [245, 253], [256, 253], [268, 255],
    [279, 262], [269, 277], [268, 289], [239, 288] [227, 275],
    [210, 272],
    ] */
    get hitpoints() {
      return [
        [this.x+2, this.y+11], [this.x+29, this.y+5], [this.x+45, this.y+3], [this.x+56, this.y+3], [this.x+68, this.y+5],
        [this.x+79, this.y+12], [this.x+69, this.y+27], [this.x+68, this.y+39], [this.x+39, this.y+38], [this.x+27, this.y+25],
        [this.x+10, this.y+22]
      ]
    },
    get offsetX() {this.x + this.w/2},
    get offsetY() {this.y + this.h/2},
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
  ctx.drawImage(heliImg, heli.x, heli.y);
  if (state === "start" && enableHitPoints) {
    for(let i in heli.hitpoints) {
      if (heli.hitpointDetected === i) ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      else {
        if (heliImg.src.includes('img/heliBlueTransparent.png')) ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        else ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      }
      ctx.beginPath();
      ctx.arc(heli.hitpoints[i][0], heli.hitpoints[i][1], 2.5, 0, Math.PI*2);
      ctx.fill();
    }
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
    for(let i in heli.hitpoints) {
      if (!heli.invincible &&
         heli.hitpoints[i][0] >= this.x &&
         heli.hitpoints[i][0] <= this.x + this.w &&
         heli.hitpoints[i][1] >= this.y &&
         heli.hitpoints[i][1] <= this.y + this.h) {
        heli.hitpointDetected = i;
        gameOver();
      }
    }
  }
}
