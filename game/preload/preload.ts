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
			this.game.load.image('road', 'assets/road.png');

			// Maps
			this.game.load.json('lvl0', 'assets/0.json');
			//this.game.load.audio('music', 'assets/music.mp3');
		}

		create() {
			this.game.state.start("level", true, false, 0);
		}

	}

}
