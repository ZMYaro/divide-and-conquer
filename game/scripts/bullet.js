var Bullet = (function () {
	'use strict';
	
	/**
	 * Initialize a new Bullet.
	 * @param {Number} x - The bullet's starting x-coordinate.
	 * @param {Number} y - The bullet's starting y-coordinate.
	 * @param {Number} heading - direction the bullet is going
	 * @param {Color} color - The bullet's color.
	 * @param {Number} tier - The bullet's tier.
	 */
	function Bullet(x, y, heading, color, tier) {
		// Public variables
		this.x = x;
		this.y = y;
		this.heading = heading;
		this.color = color;
		this.tier = tier;
		
		// Private variables
		this._health = Bullet.TIER_HEALTH[this.tier];
		
	}
	
	// Static constants.
	/** {Array<Number>} The starting health of each tier. */
	Bullet.TIER_HEALTH = [
		1,
		2,
		3
	];
	/** {Array<Number>} The damage done by each tier. */
	Bullet.TIER_DAMAGE = [
		1,
		2,
		4
	];
	/** {Number} The default bullet movement speed. */
	Bullet.SPEED = 2;

	Bullet.prototype = {
		/**
		 * Move the bullet.
		 */
		update: function () {
			this.x += Math.cos(heading) *Bullet.SPEED;
			this.y += Math.sin(heading) *Bullet.SPEED;
		},

		/**
		 * Draw the bullet to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
			cxt.drawArc(Bullet.x, Bullet.y, 2, 0, 360);
		}
	};
	
	return Bullet;
})();
