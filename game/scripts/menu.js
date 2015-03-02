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
		this.buttons = Array.prototype.slice.call(elem.getElementsByTagName('button'));
		this.activeButtonIndex = 0;
		this._parentMenu = parentMenu;
		
		this._boundKeyPressed = this._keyPressed.bind(this);
		
		// Give each button a reference to its containing menu.
		this.buttons.forEach(function (button) {
			button.menu = this;
			button.onfocus = function () {
				this.menu.activeButtonIndex = this.menu.buttons.indexOf(this);
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
		 * Focus the next button down, wrapping at the bottom.
		 */
		_moveDown: function () {
			if (this.buttons.length === 0) {
				// If this menu has no buttons, just ensure nothing else has focus.
				document.activeElement.focus();
				return;
			}
			// Move the focus down one.
			this.activeButtonIndex++;
			// Wrap at the bottom.
			if (this.activeButtonIndex >= this.buttons.length) {
				this.activeButtonIndex = 0;
			}
			// Focus the button.
			this.buttons[this.activeButtonIndex].focus();
		},
		
		/**
		 * Focus the next button up, wrapping at the top.
		 */
		_moveUp: function () {
			if (this.buttons.length === 0) {
				// If this menu has no buttons, just ensure nothing else has focus.
				document.activeElement.focus();
				return;
			}
			// Move the focus up one.
			this.activeButtonIndex--;
			// Wrap at the top.
			if (this.activeButtonIndex < 0) {
				this.activeButtonIndex = this.buttons.length - 1;
			}
			// Focus the button.
			this.buttons[this.activeButtonIndex].focus();
		},
		
		/**
		 * Open the menu and enable its event listeners.
		 * @param {Menu} [parent] - The menu from which this menu was opened.
		 */
		open: function (parent) {
			if (parent) {
				// Set the parent menu if one was specified.
				this._parentMenu = parent;
				// If coming from a new parent menu, reset the active button.
				this.activeButtonIndex = 0;
			}
			
			window.addEventListener('keydown', this._boundKeyPressed, false);
			this._elem.classList.add('active');
			
			// Focus the last focused button.
			this.activeButtonIndex++;
			this._moveUp();
		},
		
		/**
		 * Close the menu and disable its event listeners.
		 */
		close: function () {
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