"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Car = require('./car.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 210})
var map = new Image();
var cars = [];
var logs = [];
var gameOver = false;
var score = 0;
map.src = './assets/FroggerMap.png';

canvas.onclick = function(event){
  console.log(event.pageX, event.pageY);
}

document.onkeydown = function(event)
{
  switch(event.keyCode)
  {
    case 13:
    event.preventDefault();
    if(gameOver == true){
      init();
    }
    break;
  }
}

function init(){
  player.x = 0;
  player.y = 210;
  gameOver = false;
  score = 0;
  player.lives = 3;
  setTimeout(game.loop(timestamp), 1000/8);
}

function renderCars(level){
  var locationX = 100;
  for(var i = 0; i < level + 8; i++){
    var car = new Car({x:locationX, y: 400}, 1);
    locationX += 80;
    if(locationX > 260){
      locationX = 100;
    }
    cars[i] = car;
  }
}

function renderLogs(level){
  var locationX = 450;
  var lane = 1;
  for(var i = 0; i < level + 20; i++){
    var log = new Log({x:locationX, y: 400}, lane);
    lane ++;
    locationX += 80;
    if(locationX > 610){
      locationX = 450;
    }
    if(lane > 3){
      lane = 1;
    }
    logs[i] = log;
  }
}
renderCars(player.level);
renderLogs(player.level);
checkCarCollision = function(car){
  if((player.x > car.x - 56) && (player.x < car.x + 28) && (player.y > car.y - 60) && (player.y < car.y + 80)){
    player.lives -= 1;
    if(player.lives == 0){
      gameOver = true;
    }
    player.x = 0;
    player.y = 210;
  }
}

checkLogCollision = function(logs){
  var touching = false;
  for(var i = 0; i < logs.length; i++){
  if((player.x > logs[i].x - 56) && (player.x < logs[i].x + 28) && (player.y > logs[i].y - 30) && (player.y < logs[i].y + 60)){
    if(logs[i].up && logs[i].icy == false){
      player.y -= (3 + player.level);
      return true;
    } else if(logs[i].down && logs[i].icy == false) {
      player.y += (3 + player.level);
      return true;
    } else if(logs[i].up){
      player.y -= (4 + player.level);
      return true;
    } else {
      player.y += (4 + player.level);
      return true;
    }
  }
}
  return false;
}
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  if(!gameOver){
    setTimeout(game.loop(timestamp), 1000/8);
  }
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  for(var i = 0; i < cars.length; i++){
     cars[i].update(elapsedTime, player.level);
     cars[i].checkBounds();
     checkCarCollision(cars[i]);
  }
  for(var i = 0; i < logs.length; i++){
     logs[i].update(elapsedTime);
     logs[i].checkBounds();
  }
  if(!checkLogCollision(logs) && player.x > 425 && player.x < 650 && player.state == "idle"){
    player.lives -= 1;
    if(player.lives == 0){
      gameOver = true;
    }
    player.x = 0;
    player.y = 210;
  }
  levelAdvance();
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.drawImage(map, 0, 0);
  for(var i = 0; i < cars.length; i++){
     cars[i].render(elapsedTime, ctx);
  }
  for(var i = 0; i < logs.length; i++){
     logs[i].render(elapsedTime, ctx);
     logs[i].spritesheet.src = encodeURI('assets/log.png');
     logs[i].icy = false;
  }
  checkLogOnLogCollision();
    drawScoreAndLives(ctx);
    player.render(elapsedTime, ctx);

    if(gameOver){
      gameOverScreen = new Image();
      gameOverScreen.src = 'assets/GameOverScreen.png';
      ctx.clearRect(0, 0, 760, 480);
      setTimeout(function(){
        ctx.drawImage(gameOverScreen, 0, 0);
        drawScoreAndLives(ctx);

      }, 500);
    }
}

function drawScoreAndLives(ctx) {
    var text = "Score: " + score;
    ctx.fillStyle = 'black';
    ctx.fillText(text, 10, 20);
    text = "Lives: " + player.lives;
    ctx.fillStyle = 'black';
    ctx.fillText(text, 10, 40);
  }

function levelAdvance(){
  if(player.x >= 650 && player.state == "idle" && ((player.y < 75 && player.y > -10) || (player.y < 220 && player.y > 170) ||  (player.y < 480 && player.y > 430))){
    player.level++;
    score += 100;
    player.x = 0;
    player.y = 210;
  }
  else if (player.x >= 650 && player.state == "idle"){
    player.lives -= 1;
    if(player.lives == 0){
      gameOver = true;
    }
    player.x = 0;
    player.y = 210;
  }
}
function checkLogOnLogCollision(){
  for(var i = 0; i < logs.length; i++){
    for(var j = 0; j < logs.length; j++){
      if((i != j) && (logs[i].y == logs[j].y)){
        logs[i].spritesheet.src = encodeURI('assets/icy-log.png');
        logs[j].spritesheet.src = encodeURI('assets/icy-log.png');
        logs[i].icy = true;
        logs[j].icy = true;
      }
    }
  }
}
