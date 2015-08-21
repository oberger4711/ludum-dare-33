all: game.ts
	tsc -t 'ES5' -out game.js game.ts
