var Game = (function () {
	function Game() {
		this.canvas = document.getElementById('canvas');
		this.cxt = this.canvas.getContext('2d');
		
		this.players = [];
		//this.map;
		
		this.boundUpdate = this.update.bind(this);
	}
	
	Game.prototype.start = function () {
		
		this.update();
	};
	
	Game.prototype.update = function () {
		
		Utils.raf(this.boundUpdate);
	};
	
	return Game;
})();