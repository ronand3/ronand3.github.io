const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "assets/cat.png";

let gameState = "start";


let volume = 50;


let imgX = 135;
let imgY = 255;
let imgSpeed = 6;


let bubbleX = [];
let bubbleY = [];
let bubbleSize = [];
let bubbleSpeed = [];
let bubbleType = [];

const totalBubbles = 30;


let keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === " " && gameState === "gameOver") {
    restartGame();
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

canvas.addEventListener("click", () => {
  if (gameState === "start") {
    restartGame();
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
  } else if (gameState === "gameOver") {
    drawGameOver();
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

  imgX = Math.max(-20, Math.min(canvas.width - 130, imgX));

 
  if (img.complete && img.naturalWidth !== 0) {
    ctx.drawImage(img, imgX, imgY, 150, 150);
  } else {
    ctx.fillStyle = "orange";
    ctx.fillRect(imgX, imgY, 150, 150);
  }

  for (let i = 0; i < bubbleX.length; i++) {
    bubbleY[i] += bubbleSpeed[i];

    ctx.beginPath();
    ctx.arc(bubbleX[i], bubbleY[i], bubbleSize[i], 0, Math.PI * 2);
    ctx.fillStyle = bubbleType[i] === "bomb" ? "red" : "blue";
    ctx.fill();

    const dx = bubbleX[i] - (imgX + 75);
    const dy = bubbleY[i] - (imgY + 75);
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < bubbleSize[i] + 50) {
      if (bubbleType[i] === "bomb") {
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
}
function drawUI() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("                  Volume: " + volume + "%", 15, 30);


  ctx.fillStyle = "gray";
  ctx.fillRect(20, 40, 200, 20);


  ctx.fillStyle = "green";
  ctx.fillRect(20, 40, volume * 2, 20);
}


function spawnBubble(i) {
  bubbleX[i] = Math.random() * canvas.width;
  bubbleY[i] = Math.random() * -300;
  bubbleSize[i] = Math.random() * 10 + 15;
  bubbleSpeed[i] = Math.random() * 2 + 2;
  bubbleType[i] = Math.random() < 0.2 ? "bomb" : "normal";
}


function drawGameOver() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", 400, 180);

  ctx.font = "20px Arial";
  ctx.fillText("Press SPACE to restart", 400, 230);
}

function restartGame() {
  volume = 50;

  bubbleX = [];
  bubbleY = [];
  bubbleSize = [];
  bubbleSpeed = [];
  bubbleType = [];

  initBubbles();

  gameState = "playing";
}