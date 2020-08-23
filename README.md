<p align="center">
  <a href="https://github.com/sid-sr/Q-Snake">
    <img src="./src/img/cyborg-25.png" width=250>
  </a>
</p>

<p align="center">
    <h1 align='center'> Q-Snake </h1>
</p>
<h4 align='center'>A Q-learning web visualiser for Snake written using react.js </h4>

<p align="center">
  <a href='https://lbesson.mit-license.org/'>
  <img src='https://img.shields.io/badge/License-MIT-blue.svg'>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#acknowledgements">Acknowledgements</a>
</p>
 
---
## About
<table>
<tr>
<td>
• A website that visualises the Q-learning RL algorithm and shows how an AI agent can learn to play Snake using it. <br>
• Written in JavaScript using React.js with zero reinforcement learning libraries/environments. <br>
• Uses a simplified state representation to ensure learning is fast, this converts it into more of a planning problem than RL, but the goal was just to visualise the RL algorithm within a reasonable training duration.
</td>
</tr>
</table>

## Features


## Installation
##### If you would like to tweak the algorithm locally:

* Clone the repository.
* Run ```npm -i install```.
* Modify hyperparameters in ```./src/Board.js```.
* Run ```npm start```.


## Acknowledgements

* Excellent explanation on how different rewards can affect the time taken to converge to the optimal Q values: <br>
[AI learns to play SNAKE using Reinforcement Learning](https://youtu.be/8cdUree20j4)