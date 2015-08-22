/// <reference path="../phaser.d.ts"/>

module Ld33.Level {
	enum PlayerState {
		Driving,
		SwitchingLane,
		Dead
	};
	export class Player extends Phaser.Sprite {

		private minDrivingSpeed : number = 300;
		private lanesX : number[];
		
		private state : PlayerState;
		private lane : number = 2;
		private onDie : () => void;

		constructor(game, yOffset, lanesX : number[]) {
			super(game, lanesX[2], yOffset, 'player-car');
			this.lane = 2;
			this.anchor.set(0.5, 0.5);

			//this.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7, 8], 10, true);
			this.state = PlayerState.Driving;
			//this.animations.play('stand');
		}

		moveRight() {
			this.moveX(1);
		}

		moveLeft() {
			this.moveX(-1);
		}

		moveX(dirFactor : number) {
			if (this.state != PlayerState.Dead) {
				// TODO
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
			if (this.state != PlayerState.Dead) {
			}
		}

		makeStateTransition(value : PlayerState) {
			if (this.state != value) {
				switch (value) {
					case PlayerState.Driving:
						this.animations.play('stand');
						break;
					case PlayerState.SwitchingLane:
						this.animations.play('jump');
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
