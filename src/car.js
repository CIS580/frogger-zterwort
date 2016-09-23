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
