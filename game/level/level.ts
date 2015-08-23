/// <reference path="../phaser.d.ts"/>
/// <reference path="player.ts"/>
/// <reference path="mapParser.ts"/>

module Ld33.Level {
	export class Level extends Phaser.State {

		private EXPLOSION_EXTRA_SCALE : number = 2;
		private FACE_EXTRA_SCALE : number = 2;
		private NUMBER_OF_LEVELS : number = 1;
		private ROAD_WIDTH : number = 300;
		private PLAYER_CAR_Y_OFFSET : number = 100;
		private ROAD_MIN_SCROLL_SPEED = 20;

		private FILTER_COLOR_FROM = 0xffff00;
		private FILTER_COLOR_TO = 0xff0000;

		private mapIndex : number;
		private scaleFactor : number = 1;
		private lanesX : number[];

		private random : Phaser.RandomDataGenerator;
		private rageTint : number;
		private face : Phaser.Sprite;
		private filter : Phaser.Sprite;
		private filterTween : Phaser.Tween;
		private road : Phaser.Sprite;
		private player : Player;
		private enemies : Phaser.Group;
		private lasers : Phaser.Group;
		private mapParser : MapParser;
		private cameraShakeOffset : Phaser.Point;

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
			this.cameraShakeOffset = new Phaser.Point(0, 0);

			this.random = new Phaser.RandomDataGenerator([1, 2, 3, 79]);
			
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
			this.player.OnKnockBack = () => this.shakeScreen();
			this.player.OnRageLevelChanged = () => this.updateRage();
			this.player.OnDie = () => this.onPlayerDies();

			this.face = this.game.add.sprite(this.game.width, this.game.height, 'player-face');
			this.face.fixedToCamera = true;
			this.face.anchor.set(1, 1);
			this.face.scale.set(this.FACE_EXTRA_SCALE + this.scaleFactor, this.FACE_EXTRA_SCALE + this.scaleFactor);
			this.face.frame = 0;

			this.filter = this.game.add.sprite(0, 0, 'filter');
			this.filter.alpha = 0.5;
			this.filter.width = this.game.width;
			this.filter.height = this.game.height;
			this.filter.fixedToCamera = true;

			this.filterTween = undefined;

			this.updateRage();

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
			this.camera.focusOnXY(this.game.width / 2 + this.cameraShakeOffset.x, this.player.position.y - (this.game.height / 2) + this.PLAYER_CAR_Y_OFFSET + this.cameraShakeOffset.y);

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
			this.explode(enemy.position);
		}

		onPlayerDies() {
			this.enemies.forEach((e) => {
				e.body.moves = false;
			}, this);
			this.explode(this.player.position);
			this.player.kill();
		}

		shakeScreen() {
			var rumbleOffset = 10;
			var properties = { x: rumbleOffset };
			var duration = 50;
			var repeat = 4;
			var ease = Phaser.Easing.Bounce.InOut;
			var autoStart = false;
			var delay = 0;
			var yoyo = true;
			var quake : Phaser.Tween = this.game.add.tween(this.cameraShakeOffset).to(properties, duration, ease, autoStart, delay, 4, yoyo);
			quake.start();
		}

		explode(position : Phaser.Point) {
			var expl : Phaser.Sprite = this.game.add.sprite(position.x, position.y, 'explosion');
			expl.scale.set(this.EXPLOSION_EXTRA_SCALE + this.scaleFactor, this.EXPLOSION_EXTRA_SCALE + this.scaleFactor);
			expl.anchor.set(0.5, 0.5);
			expl.tint = this.rageTint;
			expl.rotation = this.random.between(0, 360);
			expl.animations.add('explode', [0, 1, 2], 6);
			expl.animations.play('explode', undefined, undefined, true);
		}

		updateRage() {
			var levelOfFour = Math.floor(4 * this.player.RageLevel);
			var rageTint = Phaser.Color.interpolateColor(this.FILTER_COLOR_FROM, this.FILTER_COLOR_TO, 4, levelOfFour, 0);
			if (this.rageTint != rageTint) {
				console.log(levelOfFour);
				this.rageTint = rageTint;
				this.player.Tint = this.rageTint;
				this.enemies.forEach((e) => {
					e.tint = this.rageTint;
				}, this);
				this.lasers.forEach((l) => {
					l.tint = this.rageTint;
				}, this);
				this.road.tint = this.rageTint;
				this.mapParser.RageTint = this.rageTint;
				this.face.tint = this.rageTint;
				this.filter.tint = this.rageTint;
			}

			this.face.frame = levelOfFour;
			if (this.player.RageLevel >= 0.6 && this.filterTween == undefined) {
				this.filter.alpha = 1;
				this.filterTween = this.game.add.tween(this.filter).to({ alpha : 0 }, 250, undefined, true, 0, Number.MAX_VALUE);
				this.filterTween.yoyo(true);
			}
		}

		render() {
			this.game.debug.text(this.game.time.fps.toString(), 2, 14, "#00ff00");
		}

		shutdown() {
		}

	}

}
