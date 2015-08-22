/// <reference path="../phaser.d.ts"/>
/// <reference path="player.ts"/>

module Ld33.Level {
	export class Level extends Phaser.State {

		private ROAD_WIDTH : number = 300;
		private PLAYER_CAR_Y_OFFSET : number = 100;
		private ROAD_MIN_SCROLL_SPEED = 20;

		private mapIndex : number;
		private scaleFactor : number = 1;
		private lanesX : number[];

		private road : Phaser.Sprite;
		private player : Player;

		private keyLeft : Phaser.Key;
		private keyRight : Phaser.Key;

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
			
			this.road = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'road');
			this.scaleFactor = this.ROAD_WIDTH / this.road.width;
			this.road.anchor.set(0.5, 0.5);
			this.road.scale.set(this.scaleFactor, this.scaleFactor);
			this.road.height = this.game.height * 2;

			this.lanesX = [ this.calcLaneX(0), this.calcLaneX(1), this.calcLaneX(2), this.calcLaneX(3), this.calcLaneX(4) ];

			this.player = new Player(this.game, this.game.height - this.PLAYER_CAR_Y_OFFSET, this.lanesX);
			this.player.scale.set(this.scaleFactor, this.scaleFactor);
			this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
			this.player.body.enable = true;
			this.game.add.existing(this.player);

			this.keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this.keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		}

		calcLaneX(index : number) : number {
			return this.game.width / 2 + (index - 2) * 24 * this.scaleFactor;
		}

		update() {
			this.road.y += this.ROAD_MIN_SCROLL_SPEED;
			while (this.road.y - (this.road.height / 2) > this.camera.view.top) {
				this.road.y -= this.road.height / 2;
			}

			if (this.keyLeft.justDown) {
				this.player.moveLeft();
			}
			else if (this.keyRight.justDown) {
				this.player.moveRight();
			}
		}

		render() {
			this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
		}

		shutdown() {
		}

	}

}
