(function () {
	'use strict';
	
	var KEY_MAPPINGS = {
			WASD_TFGH: {
				id: 'WASD_TFGH',
				type: KeyManager.INPUT_TYPES.KEYBOARD,
				movement: {
					up: 87, // W
					down: 83, // S
					left: 65, // A
					right: 68, // D
					label: 'Keyboard WASD'
				},
				shooting: {
					up: 84, // T
					down: 71, // G
					left: 70, // F
					right: 72, // H
					label: 'Keyboard TGFH'
				}
			},
			WASD_IJKL: {
				id: 'WASD_IJKL',
				type: KeyManager.INPUT_TYPES.KEYBOARD,
				movement: {
					up: 87, // W
					down: 83, // S
					left: 65, // A
					right: 68, // D
					label: 'Keyboard WASD'
				},
				shooting: {
					up: 73, // I
					down: 75, // J
					left: 74, // K
					right: 76, // L
					label: 'Keyboard IJKL'
				}
			},
			IJKL_ARROWS: {
				id: 'IJKL_ARROWS',
				type: KeyManager.INPUT_TYPES.KEYBOARD,
				movement: {
					up: 73, // I
					down: 75, // J
					left: 74, // K
					right: 76, // L
					label: 'Keyboard IJKL'
				},
				shooting: {
					up: 38, // Up
					down: 40, // Down
					left: 37, // Left
					right: 39, // Right
					label: 'Arrow keys'
				}
			},
			ARROWS_NUMPAD: {
				id: 'ARROWS_NUMPAD',
				type: KeyManager.INPUT_TYPES.KEYBOARD,
				movement: {
					up: 38, // Up
					down: 40, // Down
					left: 37, // Left
					right: 39, // Right
					label: 'Arrow keys'
				},
				shooting: {
					up: 104, // Numpad 8
					down: 101, // Numpad 5
					left: 100, // Numpad 4
					right: 102, // Numpad 6
					label: 'Numpad 8456'
				}
			},
			GAMEPAD_BUTTONS: {
				id: 'GAMEPAD_BUTTONS',
				type: KeyManager.INPUT_TYPES.GAMEPAD_BUTTONS,
				movement: {
					up: KeyManager.GAMEPAD_MAP.D_PAD_UP,
					down: KeyManager.GAMEPAD_MAP.D_PAD_DOWN,
					left: KeyManager.GAMEPAD_MAP.D_PAD_LEFT,
					right: KeyManager.GAMEPAD_MAP.D_PAD_RIGHT,
					label: 'Controller D-pad'
				},
				shooting: {
					up: KeyManager.GAMEPAD_MAP.FACE_TOP,
					down: KeyManager.GAMEPAD_MAP.FACE_BOTTOM,
					left: KeyManager.GAMEPAD_MAP.FACE_LEFT,
					right: KeyManager.GAMEPAD_MAP.FACE_RIGHT,
					label: 'Controller ABXY'
				}
			},
			GAMEPAD_ANALOG: {
				id: 'GAMEPAD_ANALOG',
				type: KeyManager.INPUT_TYPES.GAMEPAD_ANALOG,
				movement: {
					label: 'Controller left stick'
				},
				shooting: {
					label: 'Controller right stick'
				}
			}
		},
		DEFAULTS = {
			music: 'on',
			p1Controls: KEY_MAPPINGS.WASD_TFGH,
			p2Controls: KEY_MAPPINGS.IJKL_ARROWS
		};
	
	function applySettings() {
		// Toggle the music if the setting has changed.
		localStorage[LOCAL_STORAGE_PREFIX + 'music'] = this.musicSetting.value;
		if (this.musicSetting.value === 'on') {
			document.getElementById('menuMusic').play();
		} else {
			document.getElementById('menuMusic').pause();
			document.getElementById('menuMusic').currentTime = 0;
		}
		
		// Set the key displays and key code maps.
		var p1Controls = KEY_MAPPINGS[this.p1ControlsSetting.value],
			p2Controls = KEY_MAPPINGS[this.p2ControlsSetting.value];
		p1Controls.controllerId = this.p1ControllerSetting.value;
		p2Controls.controllerId = this.p2ControllerSetting.value;
		document.getElementById('p1Movement').innerHTML = p1Controls.movement.label;
		document.getElementById('p1Shooting').innerHTML = p1Controls.shooting.label;
		document.getElementById('p2Movement').innerHTML = p2Controls.movement.label;
		document.getElementById('p2Shooting').innerHTML = p2Controls.shooting.label;
		// Update conditional controls.
		if (p1Controls.controllerId == -1) {
			// Player 1 selected the keyboard.
			document.getElementById('p1GamepadControls').style.display = 'none';
			document.getElementById('p1KeyboardControls').style.display = 'block';
			if (p1Controls.id === KEY_MAPPINGS.GAMEPAD_ANALOG.id ||
					p1Controls.id === KEY_MAPPINGS.GAMEPAD_BUTTONS.id) {
				p1Controls = DEFAULTS.p1Controls;
				this.p1ControlsSetting.value = p1Controls.id;
			}
		} else {
			// Player 1 selected a gamepad.
			document.getElementById('p1KeyboardControls').style.display = 'none';
			document.getElementById('p1GamepadControls').style.display = 'block';
			if (p1Controls.id !== KEY_MAPPINGS.GAMEPAD_ANALOG.id &&
					p1Controls.id !== KEY_MAPPINGS.GAMEPAD_BUTTONS.id) {
				p1Controls = KEY_MAPPINGS.GAMEPAD_ANALOG;
				this.p1ControlsSetting.value = p1Controls.id;
			}
		}
		if (p2Controls.controllerId == -1) {
			// Player 2 selected the keyboard.
			document.getElementById('p2GamepadControls').style.display = 'none';
			document.getElementById('p2KeyboardControls').style.display = 'block';
			if (p2Controls.id === KEY_MAPPINGS.GAMEPAD_ANALOG.id ||
					p2Controls.id === KEY_MAPPINGS.GAMEPAD_BUTTONS.id) {
				p2Controls = DEFAULTS.p2Controls;
				this.p2ControlsSetting.value = p2Controls.id;
			}
		} else {
			// Player 2 selected a gamepad.
			document.getElementById('p2KeyboardControls').style.display = 'none';
			document.getElementById('p2GamepadControls').style.display = 'block';
			if (p2Controls.id !== KEY_MAPPINGS.GAMEPAD_ANALOG.id &&
					p2Controls.id !== KEY_MAPPINGS.GAMEPAD_BUTTONS.id) {
				p2Controls = KEY_MAPPINGS.GAMEPAD_ANALOG;
				this.p2ControlsSetting.value = p2Controls.id;
			}
		}
		
		localStorage.p1Controls = p1Controls;
		localStorage.p2Controls = p2Controls;
		playerKeyCodeMaps = [
			p1Controls,
			p2Controls
		];
	}
	
	window.addEventListener('load', function () {
		// Get the options menu.
		var settingsMenu = document.getElementById('settingsMenu');
		settingsMenu.onsubmit = function (e) {
			e.preventDefault();
			e.stopPropagation();
		};
		// Set the menu to update localStorage when it changes.
		settingsMenu.onchange = applySettings;
		
		// For each setting, fetch it from localStorage and update the UI.
		settingsMenu.musicSetting.value = localStorage[LOCAL_STORAGE_PREFIX + 'music'] || DEFAULTS.music;
		
		var p1Controls = localStorage[LOCAL_STORAGE_PREFIX + 'p1Controls'] || DEFAULTS.p1Controls;
		if (typeof(p1Controls) === 'string') {
			p1Controls = JSON.parse(p1Controls);
		}
		settingsMenu.p1ControlsSetting.value = p1Controls.id;
		settingsMenu.p1ControllerSetting.value = p1Controls.controllerId;
		
		var p2Controls = localStorage[LOCAL_STORAGE_PREFIX + 'p2Controls'] || DEFAULTS.p2Controls;
		if (typeof(p2Controls) === 'string') {
			p2Controls = JSON.parse(p2Controls);
		}
		settingsMenu.p2ControlsSetting.value = p2Controls.id;
		settingsMenu.p2ControllerSetting.value = p2Controls.controllerId;
		
		// Effect the settings.
		applySettings.call(settingsMenu);
	}, false);
})();