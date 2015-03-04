(function () {
	'use strict';
	
	var DEFAULTS = {
			music: 'on'
		};
	
	function applySettings() {
		// Save the changed settings to localStorage.
		for (var setting in DEFAULTS) {
			localStorage[LOCAL_STORAGE_PREFIX + setting] = this[setting + 'Setting'].value;
		}
		// Toggle the music if the setting has changed.
		if (this.musicSetting.value === 'on') {
			document.getElementById('menuMusic').play();
		} else {
			document.getElementById('menuMusic').pause();
			document.getElementById('menuMusic').currentTime = 0;
		}
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
		for (var setting in DEFAULTS) {
			settingsMenu[setting + 'Setting'].value = localStorage[LOCAL_STORAGE_PREFIX + setting] || DEFAULTS[setting];
		}
		
		// Effect the settings.
		applySettings.call(settingsMenu);
	}, false);
})();