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
