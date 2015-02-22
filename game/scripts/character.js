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
	 * @param {Player} player - The player who owns this character
	 * @param {Number} x - The character's starting x-coordinate
	 * @param {Number} y - The character's starting y-coordinate
	 * @param {Number} heading - The character's starting heading
	 * @param {Color} color - The character's color
	 * @param {Number} [tier] - The character's starting tier, if it is not the default
	 */
	function Character(player, x, y, heading, color, tier) {
		// Public variables
		this.x = x;
		this.y = y;
		this.heading = heading;
		this.color = color;
		this.tier = typeof tier === 'undefined' ? Character.DEFAULT_TIER : tier;
		this.bullets = [];
		for (var i = 0; i < Character.BULLET_COUNT; i++) {
			this.bullets.push(new Bullet(this.color));
		}
		
		// Private variables
		this._player = player;
		this._health = Character.TIER_HEALTH[this.tier];
		this._bulletTimer = 0;
		this._invincibilityTimer = Character.POST_HIT_INVINCIBILITY;
	}
	
	// Static constants
	/** {Number} The number of bullets each character has */
	Character.BULLET_COUNT = 5;
	/** {Number} The delay between shots. */
	Character.BULLET_DELAY = 10;
	/** {Number} How long to remain invincible after taking damage. */
	Character.POST_HIT_INVINCIBILITY = 20;
	/** {Number} The default starting tier */
	Character.DEFAULT_TIER = 2;
	/** {Number} The default character movement speed */
	Character.SPEED = 1;
	/** {Array<Number>} The hitbox radius of each tier */
	Character.TIER_RADIUS = [
		8,
		12,
		16
	];
	/** {Array<Number>} The starting health of each tier */
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
			// Decrease the bullet timer if it is not zero.
			if (this._bulletTimer > 0) {
				this._bulletTimer--;
			}
			
			// Calculate the shooting direction.
			var shootHeading = calcHeading(shootKeys);
			// Only proceed if a shot is to be fired.
			if (typeof shootHeading !== 'undefined') {
				// Update the heading.
				this.heading = shootHeading;
				// Quit if it is not time to fire again.
				if (this._bulletTimer > 0) {
					return;
				}
				// Fire the next available bullet if there is one.
				for (var i = 0; i < this.bullets.length; i++) {
					if (this.bullets[i].health === 0) {
						this.bullets[i].fire(this.x, this.y, this.heading, this.tier);
						this._bulletTimer = Character.BULLET_DELAY;
						return;
					}
				}
			}
		},
		
		// Public methods
		/**
		 * Take an amount of damage and respond appropriately.
		 * @param {Number} damage - The amount of damage to take.
		 */
		takeDamage: function (damage) {
			// Do not take damage while invincible.
			if (this._invincibilityTimer > 0) {
				return;
			}
			this._health -= damage;
			if (this._health <= 0) {
				this.tier--;
				// If not dead, split.
				if (this.tier > -1) {
					// Become a character of the next tier down.
					this._health = Character.TIER_HEALTH[this.tier];
					this._invincibilityTimer = Character.POST_HIT_INVINCIBILITY;
					// Add another character of the new tier.
					this._player.addCharacter(this.x + (Character.TIER_RADIUS[this.tier] * Math.cos(this.heading + (Math.PI * 0.5))),
						this.y - (Character.TIER_RADIUS[this.tier] * Math.sin(this.heading + (Math.PI * 0.5))),
						this.heading,
						this.tier);
					// Shift this character to make room for the new one.
					this.x += (Character.TIER_RADIUS[this.tier] * Math.cos(this.heading + (Math.PI * 1.5)));
					this.y -= (Character.TIER_RADIUS[this.tier] * Math.sin(this.heading + (Math.PI * 1.5)));
				}
			}
		},
		
		/**
		 * Handle the actions a character may perform each frame.
		 * @param {Object<String, Object<String, Boolean>>} keys - The states of the key inputs that would affect the player.
		 */
		update: function (keys) {
			// Do not update dead characters.
			if (this._health <= 0) {
				return;
			}
			this._move(keys.movement);
			this._shoot(keys.shooting);
			this.bullets.forEach(function (bullet) {
				bullet.update();
			});
			// Decrease the invincibility timer while invincible.
			if (this._invincibilityTimer > 0) {
				this._invincibilityTimer--;
			}
		},

		/**
		 * Draw the character to the canvas.
		 * @param {CanvasRenderingContext2D} cxt - The drawing context for the game canvas
		 */
		draw: function (cxt) {
			// Do not draw dead characters.
			if (this._health <= 0) {
				return;
			}
			
			// Draw the bullets.
			this.bullets.forEach(function (bullet) {
				bullet.draw(cxt);
			});
			
			
			// Flicker when invincible.
			if (this._invincibilityTimer % 2 === 1) {
				cxt.strokeStyle = 'transparent';
				cxt.fillStyle = 'transparent';
			} else {
				cxt.strokeStyle = 'black';
				cxt.fillStyle = this.color.hex;
			}
			
			// Draw the character's arms.
			cxt.lineWidth = 2;
			// Draw the left arm.
			cxt.beginPath();
			cxt.arc(this.x + (1.2 * Character.TIER_RADIUS[this.tier] * Math.cos(this.heading - Math.PI * 0.2)),
				this.y - (1.2 * Character.TIER_RADIUS[this.tier] * Math.sin(this.heading - Math.PI * 0.2)),
				Character.TIER_RADIUS[this.tier],
				-this.heading + Math.PI * 0.5,
				-this.heading + Math.PI);
			cxt.stroke();
			cxt.closePath();
			// Draw the right arm.
			cxt.beginPath();
			cxt.arc(this.x + (1.2 * Character.TIER_RADIUS[this.tier] * Math.cos(this.heading + Math.PI * 0.2)),
				this.y - (1.2 * Character.TIER_RADIUS[this.tier] * Math.sin(this.heading + Math.PI * 0.2)),
				Character.TIER_RADIUS[this.tier],
				-this.heading - Math.PI,
				-this.heading - Math.PI * 0.5);
			cxt.stroke();
			cxt.closePath();
			
			// Draw the character.
			cxt.lineWidth = 1;
			cxt.beginPath();
			cxt.arc(this.x, this.y, Character.TIER_RADIUS[this.tier], 0, 2 * Math.PI);
			cxt.closePath();
			cxt.fill();
			cxt.stroke();
			// Indicate the front of the character.
			cxt.beginPath();
			cxt.moveTo(this.x, this.y);
			cxt.lineTo(this.x + (Character.TIER_RADIUS[this.tier] * Math.cos(this.heading)),
				this.y - (Character.TIER_RADIUS[this.tier] * Math.sin(this.heading)));
			cxt.closePath();
			cxt.stroke();
		}
	};
	
	return Character;
})();
