var Wall = (function () {
	'use strict'
	
	/**
	 * Initialize a new Wall.
	 * @param {Number} x - The Wall's starting x-coordinate
	 * @param {Number} y - The Wall's starting y-coordinate
	 * @param {Number} width - The Wall's width
	 * @param {Number} height - The Wall's height
	 */
	function Wall(x, y, width, height) {
		// Private variables
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
	}
	
	// Static Constants
	/** {Color} DEFAULT_STROKE_COLOR - The Wall's default stroke color */
	Wall.DEFAULT_STROKE_COLOR = new Color(0, 0, 0);
	
	Wall.prototype = {
		/**
		* Test whether or not the rectangle is colliding with a circle.
		* @param {Number} x - the x position of the circle
		* @param {Number} y - the y position of the circle
		* @param {Number} radius - the radius of the circle colliding
		* @returns {Boolean} - Whether the circle collided with the wall
		*/
		isColliding: function (x, y, radius) {
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
			
			// Check the last case for the corners .
			// Pythagorean formula for the lines from center to corners
			var dx = distX - this._width / 2;
			var dy = distY - this._height / 2;
			return (dx * dy + dy * dy <= (radius *  radius));
		},
		
		/**
		 * Draw the wall to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The context on which the wall is drawn
		 */
		draw: function(cxt) {
			// Change the stroke style to the default color then draw the rectangle
			cxt.strokeStyle = Wall.DEFAULT_STROKE_COLOR;
			// Draw the actual rectangle
			cxt.rect(this._x, this._y, this._width, this._height);
			cxt.stroke();
		}
	};
	
	return Wall;
})();