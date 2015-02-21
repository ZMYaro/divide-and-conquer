var Game = (function () {
	'use strict';
	
	/**
	 * A shim to make requestAnimationFrame work in more browsers.
	 * Credit to Paul Irish.
	 * @param {Function} func - The function to run on the next animation frame.
	 */
	var raf = (window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function (func) { setTimeout(func, 1 / 60); }).bind(window)
	
	/**
	 * Check whether two circles are touching.
	 * @param {Number} c1x - The first circle's x-coordinate
	 * @param {Number} c1y - The first circle's y-coordinate
	 * @param {Number} c1r - The first circle's radius
	 * @param {Number} c2x - The second circle's x-coordinate
	 * @param {Number} c2y - The second circle's y-coordinate
	 * @param {Number} c2r - The second circle's radius
	 * @returns {Boolean} - Whether the circles are touching
	 */
	function circlesTouching(c1x, c1y, c1r, c2x, c2y, c2r) {
		var xDist = c2x - c1x,
			yDist = c2y - c1y,
			dist = Math.sqrt(xDist * xDist + yDist * yDist);
		return dist < (c1r + c2r);
	}
	
	// TODO: Replace this with customizable choices.
	/** {Array<Object<String, Object<String, Number>>>} Default key mappings for players */
	var KEY_MAPPINGS = [{
			movement: {
				up: 87, // W
				down: 83, // S
				left: 65, // A
				right: 68
			},
			shooting: {
				up: 73, // I
				down: 75, // K
				left: 74, // J
				right: 76 // L
			}
		}, {
			movement: {
				up: 38, // Up
				down: 40, // Down
				left: 37, // Left
				right: 39 // Right
			},
			shooting: {
				up: 104, // Numpad 8
				down: 101, // Numpad 5
				left: 100, // Numpad 4
				right: 102 // Numpad 6
			}
		}],
		COLORS = [
			new Color(192, 0, 128),
			new Color(0, 255, 255)
		];
	
	
	/**
	 * Initialize a new Game instance.
	 */
	function Game() {
		// Private variables
		this._canvas = document.getElementById('canvas');
		this._cxt = this._canvas.getContext('2d');
		this._km = new KeyManager();
		
		//this._map;
		this._players = [];
		
		this._boundUpdate = this.update.bind(this);
	}
	
	Game.prototype = {
		// Private functions
		_checkCollisions: function () {
			this._players.forEach(function (player) {
				player.characters.forEach(function (character) {
					// Prevent the character moving off-screen.
					if (character.x - Character.TIER_RADIUS[character.tier] < 0) {
						character.x = Character.TIER_RADIUS[character.tier];
					} else if (character.x + Character.TIER_RADIUS[character.tier] > this._canvas.width) {
						character.x = this._canvas.width - Character.TIER_RADIUS[character.tier];
					}
					if (character.y - Character.TIER_RADIUS[character.tier] < 0) {
						character.y = Character.TIER_RADIUS[character.tier];
					} else if (character.y + Character.TIER_RADIUS[character.tier] > this._canvas.height) {
						character.y = this._canvas.height - Character.TIER_RADIUS[character.tier];
					}
					
					// Prevent characters overlapping.
					this._players.forEach(function (otherPlayer) {
						otherPlayer.characters.forEach(function (otherCharacter) {
							// Do not check the current character against itself.
							if (otherCharacter === character) {
								return;
							}
							// Check whether the other character is touching the character.
							if (circlesTouching(character.x,
									character.y,
									Character.TIER_RADIUS[character.tier],
									otherCharacter.x,
									otherCharacter.y,
									Character.TIER_RADIUS[otherCharacter.tier])) {
								// Calculate the direction the other character would move away from the character.
								var oppositeHeading = Math.atan2(otherCharacter.y - character.y, otherCharacter.x - character.x) + Math.PI;
								// Move the other character away.
								otherCharacter.x += Character.SPEED * Math.cos(oppositeHeading);
								otherCharacter.y -= Character.SPEED * Math.sin(oppositeHeading);
							}
						}, this);
					}, this);
					
					// Check bullet collisions.
					character.bullets.forEach(function (bullet) {
						// Do not check dead bullets.
						if (bullet.health <= 0) {
							return;
						}
						// Check bullet collisions with the edge of the canvas.
						// TODO: Remove this when walls are implemented.
						if (bullet.x + Bullet.RADIUS < 0 ||
								bullet.x - Bullet.RADIUS > this._canvas.width ||
								bullet.y + Bullet.RADIUS < 0 ||
								bullet.y - Bullet.RADIUS > this._canvas.height) {
							bullet.health = 0;
						}
						// Check bullet collisions with other players.
						this._players.forEach(function (otherPlayer) {
							// Skip the player who owns the bullet.
							if (otherPlayer === player) {
								return;
							}
							otherPlayer.characters.forEach(function (otherCharacter) {
								if (circlesTouching(bullet.x,
										bullet.y,
										Bullet.RADIUS,
										otherCharacter.x,
										otherCharacter.y,
										Character.TIER_RADIUS[otherCharacter.tier])) {
									otherCharacter.takeDamage(Bullet.TIER_DAMAGE[bullet.tier]);
									bullet.health--;
									// TODO: Implement splitting.
								}
							}, this);
						}, this);
					}, this);
				}, this);
			}, this);
		},
		
		// Public functions
		/**
		 * Start the game.
		 */
		start: function () {
			this._players = [
				new Player(KEY_MAPPINGS[0],
					Character.TIER_RADIUS[Character.DEFAULT_TIER] + 10,
					Character.TIER_RADIUS[Character.DEFAULT_TIER] + 10,
					Math.PI * 1.75,
					COLORS[0]),
				new Player(KEY_MAPPINGS[1],
					canvas.width - Character.TIER_RADIUS[Character.DEFAULT_TIER] - 10,
					canvas.height - Character.TIER_RADIUS[Character.DEFAULT_TIER] - 10,
					Math.PI * 0.75,
					COLORS[1])
			];
			
			raf(this._boundUpdate);
		},
		
		/**
		 * Update game entities and draw the next frame.
		 */
		update: function () {
			// Update.
			this._players.forEach(function (player) {
				var keyStateMap = this._km.checkKeys(player.keyCodeMap);
				player.update(keyStateMap);
			}, this);
			this._checkCollisions();
			
			// Draw.
			this._cxt.clearRect(0, 0, this._canvas.width, this._canvas.height);
			this._players.forEach(function (player) {
				player.draw(this._cxt);
			}, this);
			
			raf(this._boundUpdate);
		}
	};
	
	return Game;
})();
