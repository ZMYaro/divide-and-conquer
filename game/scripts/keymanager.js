var KeyManager = (function () {
	'use strict';
	
	/**
	 * Initialize a new KeyManager.
	 */
	function KeyManager() {
		this._keyStates = [];
		this._boundKeyPressed = this._keyPressed.bind(this);
		this._boundKeyReleased = this._keyReleased.bind(this);
		window.addEventListener('keydown', this._boundKeyPressed, null);
		window.addEventListener('keyup', this._boundKeyReleased, null);
	}
	
	KeyManager.prototype = {
		/**
		 * Handle a key being pressed.
		 * @param {KeyboardEvent} e
		 * @private
		 */
		_keyPressed: function (e) {
			this._keyStates[e.keyCode] = true;
		},
		
		/**
		 * Handle a key being released.
		 * @param {KeyboardEvent} e
		 * @private
		 */
		_keyReleased: function (e) {
			this._keyStates[e.keyCode] = false;
		},
		
		/**
		 * Check whether a set of keys are pressed.
		 * @param {Object<String, Object<String, Number>>} keyCodeMap - A map of moving and shooting directions to key codes.
		 * @returns {Object<String, Object<String, Boolean>>} - The states of the keys.
		 */
		checkKeys: function (keyCodeMap) {
			// Create an Object to use as a map for the key state groups.
			var keyStateMap = {};
			// Loop over the key groups.
			for (var keyGroup in keyCodeMap) {
				// Create an Object to use as a map for the key states.
				keyStateMap[keyGroup] = {};
				// Loop over the key codes.
				for (var key in keyCodeMap[keyGroup]) {
					// Get each key's state.
					keyStateMap[keyGroup][key] = this._keyStates[keyCodeMap[keyGroup][key]];
				}
			}
			return keyStateMap;
		}
	};
	
	return KeyManager;
})();
