var PowerUp = (function () {
	/**
	 * Initialize a new PowerUp.
	 * @param {Number} x - The x-coordinate of the power-up
	 * @param {Number} y - The y-coordinate of the power-up
	 * @param {Number} [respawnTime] - The power-up's respawn time in seconds (if null, the power-up never respawns)
	 */
	function PowerUp(x, y, respawnTime) {
		this._x = x;
		this._y = y;
		this._active = true;
		this._respawnTime = respawnTime;
	}
	
	// Static constants.
	/** {Number} The radius in which a power-up can be picked up */
	PowerUp.RADIUS = 16;
	
	PowerUp.prototype = {
		/**
		 * Test whether the power-up is colliding with a circle.
		 * @param {Number} x - The x-coordinate of the circle
		 * @param {Number} y - The y-coordinate of the circle
		 * @param {Number} radius - The radius of the circle
		 * @returns {Boolean} - Whether the circle collided with the obstacle
		 */
		isColliding: function (x, y, radius) {
			// Do not collide with inactive power-ups.
			if (!this._active) {
				return false;
			}
			return CircularObstacle.prototype.isColliding.call({
					_x: this._x,
					_y: this._y,
					_radius: PowerUp.RADIUS
				}, x, y, radius);
		},
		
		/**
		 * Activate the power-up's effect.
		 * @param {Character} character - The character that touched the power-up
		 */
		affect: function (character) {
			// Do not use inactive power-ups.
			if (!this._active) {
				return;
			}
			// Deactivate the power-up.
			this._active = false;
			// If it is set to respawn, set a timer.
			// TODO: Change this once the deltaTime change has been implemented.
			if (this._respawnTime) {
				setTimeout((function () {
					this._active = true;
				}).bind(this), 1000 * this._respawnTime);
			}
		},
		
		/**
		 * Draw the power-up to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
			throw new Error('PowerUp.draw must be implemented by a subclass.');
		}
	};
	
	return PowerUp;
})();