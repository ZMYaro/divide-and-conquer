var Bullet = (function () {
	'use strict';
	
	/**
	 * Check whether a point is inside a circle.
	 * @param {Number} px - The x-coordinate of the point
	 * @param {Number} py - The y-coordinate of the point
	 * @param {Number} cx - The x-coordinate of the center of the circle
	 * @param {Number} cy - The y-coordinate of the center of the circle
	 * @param {Number} cr - The radius of the circle
	 * @returns {Boolean} - Whether the point is in the circle
	 */
	function pointInCircle(px, py, cx, cy, cr) {
		return (new Vector2D(px, py, cx, cy)).length < cr;
	}
	
	/**
	 * Check whether a line segment goes through a circle.
	 * @param {Number} x1 - The first x-coordinate of the line segment
	 * @param {Number} y1 - The first y-coordinate of the line segment
	 * @param {Number} x2 - The second x-coordinate of the line segment
	 * @param {Number} y2 - The second y-coordinate of the line segment
	 * @param {Number} cx - The x-coordinate of the center of the circle
	 * @param {Number} cy - The y-coordinate of the center of the circle
	 * @param {Number} cr - The radius of the circle
	 * @returns {Boolean} - Whether the line intersects the circle
	 */
	function lineInCircle(x1, y1, x2, y2, cx, cy, cr) {
		/*if (x1 === x2 && y1 === y2) {
			return false;
		}
		var lineAngle = Math.atan2(-(y2 - y1), x2 - x1),
			hypotenuseLength = dist(cx, cy, x2, y2),
			hypotenuseAngle = Math.atan2(-(y2 - cy), x2 - cx),
			xPart = hypotenuseLength * Math.cos(hypotenuseAngle) * Math.cos(lineAngle),
			yPart = hypotenuseLength * Math.sin(hypotenuseAngle) * Math.sin(lineAngle),
			altitudeLength = Math.abs(xPart + yPart);
		
		return altitudeLength < cr;*/
		// TODO: Finish this function.
		return false;
	}
	
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
		this.sounds = {
			shoot: new Audio(),
			bounce: new Audio()
		};
		
		// Private variables
		this._pastPos = [];
		this.sounds.shoot.src = Bullet.SOUND_URLS.shoot;
		this.sounds.bounce.src = Bullet.SOUND_URLS.bounce;
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
	Bullet.SPEED = 12;
	/** {Number} The default bullet radius. */
	Bullet.RADIUS = 2;
	/** {String} The URLs of bullet sounds */
	Bullet.SOUND_URLS = {
		shoot: 'sounds/laser1.mp3',
		bounce: 'sounds/laser_bounce.mp3'
	};

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
			// Play the firing sound.
			this.sounds.shoot.play();
		},
		
		/**
		 */
		isColliding: function (x, y, radius) {
			return pointInCircle(this.x, this.y, x, y, radius) ||
				lineInCircle((this._pastPos[1] || this).x, (this._pastPos[1] || this).y,
					this.x, this.y,
					x, y, radius);
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
			var movementVector = Vector2D.fromPolar(Bullet.SPEED, this.heading);
			this.x += movementVector.x;
			this.y -= movementVector.y;
			
			// Add the new position to the bullet trail array.
			this._pastPos.splice(0, 0, {x: this.x, y: this.y});
			// Remove any unnecessary past positions, limiting the trail length
			// to a function of the bullet's health.
			var trailLength = this.health * this.health + 2;
			this._pastPos.splice(trailLength, this._pastPos.length);
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
			cxt.strokeStyle = this.color.hex;
			cxt.fillStyle = this.color.hex;
			cxt.shadowColor = 'transparent';
			cxt.lineWidth = 2 * Bullet.RADIUS;
			this._pastPos.forEach(function (pos, i, arr) {
				// Make the bullet trail fade out.
				cxt.globalAlpha = (arr.length - i) / arr.length;
				
				if (i > 0) {
					// Draw the part of the bullet trail.
					cxt.beginPath();
					cxt.moveTo(pos.x, pos.y);
					cxt.lineTo(arr[i - 1].x, arr[i - 1].y);
					cxt.stroke();
					cxt.closePath();
				} else {
					// Draw the ball at the end.
					cxt.beginPath();
					cxt.arc(pos.x, pos.y, Bullet.RADIUS, 0, 2 * Math.PI);
					cxt.closePath();
					cxt.fill();
				}
			});
			cxt.restore();
		}
	};
	
	return Bullet;
})();
