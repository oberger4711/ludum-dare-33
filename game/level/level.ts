/// <reference path="../phaser.d.ts"/>
/// <reference path="player.ts"/>
/// <reference path="mapParser.ts"/>

module Ld33.Level {
	export class Level extends Phaser.State {

		private NUMBER_OF_LEVELS : number = 1;
		private ROAD_WIDTH : number = 300;
		private PLAYER_CAR_Y_OFFSET : number = 100;
		private ROAD_MIN_SCROLL_SPEED = 20;

		private FILTER_COLOR_FROM = 0xffff00;
		private FILTER_COLOR_TO = 0xff0000;

		private mapIndex : number;
		private scaleFactor : number = 1;
		private lanesX : number[];

		private filter : Phaser.Sprite;
		private filterTween : Phaser.Tween;
		private road : Phaser.Sprite;
		private player : Player;
		private enemies : Phaser.Group;
		private lasers : Phaser.Group;
		private mapParser : MapParser;

		private keyLeft : Phaser.Key;
		private keyRight : Phaser.Key;
		private keyBreak : Phaser.Key;
		private keyShoot : Phaser.Key;
		private keyRestart : Phaser.Key;

		constructor() {
			super();
		}

		preload() {
		}

		init(mapIndex : number) {
			this.mapIndex = mapIndex;
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

			this.enemies = this.game.add.group();
			this.lasers = this.game.add.group();

			var map = this.game.cache.getJSON('lvl' + this.mapIndex);
			this.mapParser = new MapParser(this.game, this.enemies, this.lanesX, this.scaleFactor, map);
			this.game.world.setBounds(0, 0, 800, this.mapParser.getMapHeight());

			this.player = new Player(this.game, this.mapParser.getMapHeight() - this.PLAYER_CAR_Y_OFFSET, this.lanesX, this.scaleFactor, this.lasers);
			this.game.add.existing(this.player);
			this.player.OnRageLevelChanged = () => this.onRageLevelChanged();
			this.player.OnDie = () => this.onPlayerDies();

			this.filter = this.game.add.sprite(0, 0, 'filter');
			this.filter.width = this.game.width;
			this.filter.height = this.game.height;
			this.filter.fixedToCamera = true;

			this.filterTween = this.game.add.tween(this.filter).to({ alpha : 0 }, 500, undefined, true, 0, Number.MAX_VALUE);
			this.filterTween.yoyo(true);

			this.keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this.keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
			this.keyBreak = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
			this.keyShoot = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.keyRestart = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		}

		private calcLaneX(index : number) : number {
			return this.game.width / 2 + (index - 2) * 24 * this.scaleFactor;
		}

		update() {
			this.game.physics.arcade.collide(this.player, this.enemies, (c) => this.player.hitCar(c));
			this.game.physics.arcade.collide(this.lasers, this.enemies, (l, e) => this.laserHitsEnemy(l, e));
			this.camera.focusOnXY(this.game.width / 2, this.player.position.y - (this.game.height / 2) + this.PLAYER_CAR_Y_OFFSET);

			this.road.y += this.ROAD_MIN_SCROLL_SPEED;
			while (this.road.y - (this.road.height / 2) > this.camera.view.top) {
				this.road.y -= this.road.height / 2;
			}

			if (this.keyBreak.isDown) {
				this.player.moveBreak();
			}
			else {
				this.player.moveDrive();
			}

			if (this.keyLeft.justDown) {
				this.player.moveLeft();
			}
			else if (this.keyRight.justDown) {
				this.player.moveRight();
			}

			if (this.keyShoot.isDown) {
				this.player.shoot();
			}

			if (this.player.IsDead && this.keyRestart.justDown) {
				this.game.state.start('level', true, false, this.mapIndex);
			}

			this.mapParser.update();

			if (this.player.bottom < 0) {
				this.game.state.start('level', true, false, (this.mapIndex + 1) % this.NUMBER_OF_LEVELS);
			}
		}

		laserHitsEnemy(laser : Phaser.Sprite, enemy : Phaser.Sprite) {
			laser.body.enable = false;
			laser.kill();
			enemy.damage(1);
			if (enemy.health <= 0) {
				this.onEnemyKilled(enemy);
			}
		}

		onEnemyKilled(enemy : Phaser.Sprite) {
			// TODO Explosion
		}

		onPlayerDies() {
			this.enemies.forEach((e) => {
				e.body.moves = false;
			}, this);
		}

		onRageLevelChanged() {
			this.filter.tint = Phaser.Color.interpolateColor(this.FILTER_COLOR_FROM, this.FILTER_COLOR_TO, 4, Math.floor(4 * this.player.RageLevel), 0);
		}

		render() {
			this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
		}

		shutdown() {
		}

	}

}
