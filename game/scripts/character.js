var Character = (function () {
	'use strict';
	
	/**
	 * Calculate a heading based on keys pressed.
	 * @param {Object<String, Boolean>} - The states of the directional keys
	 * @returns {Number} - The heading in radians or undefined if there should be no movement
	 */
	function calcHeading(keys) {
		/*      pi/2
		 *   pi  +   0
		 *     3pi/2
		 */
		var heading;
		// Determine the character's heading based on key inputs.
		if (keys.right && !keys.left) {
			// Handle leftward movement.
			heading = 0;
			// Handle diagonal movement.
			heading += keys.up ? Math.PI * 0.25 : 0;
			heading -= keys.down ? Math.PI * 0.25 : 0;
		} else if (keys.left && !keys.right) {
			// Handle rightward movement.
			heading = Math.PI;
			// Handle diagonal movement.
			heading += keys.down ? Math.PI * 0.25 : 0;
			heading -= keys.up ? Math.PI * 0.25 : 0;
		} else if (keys.up && !keys.down) {
			// Handle upward movement.
			heading = Math.PI * 0.5;
		} else if (keys.down && !keys.up) {
			// Handle downward movement.
			heading = Math.PI * 1.5;
		}
		return heading;
	}
	
	/**
	 * Initialize a new Character.
	 * @param {Number} x - The character's starting x-coordinate.
	 * @param {Number} y - The character's starting y-coordinate.
	 * @param {Number} heading - The character's starting heading.
	 * @param {Color} color - The character's color.
	 * @param {Number} [tier] - The character's starting tier, if it is not the default.
	 */
	function Character(x, y, heading, color, tier) {
		// Public variables
		this.x = x;
		this.y = y;
		this.heading = heading;
		this.color = color;
		this.tier = tier || Character.DEFAULT_TIER;
		this.bullets = [];
		
		// Private variables
		this._health = Character.TIER_HEALTH[this.tier];
		
	}
	
	// Static constants
	/** {Number} The default starting tier. */
	Character.DEFAULT_TIER = 2;
	/** {Number} The default character movement speed. */
	Character.SPEED = 1;
	/** {Array<Number>} The hitbox radius of each tier. */
	Character.TIER_RADIUS = [
		8,
		12,
		16
	];
	/** {Array<Number>} The starting health of each tier. */
	Character.TIER_HEALTH = [
		1,
		2,
		4
	];
	
	Character.prototype = {
		// Private methods
		/**
		 * Handle character movement.
		 * @param {Object<String, Boolean>} moveKeys - The states of the key inputs related to movement.
		 */
		_move: function (moveKeys) {
			// Calculate the movement direction.
			var moveHeading = calcHeading(moveKeys);
			// Only proceed if there is a direction in which to move.
			if (typeof moveHeading !== 'undefined') {
				// Update the heading.
				this.heading = moveHeading;
				// Move.
				this.x += Character.SPEED * Math.cos(this.heading);
				this.y += Character.SPEED * -Math.sin(this.heading);
			}
		},
		
		/**
		* Shoot the Bullets 
		* @param {Object<String, Boolean>} shootKeys - The states of the key inputs related to shooting.
		*/
		_shoot: function (shootKeys) {
			// Calculate the shooting direction.
			var shootHeading = calcHeading(shootKeys);
			// Only proceed if a shot is to be fired.
			if (typeof shootHeading !== 'undefined') {
				// Update the heading.
				this.heading = shootHeading;
				// Fire the new bullet.
				this.bullets.push(new Bullet(this.x, this.y, shootHeading, this.color, this.tier));
			}
		},
		
		// Public methods
		/**
		 * Handle the actions a character may perform each frame.
		 * @param {Object<String, Object<String, Boolean>>} keys - The states of the key inputs that would affect the player.
		 */
		update: function (keys) {
			this._move(keys.movement);
			this._shoot(keys.shooting);
			for (var i = 0; i < this.bullets.length; i++) {
				this.bullets[i].update();
			}
		},

		/**
		 * Draw the character to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
			cxt.strokeStyle = 'black';
			cxt.lineWidth = 1;
			cxt.fillStyle = this.color.hex;
			cxt.beginPath();
			cxt.arc(this.x, this.y, Character.TIER_RADIUS[this.tier], 0, Math.PI * 2);
			cxt.closePath();
			cxt.fill();
			cxt.stroke();
			
			//draw the bullets
			for (var i = 0; i < this.bullets.length; i++) {
				this.bullets[i].draw(cxt);
			}
			
		}
		
		
		
	};
	
	return Character;
})();
