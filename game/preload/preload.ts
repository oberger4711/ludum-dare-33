/// <reference path="../phaser.d.ts"/>

module Ld33.Preload {
	export class Preload extends Phaser.State {
		
		constructor() {
			super();
		}

		preload() {
			//this.game.load.image('background', 'assets/background.png');
			//this.game.load.audio('music', 'assets/music.mp3');
		}

		create() {
			this.game.state.start("level", true, false, 0);
		}

	}

}
