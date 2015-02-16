Utils = {};

/**
 * A shim to make requestAnimationFrame work in more browsers.
 * Credit to Paul Irish.
 */
Utils.raf = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function (func) { setTimeout(func, 1 / 60); };
