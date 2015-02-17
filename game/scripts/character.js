var Character = (function () {
	/**
	 * Initialize a new Character.
	 * @param {Number} x - The character's starting x-coordinate.
	 * @param {Number} y - The character's starting y-coordinate.
	 * @param {Color} color - The character's color.
	 * @param {Number} [tier] - The character's starting tier, if it is not the default.
	 */
	function Character(x, y, color, tier) {
		// Public variables.
		this.x = x;
		this.y = y;
		this.color = color;
		this.tier = tier || Character.DEFAULT_TIER;
		
		// Private variables.
		this._xSpeed = 0;
		this._ySpeed = 0;
		this._health = Character.TIER_HEALTH[this.tier];
	}
	
	// Static constants
	/** {Number} The default starting tier. */
	Character.DEFAULT_TIER = 2;
	/** {Array<Number>} The hitbox radius of each tier. */
	Character.TIER_RADIUS = [
		16,
		12,
		8
	];
	/** {Array<Number>} The starting health of each tier. */
	Character.TIER_HEALTH = [
		4,
		2,
		1
	];
	
	Character.prototype = {
		/**
		 * Handle the actions a character may perform each frame.
		 * @param {Object<String, Object<String, Boolean>>} keyStateMap - The states of the key inputs that would affect the player.
		 */
		update: function (keyStateMap) {
		},

		/**
		 * Draw the character to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
		}
	};
	
	return Character;
})();
