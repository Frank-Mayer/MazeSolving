/// <reference path="Maze.ts"/>
/// <reference path="Solver.ts"/>
let maze: Maze;
let solver: Solver;
let mazeSize = 100;
let mazeComplexity = 100;

const startSpeed = document.createElement("button");
startSpeed.innerText = "Start Speed";
document.body.appendChild(startSpeed);

const startWatch = document.createElement("button");
startWatch.innerText = "Start Watch";
document.body.appendChild(startWatch);

const editSize = document.createElement("input");
editSize.title = "Size";
editSize.type = "number";
editSize.value = mazeSize.toString();
document.body.appendChild(editSize);
editSize.addEventListener("change", (ev) => {
  mazeSize = Number((<HTMLInputElement>ev.target).value);
});

const editComplexity = document.createElement("input");
editComplexity.title = "Complexity";
editComplexity.type = "number";
editComplexity.value = mazeComplexity.toString();
document.body.appendChild(editComplexity);
editComplexity.addEventListener("change", (ev) => {
  mazeComplexity = Number((<HTMLInputElement>ev.target).value);
});

const newMaze = document.createElement("button");
newMaze.innerText = "New Maze";
document.body.appendChild(newMaze);

startSpeed.addEventListener("click", () => {
  solver = new Solver(maze);
  console.time("Solved in");
  solver.solve().finally(() => console.timeEnd("Solved in"));
});

startWatch.addEventListener("click", () => {
  solver = new Solver(maze, 10);
  solver.solve();
});

newMaze.addEventListener("click", () => {
  maze.destroy();
  console.clear();
  maze = new Maze(mazeSize, mazeComplexity);
});

maze = new Maze(mazeSize, mazeComplexity);
