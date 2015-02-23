var RectangularObstacle = (function () {
	'use strict'
	
	/**
	 * Initialize a new RectangularObstacle.
	 * @param {Number} x - The Obstacle's starting x-coordinate
	 * @param {Number} y - The Obstacle's starting y-coordinate
	 * @param {Number} width - The RectangularObstacle's width
	 * @param {Number} height - The RectangularObstacle's height
	 */
	function RectangularObstacle(x, y, width, height) {
		// Call the super constructor.
		Obstacle.call(this, x, y);
		
		// Private variables
		this._width = width;
		this._height = height;
	}
	
	// Inherit from Obstacle.
	RectangularObstacle.prototype = Object.create(Obstacle.prototype);
	
	/**
	 * Test whether the rectangular obstacle is colliding with a circle.
	 * @param {Number} x - the x position of the circle
	 * @param {Number} y - the y position of the circle
	 * @param {Number} radius - the radius of the circle colliding
	 * @returns {Boolean} - Whether the circle collided with the obstacle
	 */
	RectangularObstacle.prototype.isColliding = function (x, y, radius) {
		// Calculate the distance between the two shapes.
		var distX = Math.abs(x - this._x - this._width / 2);
		var distX = Math.abs(y - this._y - this._height / 2);
		
		// If the distance is greater than half of each shape they are too far.
		if (distX > (this._width / 2 + radius)) {
			return false;
		}
		if (distY > (this._height / 2 + radius)) {
			return false;
		}
		
		// If the distance is less than half then they are colliding.
		if (distX <= (this._width / 2)) {
			return true;
		} 
		if (distY <= (this._height / 2)) {
			return true;
		} 
		
		// Check the last case for the corners.
		// Pythagorean formula for the lines from center to corners
		var dx = distX - this._width / 2;
		var dy = distY - this._height / 2;
		return (dx * dy + dy * dy <= (radius *  radius));
	};
	
	/**
	 * Draw the obstacle to the canvas.
	 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
	 */
	RectangularObstacle.prototype.draw = function (cxt) {
		// Draw the rectangle.
		cxt.fillStyle = Obstacle.DEFAULT_COLOR.hex;
		cxt.fillRect(this._x, this._y, this._width, this._height);
	};
	
	return RectangularObstacle;
})();
