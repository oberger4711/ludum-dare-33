/// <reference path="../phaser.d.ts"/>

module Ld33.Preload {
	export class Preload extends Phaser.State {
		
		constructor() {
			super();
		}

		preload() {
			// Images
			this.game.load.image('player-car', 'assets/player-car.png');
			this.game.load.image('car1', 'assets/car1.png');
			this.game.load.image('car2', 'assets/car2.png');
			this.game.load.image('car3', 'assets/car3.png');
			this.game.load.image('car4', 'assets/car4.png');

			this.game.load.image('filter', 'assets/filter.png');
			this.game.load.image('road', 'assets/road.png');
			this.game.load.image('laser', 'assets/laser.png');
			this.game.load.image('smoke', 'assets/smoke.png');

			// Spritesheets
			this.game.load.spritesheet('explosion', 'assets/explosion.png', 64, 64);
			this.game.load.spritesheet('player-face', 'assets/player-face.png', 32, 32);

			// Maps
			this.game.load.json('lvl0', 'assets/0.json');

			// Sound
			//this.game.load.audio('music', 'assets/music.mp3');
		}

		create() {
			this.game.state.start("level", true, false, 0);
		}

	}

}
