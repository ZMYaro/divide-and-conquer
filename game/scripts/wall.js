var Wall = (function(){
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
		this._x;
		this._y;
		this._width;
		this._height;
		
	}
	
	// TODO 
	// Determine whether or not wall collision happens here or in game.js
	
	/**
	* @param {CanvasRenderingContext2D} cxt - The context on which the wall is drawn
	*/
	function draw(cxt) {
		cxt.strokeStyle = Wall.DEFAULT_STROKE_COLOR;
		cxt.rect(this._x, this._y, this._width, this._height);
		cxt.stroke();
	}
	
	
})();