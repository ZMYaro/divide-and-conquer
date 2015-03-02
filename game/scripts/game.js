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
		return (new Vector2D(c1x, c1y, c2x, c2y)).length < (c1r + c2r);
	}
	
	// TODO: Replace this with customizable choices.
	/** {Array<Object<String, Object<String, Number>>>} Default key mappings for players */
	var KEY_MAPPINGS = [{
			movement: {
				up: 87, // W
				down: 83, // S
				left: 65, // A
				right: 68 // D
			},
			shooting: {
				up: 84, // T
				down: 71, // G
				left: 70, // F
				right: 72 // H
			}
		}, {
			movement: {
				up: 79, // O
				down: 76, // L
				left: 75, // K
				right: 186 // ;
			},
			shooting: {
				up: 38, // Up
				down: 40, // Down
				left: 37, // Left
				right: 39 // Right
			}
		}],
		COLORS = [
			new Color(192, 0, 128),
			new Color(0, 255, 255)
		];
	
	
	/**
	 * Initialize a new Game instance.
	 * @param {Function} [gameOverCallback] - A function to call when the game ends
	 */
	function Game(gameOverCallback) {
		// Private variables
		this._canvas = document.getElementById('canvas');
		this._cxt = this._canvas.getContext('2d');
		this._km = new KeyManager();
		this._paused = false;
		this._gameOverCallback = gameOverCallback;
		this._glowFrame = 0;
		
		this._players = [];
		
		// Initialize a default map.
		// TODO: Implement level selection instead of hard-coding a map.
		this._map = new Map();
		this._map.obstacles = [
			new RectangularObstacle(this._canvas.width * 0.5 - 30, this._canvas.height * 0.5 - 30, 60, 60),
			new CircularObstacle(this._canvas.width * 0.2, this._canvas.height * 0.2, 30),
			new CircularObstacle(this._canvas.width * 0.2, this._canvas.height * 0.8, 30),
			new CircularObstacle(this._canvas.width * 0.8, this._canvas.height * 0.2, 30),
			new CircularObstacle(this._canvas.width * 0.8, this._canvas.height * 0.8, 30)
		];
		this._map.powerUps = [
			new Splitter(this._canvas.width * 0.5, this._canvas.height * 0.25, 20),
			new Splitter(this._canvas.width * 0.5, this._canvas.height * 0.75, 20)
		];
		
		this._boundUpdate = this.update.bind(this);
	}
	
	/** {Number} The maximum shadow blur to use for glowing entities */
	Game.MAX_GLOW = 6;
	/** {Number} The number of frames in the glow pulse animation */
	Game.GLOW_ANIMATION_LENGTH = 150;
	
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
								// Get a vector in the direction the character would move away from the other character.
								var movementVector = (new Vector2D(character.x, character.y, otherCharacter.x, otherCharacter.y));
								movementVector.normalize();
								movementVector.scaleBy(Character.SPEED);
								// Move the character away.
								character.x += movementVector.x;
								character.y -= movementVector.y;
							}
						}, this);
					}, this);
					
					// Prevent characters walking through walls.
					this._map.obstacles.forEach(function (obstacle) {
						if (obstacle.isColliding(character.x, character.y, Character.TIER_RADIUS[character.tier])) {
							// Calculate the direction the character would move away from the wall.
							var oppositeHeading = obstacle.getOppositeHeading(character.x, character.y),
								overlap = obstacle.getOverlap(character.x, character.y, Character.TIER_RADIUS[character.tier]),
								movementVector = Vector2D.fromPolar(overlap, oppositeHeading);
							// Move the character away.
							character.x += movementVector.x;
							character.y -= movementVector.y;
						}
					}, this);
					
					// Check for picking up power-ups.
					this._map.powerUps.forEach(function (powerUp) {
						if (powerUp.isColliding(character.x, character.y, Character.TIER_RADIUS[character.tier])) {
							powerUp.affect(character);
						}
					});
					
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
						
						// Check bullet collisions with walls.
						this._map.obstacles.forEach(function (obstacle) {
							if (obstacle.isColliding(bullet.x, bullet.y, Bullet.RADIUS)) {
								bullet.health = 0;
							}
						}, this);
						
						// Check bullet collisions with other players.
						this._players.forEach(function (otherPlayer) {
							// Skip the player who owns the bullet.
							if (otherPlayer === player) {
								return;
							}
							otherPlayer.characters.forEach(function (otherCharacter) {
								if (bullet.isColliding(otherCharacter.x,
										otherCharacter.y,
										Character.TIER_RADIUS[otherCharacter.tier])) {
									otherCharacter.takeDamage(Bullet.TIER_DAMAGE[bullet.tier]);
									bullet.health--;
								}
							}, this);
						}, this);
					}, this);
				}, this);
			}, this);
		},
		
		_checkGameOver: function () {
			// Check whether any player is out of characters.
			var loser;
			this._players.forEach(function (player) {
				if (player.numAlive <= 0) {
					loser = player;
					return;
				}
			});
			// If a player has won, end the game.
			if (loser) {
				this._paused = true;
				if (typeof(this._gameOverCallback) === 'function') {
					this._gameOverCallback();
				}
			}
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
		 * Pause the game.
		 */
		pause: function () {
			this._paused = true;
		},
		
		/**
		 * Unpause the game.
		 */
		resume: function () {
			this._paused = false;
			this.update();
		},
		
		/**
		 * Update game entities and draw the next frame.
		 */
		update: function () {
			// Do nothing if the game is paused.
			if (this._paused) {
				return;
			}
			
			// Update.
			this._players.forEach(function (player) {
				var keyStateMap = this._km.checkKeys(player.keyCodeMap);
				player.update(keyStateMap);
			}, this);
			this._checkCollisions();
			
			// Draw.
			this._glowFrame++;
			if (this._glowFrame >= Obstacle.GLOW_ANIMATION_LENGTH) {
				this._glowFrame = 0;
			}
			this._cxt.shadowBlur = -(Game.MAX_GLOW / 2) * Math.sin(this._glowFrame / (Game.GLOW_ANIMATION_LENGTH / 20 * Math.PI)) + (Game.MAX_GLOW / 2);
			
			this._cxt.clearRect(0, 0, this._canvas.width, this._canvas.height);
			this._players.forEach(function (player) {
				player.draw(this._cxt);
			}, this);
			this._map.draw(this._cxt);
			
			// Check whether the game is over.
			this._checkGameOver();
			
			raf(this._boundUpdate);
		}		
	};
	
	return Game;
})();
