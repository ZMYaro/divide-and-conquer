var KeyManager = (function () {
	'use strict';
	
	var getGamepads = (navigator.getGamepads ||
		navigator.webkitGetGamepads ||
		function () {
			console.error('The gamepad API is not supported in this browser.');
		}).bind(navigator);
	
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
	
	// Static constants
	/** {Object<String, Number> An enum of input type names */
	KeyManager.INPUT_TYPES = {
		KEYBOARD: 0,
		GAMEPAD_ANALOG: 1,
		GAMEPAD_BUTTONS: 2
	};
	/** {Object<String, Number>} A map of button names to their key codes */
	KeyManager.GAMEPAD_MAP = {
		FACE_BOTTOM: 0, // Face buttons (A, B, X, Y on Xbox)
		FACE_RIGHT: 1,
		FACE_LEFT: 2,
		FACE_TOP: 3,
		LEFT_SHOULDER_TOP: 4, // Top shoulder buttons
		RIGHT_SHOULDER_TOP: 5,
		LEFT_SHOULDER_BOTTOM: 6, // Bottom shoulder buttons
		RIGHT_SHOULDER_BOTTOM: 7,
		SELECT: 8,
		START: 9,
		LEFT_ANALOG_BUTTON: 10, // Analog stick buttons
		RIGHT_ANALOG_BUTTON: 11,
		D_PAD_UP: 12, // Directional pad
		D_PAD_DOWN: 13,
		D_PAD_LEFT: 14,
		D_PAD_RIGHT: 15,
		LEFT_ANALOG_X: 0,
		LEFT_ANALOG_Y: 1,
		RIGHT_ANALOG_X: 2,
		RIGHT_ANALOG_Y: 3
	};
	/** {Number} How far an analog input must be pressed or tilted to register as on */
	KeyManager.GAMEPAD_ANALOG_THRESHOLD = 0.5;
	
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
		 * Remove all event listeners.
		 */
		removeEventListeners: function () {
			window.removeEventListener('keydown', this._boundKeyPressed, null);
			window.removeEventListener('keyup', this._boundKeyReleased, null);
		},
		
		/**
		 * Check whether a set of keys are pressed.
		 * @param {Object<String, Object<String, Number>>} keyCodeMap - A map of moving and shooting directions to key codes.
		 * @returns {Object<String, Object<String, Boolean>>} - The states of the keys.
		 */
		checkKeys: function (keyCodeMap) {
			// Create an Object to use as a map for the key state groups.
			var keyStateMap = {};
			
			if (keyCodeMap.type === KeyManager.INPUT_TYPES.GAMEPAD_ANALOG) {
				// If using analog sticks, create the entire key state map.
				var gamepad = getGamepads()[keyCodeMap.controllerId];
				keyStateMap = {
					movement: {
						up: gamepad.axes[KeyManager.GAMEPAD_MAP.LEFT_ANALOG_Y] < -KeyManager.GAMEPAD_ANALOG_THRESHOLD,
						down: gamepad.axes[KeyManager.GAMEPAD_MAP.LEFT_ANALOG_Y] > KeyManager.GAMEPAD_ANALOG_THRESHOLD,
						left: gamepad.axes[KeyManager.GAMEPAD_MAP.LEFT_ANALOG_X] < -KeyManager.GAMEPAD_ANALOG_THRESHOLD,
						right: gamepad.axes[KeyManager.GAMEPAD_MAP.LEFT_ANALOG_X] > KeyManager.GAMEPAD_ANALOG_THRESHOLD
					},
					shooting: {
						up: gamepad.axes[KeyManager.GAMEPAD_MAP.RIGHT_ANALOG_Y] < -KeyManager.GAMEPAD_ANALOG_THRESHOLD,
						down: gamepad.axes[KeyManager.GAMEPAD_MAP.RIGHT_ANALOG_Y] > KeyManager.GAMEPAD_ANALOG_THRESHOLD,
						left: gamepad.axes[KeyManager.GAMEPAD_MAP.RIGHT_ANALOG_X] < -KeyManager.GAMEPAD_ANALOG_THRESHOLD,
						right: gamepad.axes[KeyManager.GAMEPAD_MAP.RIGHT_ANALOG_X] > KeyManager.GAMEPAD_ANALOG_THRESHOLD
					}
				};
				console.log(gamepad.axes);
			} else {
				// Otherwise loop over the key groups.
				for (var keyGroup in keyCodeMap) {
					// Create an Object to use as a map for the key states.
					keyStateMap[keyGroup] = {};
					// Loop over the key codes.
					for (var key in keyCodeMap[keyGroup]) {
						// Get each key's state.
						if (keyCodeMap.type === KeyManager.INPUT_TYPES.KEYBOARD) {
							keyStateMap[keyGroup][key] = this._keyStates[keyCodeMap[keyGroup][key]];
						} else if (keyCodeMap.type == KeyManager.INPUT_TYPES.GAMEPAD_BUTTONS) {
							var gamepad = getGamepads()[keyCodeMap.controllerId];
							keyStateMap[keyGroup][key] = gamepad.buttons[keyCodeMap[keyGroup][key]].pressed ||
								gamepad.buttons[keyCodeMap[keyGroup][key]].value > KeyManager.GAMEPAD_ANALOG_THRESHOLD;
						}
					}
				}
			}
			return keyStateMap;
		}
	};
	
	return KeyManager;
})();
