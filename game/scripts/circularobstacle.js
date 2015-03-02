var CircularObstacle = (function () {
	'use strict'
	
	/**
	 * Initialize a new CircularObstacle.
	 * @param {Number} x - The Obstacle's starting x-coordinate
	 * @param {Number} y - The Obstacle's starting y-coordinate
	 * @param {Number} radius - The CircularObstacle's radius
	 */
	function CircularObstacle(x, y, radius) {
		// Call the super constructor.
		Obstacle.call(this, x, y);
		
		// Private variables
		this._radius = radius;
	}
	
	// Inherit from Obstacle.
	CircularObstacle.prototype = Object.create(Obstacle.prototype);
	
	/**
	 * Calculate the heading an entity would take away from the obstacle.
	 * @param {Number} x - The x-coordinate of the other entity
	 * @param {Number} y - The y-coordinate of the other entity
	 * @returns {Number} - The heading opposite the obstacle
	 */
	CircularObstacle.prototype.getOppositeHeading = function (x, y) {
		return (new Vector2D(x, y, this._x, this._y)).angle;
	};
	
	/**
	 * Calculate the minimum amount a circle would have to move to not overlap with the obstacle.
	 * @param {Number} x - The x-coordinate of the circle
	 * @param {Number} y - The y-coordinate of the circle
	 * @param {Number} radius - The radius of the circle
	 * @returns {Number} - The overlap distance
	 */
	CircularObstacle.prototype.getOverlap = function (x, y, radius) {
		return radius + this._radius - (new Vector2D(this._x, this._y, x, y)).length;
	};
	
	/**
	 * Calculate the angle at which a projectile should be travelling after hitting the obstacle.
	 * @param {Number} x - The x-coordinate of the projectile
	 * @param {Number} y - The y-coordinate of the projectile
	 * @param {Number} heading - The heading of the projectile
	 * @returns {Number} - The new heading for the projectile
	 */
	CircularObstacle.prototype.getRicochetHeading = function (x, y, heading) {
		// TODO: Finish implementing this.
		var movementVector = Vector2D.fromPolar(1, heading),
			collisionVector = new Vector2D(x, y, this._x, this._y);
		//return (0.5 * Math.PI) - movementVector
		// For now, reflect the bullet away from the obstacle.
		return collisionVector.angle;
	},
	
	/**
	 * Test whether the circular obstacle is colliding with a circle.
	 * @param {Number} x - The x-coordinate of the circle
	 * @param {Number} y - The y-coordinate of the circle
	 * @param {Number} radius - The radius of the circle
	 * @returns {Boolean} - Whether the circle collided with the obstacle
	 */
	CircularObstacle.prototype.isColliding = function (x, y, radius) {
		return (new Vector2D(this._x, this._y, x, y)).length < (this._radius + radius);
	};
	
	/**
	 * Draw the obstacle to the canvas.
	 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
	 */
	CircularObstacle.prototype.draw = function (cxt) {
		Obstacle.prototype.draw.call(this, cxt);
		
		cxt.beginPath();
		cxt.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
		cxt.closePath();
		cxt.fill();
		cxt.stroke();
	};
	
	return CircularObstacle;
})();
