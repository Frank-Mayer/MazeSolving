/// <reference path="Maze.ts"/>
/// <reference path="Vector.ts"/>
class Solver {
  maze: Maze;
  pos: Vector2D;
  path: Array<Vector2D>;
  solved: boolean;
  constructor(m: Maze) {
    this.solved = false;
    this.maze = m;
    this.pos = this.maze.start;
    this.path = new Array<Vector2D>(this.pos);
    this.maze.path = this.path;
    this.solve();
  }

  solve() {
    this.step();
  }

  step() {
    let step;
    for (step = 0; step < 500 && !this.solved; step++) {
      this.findWalkablePath();
      this.maze.drawToCanvas();
    }
    if (this.solved) {
      console.log(`Solved in ${step} steps`);
    } else {
      console.error(`Not solved after ${step} steps`);
    }
  }

  findWalkablePath() {
    let tests = [
      new Vector2D(0, 1),
      new Vector2D(-1, 0),
      new Vector2D(1, 0),
      new Vector2D(0, -1),
    ];
    for (let i of tests) {
      let j = this.pos.add(i);
      if (this.maze.posIsInMaze(j) && this.maze.data[j.y][j.x]) {
        this.pos = j;
        this.path.push(j);
        if (j.y === this.maze.size - 1) {
          this.solved = true;
        }
        break;
      }
    }
  }
}
