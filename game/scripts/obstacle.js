var Obstacle = (function () {
	/**
	 * Initialize a new Obstacle.
	 */
	function Obstacle(x, y) {
		this._x = x;
		this._y = y;
	}
	
	// Static Constants
	/** {Color} The default obstacle color */
	Obstacle.DEFAULT_COLOR = new Color(0, 0, 0); // Black
	
	Obstacle.prototype = {
		/**
		 * Check whether the obstacle is colliding with a given circle.
		 * @param {Number} x - The x-coordinate of the potentially colliding circle
		 * @param {Number} y - The y-coordinate of the potentially colliding circle
		 * @param {Number} r - The radius of the potentially colliding circle
		 * @abstract
		 */
		isColliding: function (x, y, radius) {
			throw new Error('Obstacle.isColliding must be implemented by a subclass.');
		},
		
		/**
		 * Draw the obstacle to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 * @abstract
		 */
		draw: function (cxt) {
			throw new Error('Obstacle.draw must be implemented by a subclass.');
		}
	};
	
	return Obstacle;
})();
