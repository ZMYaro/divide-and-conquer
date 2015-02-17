var Game = (function () {
	/**
	 * Initialize a new Game instance.
	 */
	function Game() {
		this.canvas = document.getElementById('canvas');
		this.cxt = this.canvas.getContext('2d');
		
		this.players = [];
		//this.map;
		
		this.boundUpdate = this.update.bind(this);
	}
	
	Game.prototype = {
		/**
		 * Start the game.
		 */
		start: function () {
			
			this.update();
		},
		
		/**
		 * Update game entities and draw the next frame.
		 */
		update: function () {
			
			Utils.raf(this.boundUpdate);
		}
	};
	
	return Game;
})();
