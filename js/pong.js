var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 800;
var height = 400;
canvas.height = height;
canvas.width = width;
var context = canvas.getContext('2d');

window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
};

var step = function() {
  update();
  render();
  animate(step);
};

var update = function() {
  player_one.update();
  player_two.update();
  ball.update(player_one.paddle, player_two.paddle);
};

var player_one = new PlayerOne(); 
var player_two = new PlayerTwo();
var ball = new Ball(400, 200);

var render = function() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);
  player_one.render();
  player_two.render();
  ball.render();
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#FFF";
  context.fillRect(this.x, this.y, this.width, this.height);
};


Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if (this.y < 0) {
    this.y = 0;
    this.y_speed = 0;
  } else if (this.y + this.height > 400) {
    this.y = 400 - this.height;
    this.y_speed = 0;
  }
}


function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 8;
  this.y_speed = 7;
  this.radius = 2.5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2*Math.PI, false);
  context.fillStyle = "#FFF";
  context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if(this.y - 5 < 0) {
    this.y = 5;
    this.y_speed = -this.y_speed;
  } else if (this.y + 5 > 400) {
    this.y = 395;
    this.y_speed = -this.y_speed;
  }


  if(this.x < 0 || this.x > 800) {
    this.x_speed = -5;
    this.y_speed = 0;
    this.x = 400;
    this.y = 200;
  }

  if (this.x < 400) {
    if (bottom_y < paddle1.y && top_y > (paddle1.y + paddle1.height) && bottom_x < (paddle1.x + paddle1.weight) && top_x > (paddle1.x + paddle1.weight) ) {
      this.x_speed = 6;
      this.y_speed += (paddle1.y_speed / 2);
      this.x += this.x_speed;
    }
  } else {
    if (top_y < paddle2.y && bottom_y > (paddle2.y + paddle2.height) && top_x < paddle2.x && bottom_x > paddle2.x) {
      this.x_speed = -6;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  }

 };

function PlayerOne() {
  this.paddle = new Paddle(10, 180, 7, 60);
}

PlayerOne.prototype.render = function() {
  this.paddle.render();
}

PlayerOne.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 87) {
      this.paddle.move(0, -5);
    } else if (value == 83) {
      this.paddle.move(0, 5);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

function PlayerTwo() {
  this.paddle = new Paddle(783, 180, 7, 60);
}

PlayerTwo.prototype.render = function() {
  this.paddle.render();
}

PlayerTwo.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) {
      this.paddle.move(0, -5);
    } else if (value == 40) {
      this.paddle.move(0, 5);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});