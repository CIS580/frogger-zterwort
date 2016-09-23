(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./car.js":2,"./game.js":3,"./log.js":4,"./player.js":5}],2:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Car class
 */
module.exports = exports = Car;
/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Car(position, lane) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/car1.png');
  this.timer = 0;
  this.frame = 0;
  this.level = 1;
  this.waiting = false;

  if(lane == 1 || lane == 3){
    this.up = true;
    this.down = false;
  }else{
    this.up = false;
    this.down = true;
  }
}

Car.prototype.checkBounds = function(){
  if(this.y < -100 && this.waiting == false){
    var random = Math.floor(Math.random() * 4 + 1) * 1000;
    var car = this;
    window.setTimeout(function(){
      car.y = 480;
      car.waiting = false;
    }, random);
    car.waiting = true;
  }
}

Car.prototype.update = function(time, level){
  this.timer += time;

  if(this.up == true){
    this.y -= (3 + level);
  } else{
    this.y += (3 + level);
  }

  if(this.timer > MS_PER_FRAME) {
    this.timer = 0;
    this.frame += 1;
    if(this.frame > 3) this.frame = 0;
  }
}

Car.prototype.render = function(time, ctx) {
    ctx.drawImage(
      // image
      this.spritesheet,
      // source rectangle
      0, 0, 112, 265,
      // destination rectangle
      this.x, this.y, 50, 100
    );
  }

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Car class
 */
module.exports = exports = Log;
/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Log(position, lane) {
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/log.png');
  this.timer = 0;
  this.frame = 0;
  this.level = 1;
  this.waiting = false;
  this.ciy = false;

  if(lane == 1 || lane == 3){
    this.up = true;
    this.down = false;
  } else {
    this.up = false;
    this.down = true;
  }
}

Log.prototype.checkBounds = function(){
  if((this.y < -100 || this.y > 800) && this.waiting == false){
    var random = Math.floor(Math.random() * 8 + 1) * 1000;
    var log = this;
    if(this.up){
    window.setTimeout(function(){
      log.y = 480;
      log.waiting = false;
    }, random);
  }
  else {
    window.setTimeout(function(){
      log.y = -99;
      log.waiting = false;
    }, random);
  }
    log.waiting = true;
  }
}

Log.prototype.update = function(time){
  this.timer += time;

  if(this.up == true){
    this.y -= (3 + this.level);
  } else {
    this.y += (3 + this.level);
  }

  if(this.timer > MS_PER_FRAME) {
    this.timer = 0;
    this.frame += 1;
    if(this.frame > 3) this.frame = 0;
  }
}

Log.prototype.render = function(time, ctx) {
    ctx.drawImage(
      // image
      this.spritesheet,
      // source rectangle
      0, 0, 112, 265,
      // destination rectangle
      this.x, this.y, 50, 100
    );
  }

},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;
var self = this;
/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;
  this.level = 1;
  this.lives = 3;

  this.right = false;
  this.left = false;
  this.up = false;
  this.down = false;

  self = this;
}

window.onkeydown = function(event){
  if(!(self.right || self.down || self.up || self.left)){
    switch(event.keyCode){
      case 68:
        self.state = "hopping"
        self.frame = 0;
        self.right = true;
        break;
      case 65:
        self.state = "hopping"
        self.frame = 0;
        self.left = true;
        break;
      case 87:
        self.state = "hopping"
        self.frame = 0;
        self.up = true;
        break;
      case 83:
        self.state = "hopping"
        self.frame = 0;
        self.down = true;
        break;
    }
  }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    case "hopping":

      this.timer += time;

      if(this.timer > MS_PER_FRAME) {
        if(self.right){
          self.x += 22;
        } else if(self.left){
          self.x -= 22;
        } else if(self.down){
          self.y += 25;
        } else if(self.up){
          self.y -= 25;
        }
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3){
          this.frame = 0;
          self.right = false;
          self.left = false;
          self.up = false;
          self.down = false;
          self.state = "idle";
        }
      }
      this.timer += time;
      break;
    // TODO: Implement your player's update by state
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "hopping":
      ctx.drawImage(
        this.spritesheet,
        this.frame * 64, 0, this.width, this.height,
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
  }
}

},{}]},{},[1]);
