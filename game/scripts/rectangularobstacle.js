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
		var distY = Math.abs(y - this._y - this._height / 2);
		
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
	 * Calculate the heading an entity would take away from the obstacle.
	 * @param {Number} x - The x-coordinate of the other entity
	 * @param {Number} y - The y-coordinate of the other entity
	 * @returns {Number} - The heading opposite the obstacle
	 */
	RectangularObstacle.prototype.getOppositeHeading = function (x, y) {
		var heading;
		
		if (x < this._x) {
			// If to the left of the obstacle, push right.
			heading = Math.PI;
			
			if (y < this._y) {
				// If also above the obstacle, push up as well.
				heading -= 0.25 * Math.PI;
			} else if (y > this._y + this._height) {
				// If also below the obstacle, push down as well.
				heading += 0.25 * Math.PI;
			}
		} else if (x > this._x + this._width) {
			// If to the right of the obstacle, push left.
			heading = 0;
			
			if (y < this._y) {
				// If also above the obstacle, push up as well.
				heading += 0.25 * Math.PI;
			} else if (y > this._y + this._height) {
				// If also below the obstacle, push down as well.
				heading -= 0.25 * Math.PI;
			}
		} else if (y < this._y) {
			// If only above the obstacle, push up.
			heading = 0.5 * Math.PI;
		} else if (y > this._y + this._height) {
			// If only below the obstacle, push down.
			heading = -0.5 * Math.PI;
		}
		
		return heading;
	};
	
	/**
	 * Calculate the angle at which a projectile should be travelling after hitting the obstacle.
	 * @param {Number} x - The x-coordinate of the projectile
	 * @param {Number} y - The y-coordinate of the projectile
	 * @param {Number} heading - The heading of the projectile
	 * @returns {Number} - The new heading for the projectile
	 */
	RectangularObstacle.prototype.getRicochetHeading = function (x, y, heading) {
		var movementVector = Vector2D.fromPolar(Bullet.SPEED, heading);
		x -= movementVector.x;
		y -= movementVector.y;
		if (x < this._x || x > this._x + this._width) {
			// The projectile hit the let or right side of the obstacle, so invert its x-component.
			movementVector.x *= -1;
		} else if (y > this._y || y < this._y + this._height) {
			// The projectile hit the top or bottom of the obstacle, so invert its y-component.
			movementVector.y *= -1;
		}
		return movementVector.angle;
	},
	
	/**
	 * Calculate the minimum amount a circle would have to move to not overlap with the obstacle.
	 * @param {Number} x - The x-coordinate of the circle
	 * @param {Number} y - The y-coordinate of the circle
	 * @param {Number} radius - The radius of the circle
	 * @returns {Number} - The overlap distance
	 */
	RectangularObstacle.prototype.getOverlap = function (x, y, radius) {
		if (x < this._x) {
			// The circle is to the left of the obstacle.
			if (y < this._y) {
				// The circle is also above the obstacle.
				return CircularObstacle.prototype.getOverlap.call({
					_x: this._x,
					_y: this._y,
					_radius: 0
				}, x, y, radius);
			} else if (y > this._y + this._height) {
				// The circle is also below the obstacle.
				return CircularObstacle.prototype.getOverlap.call({
					_x: this._x,
					_y: this._y + this._height,
					_radius: 0
				}, x, y, radius);
			}
			// The circle is only to the left of the obstacle.
			return radius - (this._x - x);
		} else if (x > this._x + this._width) {
			// The circle is to the right of the obstacle.
			if (y < this._y) {
				// The circle is also above the obstacle.
				return CircularObstacle.prototype.getOverlap.call({
					_x: this._x + this._width,
					_y: this._y,
					_radius: 0
				}, x, y, radius);
			} else if (y > this._y + this._height) {
				// The circle is also below the obstacle.
				return CircularObstacle.prototype.getOverlap.call({
					_x: this._x + this._width,
					_y: this._y + this._height,
					_radius: 0
				}, x, y, radius);
			}
			// The circle is only to the right of the obstacle.
			return radius - (x - (this._x + this._width));
		} else if (y < this._y) {
			// The circle is only above the obstacle.
			return radius - (this._y - y);
		} else if (y > this._y + this._height) {
			// The circle is only below the obstacle.
			return radius - (y - (this._y + this._height));
		}
		
		return 0;
	};
	
	/**
	 * Draw the obstacle to the canvas.
	 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
	 */
	RectangularObstacle.prototype.draw = function (cxt) {
		Obstacle.prototype.draw.call(this, cxt);
		
		cxt.fillRect(this._x, this._y, this._width, this._height);
		cxt.strokeRect(this._x, this._y, this._width, this._height);
	};
	
	return RectangularObstacle;
})();
