/// <reference path="../phaser.d.ts"/>

module Warmup.Level {
	enum PlayerState {
		Standing,
		Running,
		Jumping,
		Dead
	};
	export class Player extends Phaser.Sprite {

		private runSpeed : number = 300;
		private jumpSpeed : number = -610;
		private SOUND_VOL : number = 0.3;
		
		private state : PlayerState;
		private onDie : () => void;

		private sndJump : Phaser.Sound;
		private sndLand : Phaser.Sound;
		private sndDie : Phaser.Sound;

		constructor(game, x, y) {
			super(game, x, y, 'player');
			this.anchor.set(0.5, 0.5);

			this.sndJump = this.game.add.audio('pjump', this.SOUND_VOL);
			this.sndLand = this.game.add.audio('pland', this.SOUND_VOL);
			this.sndDie = this.game.add.audio('pdie', this.SOUND_VOL);

			this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
			this.animations.add('stand', [9, 10], 2, true);
			this.animations.add('jump', [11, 12, 13], 3, false);
			this.animations.add('die', [14, 15, 16, 17, 18], 4, false);
			this.state = PlayerState.Standing;
			this.animations.play('stand');
		}

		moveRight() {
			this.moveX(1);
		}

		moveLeft() {
			this.moveX(-1);
		}

		moveX(dirFactor : number) {
			if (this.state != PlayerState.Dead) {
				this.body.velocity.x = dirFactor * this.runSpeed;
				if (this.scale.x * dirFactor < 0) {
					this.scale.x *= -1;
				}
				if (this.body.onFloor()) {
					if (this.state == PlayerState.Jumping) {
						this.sndLand.play();
					}
					this.switchStateIfNotAlready(PlayerState.Running);
				}
			}
		}

		stopMoving() {
			if (this.state != PlayerState.Dead) {
				this.body.velocity.x = 0;
				if (this.body.onFloor()) {
					if (this.state == PlayerState.Jumping) {
						this.sndLand.play();
					}
					this.switchStateIfNotAlready(PlayerState.Standing);
				}
			}
		}

		jump() {
			if (this.state != PlayerState.Dead) {
				if (this.body.onFloor()) {
					this.body.velocity.y = this.jumpSpeed;
					this.switchStateIfNotAlready(PlayerState.Jumping);
					this.sndJump.play();
				}
			}
		}

		die() {
			if (this.state != PlayerState.Dead) {
				this.body.velocity.x = 0;
				this.switchStateIfNotAlready(PlayerState.Dead);
				this.sndDie.play();
			}
		}

		restore() {
			if (this.state == PlayerState.Dead) {
				this.switchStateIfNotAlready(PlayerState.Standing);
			}
		}

		update() {
			if (this.state != PlayerState.Dead && !this.body.onFloor()) {
				this.switchStateIfNotAlready(PlayerState.Jumping);
			}
		}

		switchStateIfNotAlready(value : PlayerState) {
			if (this.state != value) {
				switch (value) {
					case PlayerState.Standing:
						this.animations.play('stand');
						break;
					case PlayerState.Jumping:
						this.animations.play('jump');
						break;
					case PlayerState.Running:
						this.animations.play('run');
						break;
					case PlayerState.Dead:
						this.animations.play('die');
						break;
				}
				this.state = value;
			}
		}

		get OnDie() : () => void {
			return this.onDie;
		}

		set OnDie(value : () => void) {
			this.onDie = value;
		}

		get IsDead() : boolean {
			return this.state == PlayerState.Dead;
		}

	}
}
