var Player = (function () {
	'use strict';
	
	/**
	 * Initialize a new Player.
	 * @param {Object<String, Object<String, Number>>} keyCodeMap - The codes for the player's input keys
	 * @param {Number} x - The player's first character's starting x-coordinate
	 * @param {Number} y - The player's first character's starting y-coordinate
	 * @param {Number} heading - The player's first character's starting heading
	 * @param {Color} color - The player's color.
	 */
	function Player(keyCodeMap, x, y, heading, color) {
		// Public variables
		this.keyCodeMap = keyCodeMap;
		this.color = color;
		this.characters = [];
		this.numAlive = 1;
		this.addCharacter(x, y, heading);
	}
	
	Player.prototype = {
		/**
		 * Create a new character.
		 * @param {Number} x - The character's starting x-coordinate
		 * @param {Number} y - The character's starting y-coordinate
		 * @param {Number} heading - The character's starting heading
		 * @param {Number} [tier] - The character's starting tier, if it is not the default
		 */
		addCharacter: function (x, y, heading, tier) {
			this.characters.push(new Character(this, x, y, heading, this.color, tier));
		},
		
		/**
		 * Update the player.
		 * @param {Object<String, Object<String, Boolean>>} keyStateMap - The states of the key inputs that would affect the player.
		 */
		update: function (keyStateMap) {
			this.characters.forEach(function (character) {
				character.update(keyStateMap);
			});
		},
		
		/**
		 * Draw the player's characters to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
			this.characters.forEach(function (character) {
				character.draw(cxt);
			});
		}
	};
	
	return Player;
})();
