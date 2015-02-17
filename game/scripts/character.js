var Character = (function () {
	'use strict';
	
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
			/*      pi/2
			 *   pi  +   0
			 *     3pi/2
			 */
			// Determine the character's heading based on key inputs.
			if (moveKeys.right && !moveKeys.left) {
				// Handle leftward movement.
				this.heading = 0;
				// Handle diagonal movement.
				this.heading += moveKeys.up ? Math.PI * 0.25 : 0;
				this.heading -= moveKeys.down ? Math.PI * 0.25 : 0;
			} else if (moveKeys.left && !moveKeys.right) {
				// Handle rightward movement.
				this.heading = Math.PI;
				// Handle diagonal movement.
				this.heading += moveKeys.down ? Math.PI * 0.25 : 0;
				this.heading -= moveKeys.up ? Math.PI * 0.25 : 0;
			} else if (moveKeys.up && !moveKeys.down) {
				// Handle upward movement.
				this.heading = Math.PI * 0.5;
			} else if (moveKeys.down && !moveKeys.up) {
				// Handle downward movement.
				this.heading = Math.PI * 1.5;
			} else {
				// Do not move.
				return;
			}
			
			// Move.
			this.x += Character.SPEED * Math.cos(this.heading);
			this.y += Character.SPEED * -Math.sin(this.heading);
		},
		
		/**
		* Shoot the Bullets 
		* @param {Object<String, Boolean>} shootKeys - The states of the key inputs related to shooting.
		*/
		_shoot:  function (shootKeys) {
			
			/*      pi/2
			 *   pi  +   0
			 *     3pi/2
			 */
			 var bullet = {"x": this.x ,"y": this.y , "heading": 0 , "color": this.color ,"tier": this.tier};
			// Determine the bullets's heading based on key inputs.
			if (shootKeys.right && !shootKeys.left) {
				// Handle leftward shooting.
				bullet.heading = 0;
				// Handle diagonal shooting.
				bullet.heading += shootKeys.up ? Math.PI * 0.25 : 0;
				bullet.heading -= shootKeys.down ? Math.PI * 0.25 : 0;
				//add the bullet to the array of bullets
				this.bullets.push(bullet);
			} else if (shootKeys.left && !shootKeys.right) {
				// Handle rightward shooting.
				bullet.heading = Math.PI;
				// Handle diagonal shooting.
				bullet.heading += shootKeys.down ? Math.PI * 0.25 : 0;
				bullet.heading -= shootKeys.up ? Math.PI * 0.25 : 0;
				//add the bullet to the array of bullets
				this.bullets.push(bullet);
			} else if (shootKeys.up && !shootKeys.down) {
				// Handle upward shooting.
				bullet.heading = Math.PI * 0.5;
				//add the bullet to the array of bullets
				this.bullets.push(bullet);
			} else if (shootKeys.down && !shootKeys.up) {
				// Handle downward shooting.
				bullet.heading = Math.PI * 1.5;
				//add the bullet to the array of bullets
				this.bullets.push(bullet);
			} else {
				// Do not shoot.
				//console.log(this.bullets);
				return;
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
		}
		
		
		
	};
	
	return Character;
})();
