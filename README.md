# Divide And Conquer

## General concept

A mulitplayer top-down third-person shooter with player duplication mechanics.


## Platform

Ideally, _Divide And Conquer_ should support any device with a web browser and a keyboard, but it primarily targets desktop PCs.


## Gameplay

### Mechanics

* Players can move and shoot in eight directions.
* Shots can ricochet off walls and hit multiple targets.
  - Each shot “dies” after hitting a certain number of obstacles.
* There exist three tiers of players, each smaller and less powerful than the last.
  - Each tier is smaller than, deals half the damage of, and fires shots than can hit two less obstacles than the previous tier.
* When a tier 1 or 2 player dies, he/she splits into two of the next tier.
* When a tier 3 player dies, he/she permadies.
* Clones respond to input simultaneously.
* Some power-ups can clone players without reducing them to the next tier.

### Control
* Keyboard - WASD + IJKL (QWERTY), ,AOE + CHTN (Dvorak), arrow keys + numpad
* May support game controllers in the future


## Code styling

* Commits should follow [standard Git commit guidelines](http://git-scm.com/book/ch5-2.html#Commit-Guidelines).
  - Commits should fit in the sentence, “If applied, this commit will ___.”
* Code will be intended with tabs, not spaces.
* Opening curly braces will be on the same line as control structures (`if`, `switch`, `for`, `function`, etc.), separated with a space, and never on the next line.
* Function and variable names will be in camelCase.
* Constants will be in ALL_CAPS.
* Object types will be in UpperCamelCase.
* Operators will have spaces on both sides.
* Functions should have documentation strings.  For example:

```
/**
 * Adds two numbers.
 * @param {Number} a - The first number to be added
 * @param {Number} b - The second number to be added
 * @returns {Number} The sum of a and b
 */
function sum(a, b) { ... }
```
    


## About the developers

*Bobby Pruden* - Third year NMID major at RIT.  Enjoys playing casual games and is excited to begin this project. Really enjoys JS as a language. Enjoys playing FPS and cooperative games.
*Zachary Yaro* - Third year GDD major + SE minor at RIT. Game and software designer and developer with over eight years of web development experience.  Enjoys playing a wide variety of video games.
