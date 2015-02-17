var Player = (function () {
	/**
	 * Initialize a new Player.
	 * @param {Object<String, Object<String, Number>>} keyCodeMap - The codes for the player's input keys
	 * @param {Number} startX - The player's first character's starting x-coordinate
	 * @param {Number} startY - The player's first character's starting y-coordinate
	 * @param {Color} color - The player's color.
	 */
	function Player(keyCodeMap, startX, startY, color) {
		// Public variables
		this.keyCodeMap = keyCodeMap;
		
		// Private variables
		this._characters = [
			new Character(startX, startY, color)
		];
	}
	
	Player.prototype = {
		/**
		 * Update the player.
		 * @param {Object<String, Object<String, Boolean>>} 
		 */
		update: function (keyStateMap) {
			this._characters.forEach(function (character) {
				character.update(keyStateMap);
			});
		},
		
		/**
		 * Draw the player's characters to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
			this._characters.forEach(function (character) {
				character.draw(cxt);
			});
		}
	};
	
	return Player;
})();
