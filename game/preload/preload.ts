/// <reference path="../phaser.d.ts"/>

module Ld33.Preload {
	export class Preload extends Phaser.State {
		
		constructor() {
			super();
		}

		preload() {
			var text = this.game.add.text(this.game.width / 2, this.game.height / 2, "Loading...", { fill : '#ffffff' });
			text.anchor.set(0.5, 0.5);
			// Images
			this.game.load.image('speedbar', 'assets/speedbar.png');
			this.game.load.image('ragebar', 'assets/ragebar.png');
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
			this.game.load.json('lvl1', 'assets/1.json');
			this.game.load.json('lvl2', 'assets/2.json');
			this.game.load.json('lvl3', 'assets/3.json');
			this.game.load.json('lvl4', 'assets/4.json');

			// Sound
			this.game.load.audio('music', 'assets/music.mp3');
			this.game.load.audio('laser-snd', 'assets/laser.mp3');
			this.game.load.audio('explosion-snd', 'assets/explosion.mp3');
			this.game.load.audio('hit-player-snd', 'assets/hit-player.mp3');
			this.game.load.audio('hit-laser-snd', 'assets/hit-laser.mp3');
		}

		create() {
			var music = this.game.add.sound('music', undefined, Number.MAX_VALUE);
			music.play();
			this.game.state.start("intro", true, false);
		}

	}

}
