var Game = (function () {
	'use strict';
	
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
		_checkBulletCollisions: function () {
			var that = this;
			this._players.forEach(function (player) {
				player.characters.forEach(function (character) {
					character.bullets.forEach(function (bullet) {
						// Do not check dead bullets.
						if (bullet.health <= 0) {
							return;
						}
						// Check bullet collisions with the edge of the canvas.
						// TODO: Remove this when walls are implemented.
						if (bullet.x + Bullet.RADIUS < 0 ||
								bullet.x - Bullet.RADIUS > that._canvas.width ||
								bullet.y + Bullet.RADIUS < 0 ||
								bullet.y - Bullet.RADIUS > that._canvas.height) {
							bullet.health = 0;
						}
						// Check bullet collisions with other players.
						that._players.forEach(function (otherPlayer) {
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
							});
						});
					});
				});
			});
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
			
			Utils.raf(this._boundUpdate);
		},
		
		/**
		 * Update game entities and draw the next frame.
		 */
		update: function () {
			var that = this;
			
			// Update.
			this._checkBulletCollisions();
			this._players.forEach(function (player) {
				var keyStateMap = that._km.checkKeys(player.keyCodeMap);
				player.update(keyStateMap);
			});
			
			// Draw.
			this._cxt.clearRect(0, 0, this._canvas.width, this._canvas.height);
			this._players.forEach(function (player) {
				player.draw(that._cxt);
			});
			
			Utils.raf(this._boundUpdate);
		}
	};
	
	return Game;
})();
