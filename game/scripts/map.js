var Map = (function () {
	'use strict'
	
	/**
	 * Initialize a new Map.
	 */
	function Map() {
		// Public variables
		this.obstacles = [];
		this.powerUps = [];
	}
	
	Map.prototype = {
		/**
		* Draw the map to the canvas.
		* @param {CanvasRenderingContext2D} cxt - The context on which the map is drawn
		*/
		draw: function(cxt) {
			// Draw each obstacle.
			this.obstacles.forEach(function (obstacle) {
				obstacle.draw(cxt);
			});
			// Draw each power-up.
			this.powerUps.forEach(function (powerUp) {
				powerUp.draw(cxt);
			});
		}
	};	
	
	return Map;
})();
