function Game() {
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "white";
    this.keys = new KeyListener();

    this.p1 = new Paddle(5, 0);
    this.p1.y = this.height/2 - this.p1.height/2;
    this.display1 = new Display(this.width/4, 25);
    this.p2 = new Paddle(this.width - 10, 0);
    this.p2.y = this.height/2 - this.p2.height/2;
    this.display2 = new Display(this.width*3/4, 25)

    this.ball = new Ball();
    this.ball.x = this.width/2;
    this.ball.y = this.height/2;
    this.ball.speed_x = Math.floor(Math.random() * 12 - 6);
    this.ball.speed_y = 7 - Math.abs(this.ball.speed_y);
}

Game.prototype.draw = function() {
	this.context.clearRect(0, 0, this.width, this.height);
	this.context.fillRect(this.width/2, 0, 3, this.height);

	this.p1.draw(this.context);
	this.p2.draw(this.context);

	this.ball.draw(this.context);

	this.display1.draw(this.context);
	this.display2.draw(this.context);
};

Game.prototype.update = function() {
	this.ball.update();
	this.display1.value = this.p1.score;
	this.display2.value = this.p2.score;


	if (this.keys.isPressed(83)) {
		this.p1.y = Math.min(this.height - this.p1.height, this.p1.y + 10);
	} else if (this.keys.isPressed(87)) {
		this.p1.y = Math.max(0, this.p1.y - 10);
	}

	if (this.keys.isPressed(40)) {
		this.p2.y = Math.min(this.height - this.p2.height, this.p2.y + 10);
	} else if (this.keys.isPressed(38)) {
		this.p2.y = Math.max(0, this.p2.y - 10);
	}

	if (this.ball.speed_x > 0) {
		if (this.p2.x <= this.ball.x + this.ball.width && 
				this.p2.x > this.ball.x - this.ball.speed_x + this.ball.width) {
			var collisionDiff = this.ball.x + this.ball.width - this.p2.x;
			var k = collisionDiff/this.ball.speed_x;
			var y = this.ball.speed_y*k + (this.ball.y - this.ball.speed_y);
			if (y >= this.p2.y && y + this.ball.height <= this.p2.y + this.p2.height) {
				this.ball.x = this.p2.x - this.ball.width;
				this.ball.y = Math.floor(this.ball.y - this.ball.speed_y + this.ball.speed_y*k);
				this.ball.speed_x = -this.ball.speed_x;
			}
		}
	} else {
		if (this.p1.x + this.p1.width >= this.ball.x) {
			var collisionDiff = this.p1.x + this.p1.width - this.ball.x;
			var k = collisionDiff/-this.ball.speed_x;
			var y = this.ball.speed_y * k + (this.ball.y - this.ball.speed_y);
			if (y >= this.p1.y && y + this.ball.height <= this.p1.y + this.p1.height) {
				this.ball.x = this.p1.x + this.p1.width;
				this.ball.y = Math.floor(this.ball.y - this.ball.speed_y + this.ball.speed_y*k);
				this.ball.speed_x = -this.ball.speed_x;
			}
		}
	}

	if ((this.ball.speed_y < 0 && this.ball.y < 0) ||
			(this.ball.speed_y > 0 && this.ball.y + this.ball.height > this.height)) {
				this.ball.speed_y = -this.ball.speed_y;
			}

    if (this.ball.x >= this.width)
        this.score(this.p1);
    else if (this.ball.x + this.ball.width <= 0)
        this.score(this.p2);

};

Game.prototype.score = function(p) {
	p.score++;
	var player = p == this.p1 ? 0 : 1;

	this.ball.x = this.width/2;
	this.ball.y = p.y + p.height/2;

	this.ball.speed_y = Math.floor(Math.random()*12);
	this.ball.speed_x = 7 - Math.abs(this.ball.speed_y);
	if (player == 1)
		this.ball.speed_x *= -1;
};

function Display(x, y) {
	this.x = x;
	this.y = y;
	this.value = 0;
}

Display.prototype.draw = function(p) {
	p.fillText(this.value, this.x, this.y);
};

function Paddle(x, y) {
	this.x = x;
	this.y = y;
	this.width = 5;
	this.height = 50;
	this.score = 0;
}

Paddle.prototype.draw = function(p) {
	p.fillRect(this.x, this.y, this.width, this.height);
};

function KeyListener() {
	this.pressedKeys = [];

	this.keydown = function(e) {
		this.pressedKeys[e.keyCode] = true;
	};

	this.keyup = function(e) {
		this.pressedKeys[e.keyCode] = false;
	};

	document.addEventListener("keydown", this.keydown.bind(this));
	document.addEventListener("keyup", this.keyup.bind(this));
}

KeyListener.prototype.isPressed = function(key) {
	return this.pressedKeys[key] ? true : false;
};

KeyListener.prototype.addKeyPressListener = function(keyCode, callback) {
	document.addEventListener("keypress", function(e) {
		if (e.keyCode == keyCode)
			callback(e);
	});
};

function Ball() {
	this.x = 0;
	this.y = 0;
	this.speed_x = 0;
	this.speed_y = 0;
	this.width = 4;
	this.height = 4;
}

Ball.prototype.update = function() {
	this.x += this.speed_x;
	this.y += this.speed_y;
};

Ball.prototype.draw = function(p) {
	p.fillRect(this.x, this.y, this.width, this.height);
};

var game = new Game();

function MainLoop() {
	game.update();
	game.draw();
	setTimeout(MainLoop, 33.3333);
}

MainLoop();