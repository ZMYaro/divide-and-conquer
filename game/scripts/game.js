var Game = (function () {
	// TODO: Replace this with customizable choices.
	/** {Array<Object<String, Object<String, Number>>>} Default key mappings for players */
	var KEY_MAPPINGS = [{
			movement: {
				up: 87, // W
				down: 83, // S
				left: 65, // A
				right: 68
			},
			shooting: {
				up: 73, // I
				down: 75, // K
				left: 74, // J
				right: 76 // L
			}
		}, {
			movement: {
				up: 38, // Up
				down: 40, // Down
				left: 37, // Left
				right: 39 // Right
			},
			shooting: {
				up: 104, // Numpad 8
				down: 101, // Numpad 5
				left: 100, // Numpad 4
				right: 102 // Numpad 6
			}
		}],
		COLORS = [
			new Color(192, 0, 128),
			new Color(0, 255, 255)
		];
	
	
	/**
	 * Initialize a new Game instance.
	 */
	function Game() {
		// Private variables
		this._canvas = document.getElementById('canvas');
		this._cxt = this._canvas.getContext('2d');
		this._km = new KeyManager();
		
		//this._map;
		this._players = [];
		
		this._boundUpdate = this.update.bind(this);
	}
	
	Game.prototype = {
		/**
		 * Start the game.
		 */
		start: function () {
			this._players = [
				new Player(KEY_MAPPINGS[0],
					Character.TIER_RADIUS[Character.DEFAULT_TIER] + 10,
					Character.TIER_RADIUS[Character.DEFAULT_TIER] + 10,
					COLORS[0]),
				new Player(KEY_MAPPINGS[1],
					canvas.width - Character.TIER_RADIUS[Character.DEFAULT_TIER] - 10,
					canvas.height - Character.TIER_RADIUS[Character.DEFAULT_TIER] - 10,
					COLORS[1])
			];
			
			Utils.raf(this._boundUpdate);
		},
		
		/**
		 * Update game entities and draw the next frame.
		 */
		update: function () {
			this._cxt.clearRect(0, 0, this._canvas.width, this._canvas.height);
			
			var that = this;
			this._players.forEach(function (player) {
				var keyStateMap = that._km.checkKeys(player.keyCodeMap);
				player.update(keyStateMap);
				player.draw(that._cxt);
			});
			
			Utils.raf(this._boundUpdate);
		}
	};
	
	return Game;
})();
