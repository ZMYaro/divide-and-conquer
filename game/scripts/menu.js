var Menu = (function () {
	'use strict';
	
	/**
	 * Initialize a new Menu.
	 * @param {HTMLElement} elem - The element for this menu screen
	 * @param {Menu} [parentMenu] - The next menu up, if any
	 */
	function Menu (elem, parentMenu) {
		// Private variables
		this._elem = elem;
		this.inputs = Array.prototype.slice.call(elem.querySelectorAll('button,input'));
		this.activeInputIndex = 0;
		this._parentMenu = parentMenu;
		
		this._boundKeyPressed = this._keyPressed.bind(this);
		
		// Give each input a reference to its containing menu.
		this.inputs.forEach(function (input) {
			input.menu = this;
			input.onfocus = function () {
				this.menu.activeInputIndex = this.menu.inputs.indexOf(this);
			};
		}, this);
	}
	
	/** {Array<Number>} The codes for keys that go back */
	Menu.BACK_KEYS = [
		8, // Backspace
		27 // Esc
	];
	/** {Array<Number>} The codes for keys that move down */
	Menu.DOWN_KEYS = [
		40, // Down arrow
		79, // O
		83  // S
	];
	/** {Array<Number>} The codes for keys that move up */
	Menu.UP_KEYS = [
		38, // Up arrow
		87, // W
		188 // Comma
	]; 
	
	Menu.prototype = {
		/**
		 * Handle key presses.
		 */
		_keyPressed: function (e) {
			if (Menu.DOWN_KEYS.indexOf(e.keyCode) !== -1) {
				e.preventDefault();
				this._moveDown();
			} else if (Menu.UP_KEYS.indexOf(e.keyCode) !== -1) {
				e.preventDefault();
				this._moveUp();
			} else if (Menu.BACK_KEYS.indexOf(e.keyCode) !== -1) {
				e.preventDefault();
				// Do not allow the top-level menu to be closed.
				if (this._parentMenu) {
					this.goBack();
				}
			}
		},
		
		/**
		 * Focus the next input down, wrapping at the bottom.
		 */
		_moveDown: function () {
			if (this.inputs.length === 0) {
				// If this menu has no inputs, just ensure nothing else has focus.
				document.activeElement.focus();
				return;
			}
			
			do {
				// Move the focus down one.
				this.activeInputIndex++;
				
				// Wrap at the bottom.
				if (this.activeInputIndex >= this.inputs.length) {
					this.activeInputIndex = 0;
				}
				
				// Keep going until the focused element is not an unchecked checkbox or radio button.
			} while ((this.inputs[this.activeInputIndex].type === 'checkbox' || this.inputs[this.activeInputIndex].type === 'radio') &&
				!this.inputs[this.activeInputIndex].checked);
			
			// Focus the input.
			this.inputs[this.activeInputIndex].focus();
		},
		
		/**
		 * Focus the next input up, wrapping at the top.
		 */
		_moveUp: function () {
			if (this.inputs.length === 0) {
				// If this menu has no inputs, just ensure nothing else has focus.
				document.activeElement.focus();
				return;
			}
			
			do {
				// Move the focus up one.
				this.activeInputIndex--;
				
				// Wrap at the top.
				if (this.activeInputIndex < 0) {
					this.activeInputIndex = this.inputs.length - 1;
				}
				
				// Keep going until the focused element is not an unchecked checkbox or radio button.
			} while ((this.inputs[this.activeInputIndex].type === 'checkbox' || this.inputs[this.activeInputIndex].type === 'radio') &&
				!this.inputs[this.activeInputIndex].checked);
			
			// Focus the input.
			this.inputs[this.activeInputIndex].focus();
		},
		
		/**
		 * Open the menu and enable its event listeners.
		 * @param {Menu} [parent] - The menu from which this menu was opened.
		 */
		open: function (parent) {
			// If an event listener has been added, fire the event.
			if (typeof(this.onopen) === 'function') {
				this.onopen();
			}
			if (parent) {
				// Set the parent menu if one was specified.
				this._parentMenu = parent;
				// If coming from a new parent menu, reset the active input.
				this.activeInputIndex = 0;
			}
			
			window.addEventListener('keydown', this._boundKeyPressed, false);
			this._elem.classList.add('active');
			
			// Focus the last focused input.
			this.activeInputIndex--;
			this._moveDown();
		},
		
		/**
		 * Close the menu and disable its event listeners.
		 */
		close: function () {
			// If an event listener has been added, fire the event.
			if (typeof(this.onclose) === 'function') {
				this.onclose();
			}
			window.removeEventListener('keydown', this._boundKeyPressed, false);
			this._elem.classList.remove('active');
		},
		
		/**
		 * Open a submenu.
		 * @param {Menu} submenu - The submenu to open.
		 */
		openSubmenu: function (submenu) {
			this.close();
			submenu.open(this);
		},
		
		/**
		 * Close the menu and return to the parent menu.
		 */
		goBack: function () {
			// Close the menu.
			this.close();
			
			// Open the parent menu, if any.
			if (this._parentMenu) {
				this._parentMenu.open();
			} else {
				console.error('Menu.goBack was called on a menu with no parent.');
			}
		}
	};
	
	return Menu;
})();