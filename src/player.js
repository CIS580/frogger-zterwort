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
