/// <reference path="../phaser.d.ts"/>

module Ld33.Level {
	enum PlayerState {
		Driving,
		SwitchingLane,
		Dead
	};
	export class Player extends Phaser.Sprite {

		private LANE_SWITCHING_SPEED : number = 500;
		private ACCELERATION : number = 50;
		private MAX_DRIVING_SPEED : number = 500;
		private lanesX : number[];
		
		private state : PlayerState;
		private lane : number = 2;
		private onDie : () => void;

		constructor(game, yOffset, lanesX : number[], scaleFactor : number) {
			super(game, lanesX[2], yOffset, 'player-car');
			this.lanesX = lanesX;
			this.lane = 2;
			this.anchor.set(0.5, 0.5);

			//this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
			this.state = PlayerState.Driving;
			//this.animations.play('stand');

			this.scale.set(scaleFactor, scaleFactor);
			this.game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.enable = true;
			this.body.velocity.y = 0;
			this.body.acceleration.set(0, -this.ACCELERATION);
			this.body.maxVelocity.set(this.LANE_SWITCHING_SPEED, this.MAX_DRIVING_SPEED);
		}

		moveRight() {
			if (this.state == PlayerState.Driving && this.lane < this.lanesX.length - 1) {
				this.body.velocity.x = this.LANE_SWITCHING_SPEED;
				this.makeStateTransition(PlayerState.SwitchingLane);
			}
		}

		moveLeft() {
			if (this.state == PlayerState.Driving && this.lane > 0) {
				this.body.velocity.x = -this.LANE_SWITCHING_SPEED;
				this.makeStateTransition(PlayerState.SwitchingLane);
			}
		}

		die() {
			if (this.state != PlayerState.Dead) {
				// TODO
			}
		}

		restore() {
			this.makeStateTransition(PlayerState.Driving);
		}

		update() {
			if (this.state == PlayerState.SwitchingLane) {
				if (this.body.velocity.x > 0) {
					if (this.position.x >= this.lanesX[this.lane + 1]) {
						this.finishSwitching(1);
					}
					else if (this.body.blocked.right) {
						// Switch failed. Hit a car.
						// TODO
					}
				}
				else if (this.body.velocity.x < 0) {
					if (this.position.x <= this.lanesX[this.lane - 1]) {
						this.finishSwitching(-1);
					}
					else if (this.body.blocked.left) {
						// Switch failed. Hit a car.
						// TODO
					}
				}
			}
			if (this.state != PlayerState.Dead) {
			}
		}

		private finishSwitching(deltaLane : number) {
			this.body.velocity.x = 0;
			this.body.x = this.lanesX[this.lane + deltaLane] - this.width / 2;
			this.lane += deltaLane;
			this.makeStateTransition(PlayerState.Driving);
		}

		makeStateTransition(value : PlayerState) {
			if (this.state != value) {
				switch (value) {
					case PlayerState.Driving:
						// TODO
						break;
					case PlayerState.SwitchingLane:
						// TODO
						break;
					case PlayerState.Dead:
						// TODO
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
