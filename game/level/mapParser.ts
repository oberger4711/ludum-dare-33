/// <reference path="../phaser.d.ts"/>


module Ld33.Level {
	export class MapParser {
		
		private ROW_PARSE_INTERVAL_IN_PX = 100;

		private game : Phaser.Game;
		private map : IMap;
		private lanesX : number[];
		private scaleFactor : number;
		
		private nextRowIndex : number;

		constructor(game : Phaser.Game, lanesX : number[], scaleFactor : number, map : IMap) {
			this.game = game;
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
			var newCar : Phaser.Sprite = this.game.add.sprite(this.lanesX[laneIndex], this.game.camera.view.top - 32 * this.scaleFactor, 'car' + carIndex);
			newCar.anchor.set(0.5, 0.5);
			newCar.scale.set(this.scaleFactor, this.scaleFactor);
			this.game.physics.enable(newCar, Phaser.Physics.ARCADE);
			newCar.body.enable = true;
			newCar.body.immovable = true;
		}

		getMapHeight() {
			return this.map.rows.length * this.ROW_PARSE_INTERVAL_IN_PX + this.game.height * 3;
		}

	}

	export interface IMap {
		rows : number[][];
	}
}
