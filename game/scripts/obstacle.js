var Obstacle = (function () {
	/**
	 * Initialize a new Obstacle.
	 */
	function Obstacle(x, y) {
		this._x = x;
		this._y = y;
	}
	
	// Static Constants
	/** {Color} The default obstacle stroke color */
	Obstacle.DEFAULT_STROKE_COLOR = new Color(255, 255, 255); // White
	/** {Color} The default obstacle fill color */
	Obstacle.DEFAULT_FILL_COLOR = Obstacle.DEFAULT_STROKE_COLOR.darken(0.6);
	
	Obstacle.prototype = {
		/**
		 * Calculate the heading an entity would take away from the obstacle.
		 * @param {Number} x - The x-coordinate of the other entity
		 * @param {Number} y - The y-coordinate of the other entity
		 * @returns {Number} - The heading opposite the obstacle
		 * @abstract
		 */
		getOppositeHeading: function (x, y) {
			throw new Error('Obstacle.getOppositeHeading must be implemented by a subclass.');
		},
		
		/**
		 * Calculate the minimum amount a circle would have to move to not overlap with the obstacle.
		 * @param {Number} x - The x-coordinate of the circle
		 * @param {Number} y - The y-coordinate of the circle
		 * @param {Number} radius - The radius of the circle
		 * @returns {Number} - The overlap distance
		 * @abstract
		 */
		getOverlap: function (x, y, radius) {
			throw new Error('Obstacle.getOverlap must be implemented by a subclass.');
		},
		
		/**
		 * Calculate the angle at which a projectile should be travelling after hitting the obstacle.
		 * @param {Number} x - The x-coordinate of the projectile
		 * @param {Number} y - The y-coordinate of the projectile
		 * @param {Number} heading - The heading of the projectile
		 * @returns {Number} - The new heading for the projectile
		 * @abstract
		 */
		getRicochetHeading: function (x, y, heading) {
			throw new Error('Obstacle.getRicochetHeading must be implemented by a subclass.');
		},
		
		/**
		 * Check whether the obstacle is colliding with a given circle.
		 * @param {Number} x - The x-coordinate of the potentially colliding circle
		 * @param {Number} y - The y-coordinate of the potentially colliding circle
		 * @param {Number} r - The radius of the potentially colliding circle
		 * @returns {Boolean} - Whether the circle collided with the obstacle
		 * @abstract
		 */
		isColliding: function (x, y, radius) {
			throw new Error('Obstacle.isColliding must be implemented by a subclass.');
		},
		
		/**
		 * Draw the obstacle to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
			cxt.shadowColor = Obstacle.DEFAULT_STROKE_COLOR.hex;
			cxt.lineWidth = 4;
			cxt.strokeStyle = Obstacle.DEFAULT_STROKE_COLOR.hex;
			cxt.fillStyle = Obstacle.DEFAULT_FILL_COLOR.hex;
		}
	};
	
	return Obstacle;
})();
