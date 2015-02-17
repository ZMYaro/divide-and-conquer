var Bullet = (function () {
	/**
	 * Initialize a new Bullet.
	 * @param {Number} x - The bullet's starting x-coordinate.
	 * @param {Number} y - The bullet's starting y-coordinate.
	 * @param {Number} xSpeed - The bullet's starting x-speed.
	 * @param {Number} ySpeed - The bullet's starting y-speed.
	 * @param {Color} color - The bullet's color.
	 * @param {Number} tier - The bullet's tier.
	 */
	function Bullet(x, y, xSpeed, ySpeed, color, tier) {
		// Public variables
		this.x = x;
		this.y = y;
		this.xSpeed = xSpeed;
		this.ySpeed = ySpeed;
		this.color = color;
		this.tier = tier;
		
		// Private variables
		this._health = Bullet.TIER_HEALTH[this.tier];
		
	}
	
	// Static constants.
	/** {Array<Number>} The starting health of each tier. */
	Bullet.TIER_HEALTH = [
		3,
		2,
		1
	];
	/** {Array<Number>} The damage done by each tier. */
	Bullet.TIER_DAMAGE = [
		4,
		2,
		1
	];

	Bullet.prototype = {
		/**
		 * Move the bullet.
		 */
		update: function () {
		},

		/**
		 * Draw the bullet to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
		}
	};
	
	return Bullet;
})();
