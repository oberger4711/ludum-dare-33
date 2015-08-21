/// <reference path="phaser.d.ts"/>
class MyGame {

	private game : Phaser.Game;

	constructor() {
		this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {preload: this.preload, create: this.create, update : this.update});
	}


	preload() {
		// this.game.load.image('ball', 'assets/ball.png');
	}

	create() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
	}

	update() {
		// this.game.physics.arcade.collide(this.paddleGroup, this.ballGroup);
	}

}

window.onload = () => {
	var game = new MyGame();
};
