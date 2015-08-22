/// <reference path="../phaser.d.ts"/>


module Ld33.Level {
	export class MapParser {
		
		private ROW_PARSE_INTERVAL_IN_PX = 200;

		private game : Phaser.Game;
		private map : IMap;
		private lanesX : number[];
		
		private nextRowIndex : number;

		constructor(game : Phaser.Game, lanesX : number[], map : IMap) {
			this.game = game;
			this.map = map;
			this.lanesX = lanesX;
			this.nextRowIndex = map.rows.length - 1;
		}

		update() : boolean {
			var finished : boolean = false;
			while (this.game.camera.view.top < this.ROW_PARSE_INTERVAL_IN_PX * this.nextRowIndex) {
				this.parseNextRow();
				this.nextRowIndex--;
				if (this.nextRowIndex < 0) {
					finished = true;
				}
			}

			return !finished;
		}

		parseNextRow() {
			console.log("Parsing row " + this.nextRowIndex + ".");
			var row : number[] = this.map.rows[this.nextRowIndex];
			for (var i = 0; i < 5; i++ ) {
				switch (row[i]) {
					case 0:
						break;
				}
			}
		}

		getMapHeight() {
			return this.map.rows.length * this.ROW_PARSE_INTERVAL_IN_PX;
		}

	}

	export interface IMap {
		rows : number[][];
	}
}
