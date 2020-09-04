/// <reference path="Maze.ts"/>
/// <reference path="Solver.ts"/>
let maze: Maze;
let solver: Solver;

const startSpeed = document.createElement("button");
startSpeed.innerText = "Start Speed";
document.body.appendChild(startSpeed);

const startWatch = document.createElement("button");
startWatch.innerText = "Start Watch";
document.body.appendChild(startWatch);

const editSize = document.createElement("input");
editSize.title = "Size";
editSize.type = "number";
editSize.value = "25";
document.body.appendChild(editSize);

const editComplexity = document.createElement("input");
editComplexity.title = "Complexity";
editComplexity.type = "number";
editComplexity.value = "50";
document.body.appendChild(editComplexity);

const newMaze = document.createElement("button");
newMaze.innerText = "New Maze";
document.body.appendChild(newMaze);

startSpeed.addEventListener("click", () => {
  console.time("Solved in");
  solver = new Solver(maze);
  console.timeEnd("Solved in");
});

startWatch.addEventListener("click", () => {
  solver = new Solver(maze, 25);
});

newMaze.addEventListener("click", () => {
  maze.destroy();
  console.clear();
  maze = new Maze(Number(editSize.value), Number(editComplexity.value));
});

maze = new Maze();
