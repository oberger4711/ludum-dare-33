/// <reference path="../phaser.d.ts"/>


module Ld33.Level {
	export class MapParser {
		
		private ROW_PARSE_INTERVAL_IN_PX = 100;

		private game : Phaser.Game;
		private enemies : Phaser.Group;
		private map : IMap;
		private lanesX : number[];
		private scaleFactor : number;
		private rageTint : number;

		private onEnemyKilled : (s) => void;
		
		private nextRowIndex : number;

		constructor(game : Phaser.Game, enemies : Phaser.Group, lanesX : number[], scaleFactor : number, map : IMap) {
			this.game = game;
			this.enemies = enemies;
			this.map = map;
			this.lanesX = lanesX;
			this.scaleFactor = scaleFactor;
			this.nextRowIndex = map.rows.length - 1;
		}

		update() : boolean {
			var finished : boolean = false;
			if (this.nextRowIndex >=0) {
				while (this.game.camera.view.top < this.ROW_PARSE_INTERVAL_IN_PX * this.nextRowIndex + this.game.height * 2) {
					this.parseNextRow();
					this.nextRowIndex--;
					if (this.nextRowIndex < 0) {
						finished = true;
					}
				}
			}
			else {
				finished = true;
			}

			return !finished;
		}

		parseNextRow() {
			console.log("Parsing row " + this.nextRowIndex + ".");
			var row : number[] = this.map.rows[this.nextRowIndex];
			for (var i = 0; i < 5; i++ ) {
				if (row[i] > 0) {
					this.addCar(i, row[i]);
				}
			}
		}

		addCar(laneIndex : number, carIndex : number) {
			var x = this.lanesX[laneIndex];
			var y = this.game.camera.view.top - 32 * this.scaleFactor;
			switch (carIndex) {
				case 1:
					this.createCar(x, y, 0, Number.MAX_VALUE, 'car1');
					break;
				case 2:
					this.createCar(x, y, 0, Number.MAX_VALUE, 'car2');
					break;
				case 3:
					this.createCar(x, y, 0, Number.MAX_VALUE, 'car3');
					break;
				case 4:
					this.createCar(x, y, 0, 3, 'car4');
					break;
			}
		}

		createCar(x, y, speed, health, imgName) {
			var newCar : Phaser.Sprite = this.enemies.create(x, y, imgName);
			newCar.anchor.set(0.5, 0.5);
			newCar.health = health;
			newCar.tint = this.rageTint;
			newCar.scale.set(this.scaleFactor, this.scaleFactor);
			this.game.physics.enable(newCar, Phaser.Physics.ARCADE);
			newCar.body.enable = true;
			newCar.body.immovable = true;
			newCar.body.velocity.y = speed;
		}

		getMapHeight() {
			return this.map.rows.length * this.ROW_PARSE_INTERVAL_IN_PX + this.game.height * 3;
		}

		set RageTint (value : number) {
			this.rageTint = value;
		}

	}

	export interface IMap {
		rows : number[][];
	}
}
