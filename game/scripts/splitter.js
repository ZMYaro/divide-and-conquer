var Splitter = (function () {
	/**
	 * Initialize a new Splitter.
	 * @param {Number} x - The x-coordinate of the splitter
	 * @param {Number} y - The y-coordinate of the splitter
	 * @param {Number} [respawnTime] - The splitter's respawn time in seconds (if null, the splitter never respawns)
	 */
	function Splitter(x, y, respawnTime) {
		PowerUp.apply(this, arguments);
	}
	
	// Inherit from PowerUp.
	Splitter.prototype = Object.create(PowerUp.prototype);
	
	/**
	 * Activate the power-up's effect.
	 * @param {Character} character - The character that touched the power-up
	 * @abstract
	 */
	Splitter.prototype.affect = function (character) {
		// Do not use inactive power-ups.
		if (!this._active) {
			return;
		}
		PowerUp.prototype.affect.apply(this, arguments);
		// Clone the character.
		character.clone();
	};
	
	/**
	 * Draw the power-up to the canvas.
	 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
	 */
	Splitter.prototype.draw = function (cxt) {
		// Do not draw inactive power-ups.
		if (!this._active) {
			return;
		}
		cxt.lineWidth = 2;
		cxt.strokeStyle = 'lime';
		cxt.fillStyle = 'green';
		cxt.shadowColor = 'lime';
		cxt.beginPath();
		cxt.arc(this._x, this._y, PowerUp.RADIUS, 0, 2 * Math.PI);
		cxt.closePath();
		cxt.fill();
		cxt.stroke();
	};
	
	return Splitter;
})();