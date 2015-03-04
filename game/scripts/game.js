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
	/** {Array<Color>} Default colors for players */
	var COLORS = [
			new Color(192, 0, 128),
			new Color(0, 255, 255)
		];
	
	
	/**
	 * Initialize a new Game instance.
	 * @param {Array<KeyGroupCodeMap>} playerKeyCodeMaps - The key code maps for each player
	 * @param {Function} [gameOverCallback] - A function to call when the game ends
	 */
	function Game(playerKeyCodeMaps, gameOverCallback) {
		// Private variables
		this._canvas = document.getElementById('canvas');
		this._cxt = this._canvas.getContext('2d');
		this._km = new KeyManager();
		this._paused = false;
		this._gameOverCallback = gameOverCallback;
		this._glowFrame = 0;
		
		this._players = [
			new Player(playerKeyCodeMaps[0],
				Character.TIER_RADIUS[Character.DEFAULT_TIER] + 10,
				Character.TIER_RADIUS[Character.DEFAULT_TIER] + 10,
				Math.PI * 1.75,
				COLORS[0]),
			new Player(playerKeyCodeMaps[1],
				canvas.width - Character.TIER_RADIUS[Character.DEFAULT_TIER] - 10,
				canvas.height - Character.TIER_RADIUS[Character.DEFAULT_TIER] - 10,
				Math.PI * 0.75,
				COLORS[1])
		];
		
		// Initialize a default map.
		// TODO: Implement level selection instead of hard-coding a map.
		this._map = new Map();
		this._map.obstacles = [
			// Left and right walls
			new RectangularObstacle(-2 * Bullet.SPEED,  -2 * Bullet.SPEED, 2 * Bullet.SPEED, this._canvas.height + (4 * Bullet.SPEED)),
			new RectangularObstacle(this._canvas.width, -2 * Bullet.SPEED, 2 * Bullet.SPEED, this._canvas.height + (4 * Bullet.SPEED)),
			// Top and bottom walls
			new RectangularObstacle(-2 * Bullet.SPEED, -2 * Bullet.SPEED,   this._canvas.width + (4 * Bullet.SPEED), 2 * Bullet.SPEED),
			new RectangularObstacle(-2 * Bullet.SPEED, this._canvas.height, this._canvas.width + (4 * Bullet.SPEED), 2 * Bullet.SPEED),
			// Other walls
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
		raf(this._boundUpdate);
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
						
						// Check whether the bullet is colliding with an obstaclee
						var nextMove = Vector2D.fromPolar(Bullet.SPEED, bullet.heading);
						this._map.obstacles.forEach(function (obstacle) {
							if (obstacle.isColliding(bullet.x, bullet.y, 1)) {
								// Decrease the bullet's health.
								bullet.health--;
								// Make the bullet bounce.
								bullet.heading = obstacle.getRicochetHeading(bullet.x, bullet.y, bullet.heading);
								// Play its wall-hitting sound.
								bullet.sounds.bounce.play();
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
		 * Pause the game.
		 */
		pause: function () {
			// Set the game to be paused.
			this._paused = true;
		},
		
		/**
		 * Unpause the game.
		 */
		resume: function () {
			// Set the game to be unpaused.
			this._paused = false;
			// Restart the update loop.
			this.update();
		},
		
		/**
		 * Remove the game's event listeners.
		 */
		removeEventListeners: function () {
			// Ensure the RAF loop dies.
			this._paused = true;
			// Disable the key manager.
			this._km.removeEventListeners();
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
