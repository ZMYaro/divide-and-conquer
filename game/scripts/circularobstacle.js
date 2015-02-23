var CircularObstacle = (function () {
	'use strict'
	
	/**
	 * Initialize a new CircularObstacle.
	 * @param {Number} x - The Obstacle's starting x-coordinate
	 * @param {Number} y - The Obstacle's starting y-coordinate
	 * @param {Number} radius - The CircularObstacle's radius
	 */
	function CircularObstacle(x, y, width, height) {
		// Call the super constructor.
		Obstacle.call(this, x, y);
		
		// Private variables
		this._radius = radius;
	}
	
	// Inherit from Obstacle.
	CircularObstacle.prototype = Object.create(Obstacle.prototype);
	
	/**
	 * Test whether the circular obstacle is colliding with a circle.
	 * @param {Number} x - the x position of the circle
	 * @param {Number} y - the y position of the circle
	 * @param {Number} radius - the radius of the circle colliding
	 * @returns {Boolean} - Whether the circle collided with the wall
	 */
	CircularObstacle.prototype.isColliding = function (x, y, radius) {
		var xDist = x - this._x,
			yDist = y - this._y,
			dist = Math.sqrt(xDist * xDist + yDist * yDist);
		return dist < (this._radius + radius);
	};
	
	/**
	 * Draw the obstacle to the canvas.
	 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
	 */
	CircularObstacle.prototype.draw = function (cxt) {
		// Change the stroke style to the default color then draw the rectangle
		cxt.strokeStyle = Obstacle.DEFAULT_STROKE_COLOR;
		// Draw the actual rectangle
		cxt.beginPath();
		cxt.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
		cxt.closePath();
		cxt.fill();
	};
	
	return CircularObstacle;
})();
