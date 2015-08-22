/// <reference path="../phaser.d.ts"/>

module Ld33.Level {
	enum PlayerState {
		Driving,
		SwitchingLane,
		Dead
	};
	export class Player extends Phaser.Sprite {

		private LANE_SWITCHING_SPEED : number = 250;
		private MIN_DRIVING_SPEED : number = 100;
		private lanesX : number[];
		
		private state : PlayerState;
		private lane : number = 2;
		private onDie : () => void;

		constructor(game, yOffset, lanesX : number[]) {
			super(game, lanesX[2], yOffset, 'player-car');
			this.lanesX = lanesX;
			this.lane = 2;
			this.anchor.set(0.5, 0.5);

			//this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
			this.state = PlayerState.Driving;
			//this.animations.play('stand');
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
			if (this.state == PlayerState.Dead) {
				this.makeStateTransition(PlayerState.Driving);
			}
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
			this.position.x = this.lanesX[this.lane + deltaLane];
			this.body.velocity.x = 0;
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
