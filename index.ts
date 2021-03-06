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
editSize.min = "5";
editSize.max = "500";
document.body.appendChild(editSize);
editSize.addEventListener("change", (ev) => {
  mazeSize = Number((<HTMLInputElement>ev.target).value);
});

const newMaze = document.createElement("button");
newMaze.innerText = "New Maze";
document.body.appendChild(newMaze);

startSpeed.addEventListener("click", () => {
  newMaze.disabled = true;
  console.clear();
  solver = new Solver(maze);
  console.time("Solved in");
  solver.solve().finally(() => {
    console.timeEnd("Solved in");
    newMaze.disabled = false;
  });
});

startWatch.addEventListener("click", () => {
  newMaze.disabled = true;
  console.clear();
  solver = new Solver(maze, 15);
  solver.solve().finally(() => {
    newMaze.disabled = false;
  });
});

newMaze.addEventListener("click", () => {
  if (newMaze.disabled) {
    alert("Please wait until the solver has finished");
  } else {
    if (maze) maze.destroy();
    console.clear();
    maze = new Maze(mazeSize);
  }
});

maze = new Maze(mazeSize);
