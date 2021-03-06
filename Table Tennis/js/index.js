const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

document.querySelector(".game-board").style.display = "none";
document.querySelector(".intro").style.display = "block";

document.querySelector(".start__button").onclick = () => {
document.querySelector(".intro").style.display = "none";
document.querySelector(".game-board").style.display = "block";

startGame();

}; 

let ball;
let player1;
let player2;
let gameOver = false;
let animationId;
let hitSound; 
let scoreSound;
let player1Score;
let player2Score;
player1Score = document.getElementById("score-box-1");
player2Score = document.getElementById("score-box-2"); 

function startGame() {
  ball = new Ball();
  player1 = new Player(20, 150, "white");
  player2 = new Player(770, 150, "white");
  hitSound = new sound("hitSound.mp3");
  scoreSound = new sound("winning-point.mp3");
  cancelAnimationFrame(animationId);
  gameOver = false;
  updateCanvas();
}

function drawNet(){
  context.fillStyle = "white"; 
  context.fillRect(395, 0, 5, 500);
}

function drawScore(x, y, score){
  context.fillStyle = "white";
  context.font = "35px sans-serif";
  context.fillText(score, x, y);
}


function reset() { 
  ball.x = 395;
  ball.y = 250;
  ball.vx =- ball.vx;
  ball.vy =- ball.vy;
}


function updateCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  drawNet();

  player1.draw();
  player2.draw();
  
  drawScore(200, -1, player1.score);
  drawScore(600, -1, player2.score);
  //console.log(player1.score, player2.score)
  player1Score.innerHTML = player1.score; 
  player2Score.innerHTML = player2.score;

  ball.draw(); 
  ballMovement();

  if (detectPlayer1Collision()) {
    ball.vx *= -1;
    hitSound.play(); //sound hitting player 1
  }

  if (ball.x + ball.radius >= canvas.width){
    scoreSound.play(); //sound scoring 
    player1.score += 1;
    reset();
  }

  if (detectPlayer2Collision()) {
    ball.vx *= -1;
    hitSound.play(); //sound hitting player 2 
  }

  if (ball.x - ball.radius <= 0){ 
    scoreSound.play(); //sound scoring 
    player2.score += 1;
    reset();
  }

  if(player1.score === 6) {
    context.clearRect (180, 50, 80, 80);
    drawScore(200, 83, player1.score);
    gameOver = true;
  }

  if(player2.score === 6) {
    context.clearRect (580, 50, 80, 80);
    drawScore(600, 83, player2.score);
    gameOver = true;
  }

  if (!gameOver){
  animationId = requestAnimationFrame(updateCanvas);
  } else {
    
    cancelAnimationFrame(animationId);
  }
}


function ballMovement() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.vy *= -1;
    //sounds hitting top and bottom
  }
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.vx *= -1;
  }
}

function detectPlayer1Collision() {
  return ball.y + ball.vy > player1.y && 
         ball.x + ball.vx > player1.x &&
         ball.x - ball.radius < player1.x + player1.width &&
         ball.y + ball.vy < player1.y + player1.height
}

function detectPlayer2Collision() {
  return ball.y + ball.vy > player2.y && 
         ball.x + ball.radius > player2.x &&
         ball.x + ball.vx < player2.x + player2.width &&
         ball.y + ball.vy < player2.y + player2.height
}


document.addEventListener("keydown", (keyboardEvent) => {
  switch(keyboardEvent.key) {
    case "q":
      player1.moveUp();
      if (player1.y > 10) {
        player1.y -= 10;
  } 
    break;
    case "a":
      player1.moveDown();
      if (player1.y < 290) {
        player1.y += 10;
  }
    break;

  }
});


document.addEventListener("keydown", (keyboardEvent) => {
  switch(keyboardEvent.key) {
    case "ArrowUp":
      player2.moveUp();
      if (player2.y > 8) {
        player2.y -= 8;
  } 
    break;
    case "ArrowDown":
      player2.moveDown();
      if (player2.y < 290) {
        player2.y += 8;
  }
    break;

  }
});

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}




