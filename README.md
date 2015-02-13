# Divide And Conquer
========

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


## About the developers

*Bobby Pruden* - Third year NMID major at RIT.  Enjoys playing casual games and is excited to begin this project.
*Zachary Yaro* - Third year GDD major + SE minor at RIT. Game and software designer and developer with over eight years of web development experience.  Enjoys playing a wide variety of video games.