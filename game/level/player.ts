/// <reference path="../phaser.d.ts"/>

module Ld33.Level {
	enum PlayerState {
		Driving,
		Breaking,
		SwitchingLaneLeft,
		SwitchingLaneRight,
		CancelSwitchingLaneLeft,
		CancelSwitchingLaneRight,
		Dead
	};
	export class Player extends Phaser.Sprite {

		private LANE_SWITCHING_SPEED : number = 500;
		private CANCEL_LANE_SWITCHING_SPEED : number = 250;
		private ACCELERATION_DRIVE : number = 50;
		private ACCELERATION_BREAK : number = 400;
		private MAX_DRIVING_SPEED : number = 500;
		private KNOCKBACK_SPEED : number = 50;
		private CRASH_RAGE_ADD : number = 0.4;
		private BREAK_RAGE_ADD_PER_S : number = 0.07;

		private lanesX : number[];
		
		private state : PlayerState;
		private lane : number = 2;
		private rageLevel : number = 0;
		private onDie : () => void;
		private onKnockBack : () => void;

		constructor(game, yOffset, lanesX : number[], scaleFactor : number) {
			super(game, lanesX[2], yOffset, 'player-car');
			this.lanesX = lanesX;
			this.lane = 2;
			this.anchor.set(0.5, 0.5);

			//this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
			this.rageLevel = 0;
			this.state = PlayerState.Driving;
			//this.animations.play('stand');

			this.scale.set(scaleFactor, scaleFactor);
			this.game.physics.enable(this, Phaser.Physics.ARCADE);
			this.body.enable = true;
			this.body.velocity.y = 0;
			this.body.acceleration.set(0, -this.ACCELERATION_DRIVE);
			this.body.maxVelocity.set(this.LANE_SWITCHING_SPEED, this.MAX_DRIVING_SPEED);
		}

		moveRight() {
			if (this.state == PlayerState.Driving && this.lane < this.lanesX.length - 1) {
				this.body.velocity.x = this.LANE_SWITCHING_SPEED;
				this.makeStateTransition(PlayerState.SwitchingLaneRight);
			}
		}

		moveLeft() {
			if (this.state == PlayerState.Driving && this.lane > 0) {
				this.body.velocity.x = -this.LANE_SWITCHING_SPEED;
				this.makeStateTransition(PlayerState.SwitchingLaneLeft);
			}
		}

		moveBreak() {
			if (this.state == PlayerState.Driving) {
				this.body.acceleration.y = this.ACCELERATION_BREAK;
				this.makeStateTransition(PlayerState.Breaking);
			}
		}

		moveDrive() {
			if (this.state == PlayerState.Breaking) {
				this.body.acceleration.y = -this.ACCELERATION_DRIVE;
				this.makeStateTransition(PlayerState.Driving);
			}
		}

		die() {
			if (this.state != PlayerState.Dead) {
				this.body.moves = false;
				this.makeStateTransition(PlayerState.Dead);
				if (this.onDie) {
					this.onDie()
				}
				console.log("Dead");
			}
		}

		restore() {
			this.body.moves = true;
			this.makeStateTransition(PlayerState.Driving);
		}

		update() {
			// Switching Lane
			if (this.state == PlayerState.SwitchingLaneRight) {
				if (this.position.x >= this.lanesX[this.lane + 1]) {
					this.finishSwitching(1);
				}
				else if (this.body.touching.right) {
					// Switch failed. Hit a car.
					this.body.velocity.x = -this.CANCEL_LANE_SWITCHING_SPEED;
					this.makeStateTransition(PlayerState.CancelSwitchingLaneRight);
				}
			}
			else if (this.state == PlayerState.SwitchingLaneLeft) {
				if (this.position.x <= this.lanesX[this.lane - 1]) {
					this.finishSwitching(-1);
				}
				else if (this.body.touching.left) {
					// Switch failed. Hit a car.
					this.body.velocity.x = this.CANCEL_LANE_SWITCHING_SPEED;
					this.makeStateTransition(PlayerState.CancelSwitchingLaneLeft);
				}
			}
			// Cancel Switching Lane
			else if (this.state == PlayerState.CancelSwitchingLaneLeft) {
				if (this.position.x >= this.lanesX[this.lane]) {
					this.finishSwitching(0);
				}
			}
			else if (this.state == PlayerState.CancelSwitchingLaneRight) {
				if (this.position.x <= this.lanesX[this.lane]) {
					this.finishSwitching(0);
				}
			}
			else if (this.state == PlayerState.Breaking) {
				if (this.body.velocity.y > 0) {
					// Do not drive backwards.
					this.body.velocity.y = 0;
				}
				this.addRage(this.BREAK_RAGE_ADD_PER_S * this.game.time.elapsedMS / 1000);
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

		hitCar(car : Phaser.Sprite) {
			var hitTop = this.body.wasTouching.up != this.body.touching.up;
			if (hitTop) {
				// Knockback
				this.body.velocity.y = this.KNOCKBACK_SPEED;
			}
			var hitLeft = this.body.wasTouching.left != this.body.touching.left;
			var hitRight = this.body.wasTouching.right != this.body.touching.right;
			if (hitTop || hitLeft || hitRight) {
				this.addRage(this.CRASH_RAGE_ADD);
			}
		}

		addRage(value : number) {
			this.rageLevel += value;
			if (this.rageLevel >= 1) {
				this.rageLevel = 1;
				this.die();
			}
			console.log("Rage level : " + this.rageLevel);
		}


		makeStateTransition(value : PlayerState) {
			if (this.state != value) {
				switch (value) {
					case PlayerState.Driving:
						// TODO
						break;
					case PlayerState.Breaking:
						// TODO
						break;
					case PlayerState.SwitchingLaneLeft:
					case PlayerState.SwitchingLaneRight:
						// TODO
						break;
					case PlayerState.Dead:
						// TODO
						break;
					default:
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

		get OnKnockBack() : () => void {
			return this.onKnockBack;
		}

		set OnKnockBack(value : () => void) {
			this.onKnockBack = value;
		}

		get IsDead() : boolean {
			return this.state == PlayerState.Dead;
		}

	}
}
