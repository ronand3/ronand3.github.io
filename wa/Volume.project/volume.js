const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "start";
let volume = 50;


let imgX = 362;
let imgY = 275;
let imgSpeed = 6;
let playerSize = 75;

let bubbleX = [];
let bubbleY = [];
let bubbleSize = [];
let bubbleSpeed = [];
let bubbleType = [];

const totalBubbles = 10;

let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

canvas.addEventListener("click", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  // start button
  if (
    gameState === "start" &&
    mouseX >= 300 &&
    mouseX <= 500 &&
    mouseY >= 200 &&
    mouseY <= 260
  ) {
    restartGame();
  }

 if (gameState === "playing") {
    if (mouseX >= 650 && mouseX <= 780 && mouseY >= 20 && mouseY <= 65) {
      gameState = "confirmed";
    }
  }
  
  if (gameState === "confirmed") {
    if (mouseX >= 325 && mouseX <= 475 && mouseY >= 310 && mouseY <= 365) {
      resetToStart();
    }
  }
});

function initBubbles() {
  for (let i = 0; i < totalBubbles; i++) {
    spawnBubble(i);
  }
}

function loop() {
  requestAnimationFrame(loop);

  drawBackground();

  if (gameState === "start") {
    drawStart();
  } else if (gameState === "playing") {
    updateGame();
  } else if (gameState === "confirmed") {
    drawConfirmedScreen();
  }
}

loop();

function drawBackground() {
  ctx.fillStyle = "#d0ecff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStart() {
  ctx.fillStyle = "black";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Volume Selector", 400, 140);

  ctx.fillStyle = "green";
  ctx.fillRect(300, 200, 200, 60);

  ctx.fillStyle = "white";
  ctx.font = "28px Arial";
  ctx.fillText("START", 400, 240);

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(200, 280, 400, 60);

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Blue bubbles = +1% volume", 400, 305);
  ctx.fillText("Red bubbles = -1% volume", 400, 330);
}

function updateGame() {
  if (keys["ArrowLeft"]) imgX -= imgSpeed;
  if (keys["ArrowRight"]) imgX += imgSpeed;

  imgX = Math.max(0, Math.min(canvas.width - playerSize, imgX));

  // BLACK PLAYER BOX + WHITE OUTLINE
  ctx.fillStyle = "black";
  ctx.fillRect(imgX, imgY, playerSize, playerSize);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(imgX, imgY, playerSize, playerSize);

  for (let i = 0; i < bubbleX.length; i++) {
    bubbleY[i] += bubbleSpeed[i];

    ctx.beginPath();
    ctx.arc(bubbleX[i], bubbleY[i], bubbleSize[i], 0, Math.PI * 2);
    ctx.fillStyle = bubbleType[i] === "red" ? "red" : "blue";
    ctx.fill();

    const dx = bubbleX[i] - (imgX + playerSize / 2);
    const dy = bubbleY[i] - (imgY + playerSize / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < bubbleSize[i] + 30) {
      if (bubbleType[i] === "red") {
        volume -= 1;
      } else {
        volume += 1;
      }
      
      volume = Math.max(0, Math.min(100, volume));
      spawnBubble(i);
    }
    
    if (bubbleY[i] > canvas.height) {
      spawnBubble(i);
    }
  }

  drawUI();
  drawConfirmButton();
}

function drawUI() {
  ctx.textAlign = "left";
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Volume: " + volume + "%", 20, 30);

  ctx.fillStyle = "gray";
  ctx.fillRect(20, 40, 200, 20);

  ctx.fillStyle = "green";
  ctx.fillRect(20, 40, volume * 2, 20);
}

function drawConfirmButton() {
  ctx.fillStyle = "green";
  ctx.fillRect(650, 20, 130, 45);

  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Confirm", 715, 50);
}

function drawConfirmedScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(220, 170, 360, 220);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeRect(220, 170, 360, 220);

  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Volume Confirmed", 400, 225);

  ctx.font = "24px Arial";
  ctx.fillText("Your volume level is " + volume + "%", 400, 270);

  ctx.fillStyle = "red";
  ctx.fillRect(325, 310, 150, 55);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Reset", 400, 345);
}

function spawnBubble(i) {
  bubbleX[i] = Math.random() * canvas.width;
  bubbleY[i] = Math.random() * -400;
  bubbleSize[i] = Math.random() * 10 + 15;
  bubbleSpeed[i] = Math.random() * 1.5 + 1.5;


  bubbleType[i] = Math.random() < 0.5 ? "blue" : "red";
}

function restartGame() {
  volume = 50;
  imgX = 362;
  imgY = 275;

  bubbleX = [];
  bubbleY = [];
  bubbleSize = [];
  bubbleSpeed = [];
  bubbleType = [];

  initBubbles();

  gameState = "playing";
}

function resetToStart() {
  volume = 50;
  imgX = 362;
  imgY = 275;

  bubbleX = [];
  bubbleY = [];
  bubbleSize = [];
  bubbleSpeed = [];
  bubbleType = [];

  gameState = "start";
}