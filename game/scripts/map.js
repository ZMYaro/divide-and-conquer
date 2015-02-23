var Map = (function () {
	'use strict'
	
	function Map(cxt) {
		// Public variables
		this.cxt;
		this.field; 
		
		// Private variables
		this._walls = [];
	}
	
	Map.prototype = {
		/**
		* Draw the map to the canvas.
		* @param {CanvasRenderingContext2D} cxt - The context on which the map is drawn
		*/
		draw: function(cxt) {
			
			// Go through the list of walls and draw each one.
			this._walls.foreach(function (wall) {
				wall.draw(cxt);
			}, this);
		}
	};	
	
	return Map;
})();