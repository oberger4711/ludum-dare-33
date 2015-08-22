/// <reference path="../phaser.d.ts"/>
/// <reference path="player.ts"/>

module Ld33.Level {
	export class Level extends Phaser.State {

		private SPRITE_WIDTH : number = 16;

		private mapIndex : number;
		private scaleFactor : number = 1;

		private road : Phaser.Sprite;
		private player : Player;

		constructor() {
			super();
		}

		init(mapIndex : number) {
			this.mapIndex = mapIndex;
		}

		preload() {
			//this.game.load.tilemap(this.mapIndex.toString(), '../assets/' + this.mapIndex.toString() + '.json', null, Phaser.Tilemap.TILED_JSON);
		}

		create() {
			this.game.time.advancedTiming = true; // DEBUG
			this.camera.roundPx = false;

			this.player = new Player(this.game, this.game.width / 2, this.game.height - 2 * this.SPRITE_WIDTH * this.scaleFactor);
			this.game.add.existing(this.player);
		}

		update() {
		}

		render() {
			this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
		}

		shutdown() {
		}

	}

}
