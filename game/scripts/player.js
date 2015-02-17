var Player = (function () {
	/**
	 * Initialize a new Player.
	 * @param {Object<String, Object<String, Number>>} keyCodeMap - The codes for the player's input keys
	 */
	function Player(keyCodeMap) {
		this._keyCodeMap = keyCodeMap;
	}
	
	Player.prototype = {
		/**
		 * Updates the player.
		 */
		update: function() {
		},

		/**
		 * Draw the player's characters to the canvas.
		 * @param {CanvasRenderingContext2D} - The drawing context for the game canvas
		 */
		draw: function draw(ctx) {
		}
	};
	
	return Player;
})();
