var Bullet = (function () {
	'use strict';
	
	/**
	 * Initialize a new Bullet.
	 * @param {Color} color - The bullet's color.
	 */
	function Bullet(color) {
		// Public variables
		this.x = undefined;
		this.y = undefined;
		this.heading = undefined;
		this.tier = -1;
		this.color = color;
		// Make the bullet start inactive.
		this.health = 0;
		
		// Private variables
		this._pastPos = [];
	}
	
	// Static constants.
	/** {Array<Number>} The starting health of each tier. */
	Bullet.TIER_HEALTH = [
		1,
		1,
		1
		// TODO: Re-enable tier bullet health.
		//2,
		//3
	];
	/** {Array<Number>} The length of the trail for each tier. */
	Bullet.TIER_TRAIL_LENGTH = [
		5,
		7,
		10
	];
	
	/** {Array<Number>} The damage done by each tier. */
	Bullet.TIER_DAMAGE = [
		1,
		2,
		4
	];
	/** {Number} The default bullet movement speed. */
	Bullet.SPEED = 4;
	/** {Number} The default bullet radius. */
	Bullet.RADIUS = 2;

	Bullet.prototype = {
		/**
		 * Fire the bullet.
		 * @param {Number} x - The bullet's starting x-coordinate.
		 * @param {Number} y - The bullet's starting y-coordinate.
		 * @param {Number} heading - direction the bullet is going
		 * @param {Number} tier - The bullet's tier.
		 */
		fire: function (x, y, heading, tier) {
			this.x = x;
			this.y = y;
			this.heading = heading;
			this.tier = tier;
			// Reset the bullet's health.
			this.health = Bullet.TIER_HEALTH[this.tier];
			// Reset the bullet's trail.
			this._pastPos = [];
		},
		
		/**
		 * Move the bullet.
		 */
		update: function () {
			// Do not update dead bullets.
			if (this.health <= 0) {
				return;
			}
			
			// Move the bullet.
			this.x += Bullet.SPEED * Math.cos(this.heading);
			this.y -= Bullet.SPEED * Math.sin(this.heading);
			
			// Add the new position to the bullet trail array.
			this._pastPos.splice(0, 0, {x: this.x, y: this.y});
			this._pastPos.splice(Bullet.TIER_TRAIL_LENGTH[this.tier], this._pastPos.length);
		},

		/**
		 * Draw the bullet to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
			// Do not draw dead bullets.
			if (this.health <= 0) {
				return;
			}
			cxt.save();
			cxt.fillStyle = this.color.hex;
			this._pastPos.forEach(function (pos, i, arr) {
				// Make the bullet trail fade out.
				cxt.globalAlpha = (arr.length - i) / arr.length;
				// Draw the part of the bullet trail.
				cxt.beginPath();
				cxt.arc(pos.x, pos.y, Bullet.RADIUS, 0, 2 * Math.PI);
				cxt.closePath();
				cxt.fill();
			});
			cxt.restore();
		}
	};
	
	return Bullet;
})();
