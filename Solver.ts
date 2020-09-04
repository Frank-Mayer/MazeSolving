/// <reference path="Maze.ts"/>
/// <reference path="Vector.ts"/>
/// <reference path="miscellanies.ts"/>
class Solver {
  maze: Maze; // Reference to Maze object
  delay: number | undefined;
  pos: Vector2D; // Current Possition
  path: Array<Vector2D>; // Path to be drawn on the canvas
  crossings: Array<Vector2D>; // Locations of the passed crossings
  possibleDeadEnds: Array<Vector2D>; // Taken path after a crossing
  possibleDeadEndReturns: Array<Vector2D>; // Taken path after a crossing
  takenPaths: SortedList<string>; // Storage of which paths have already been taken
  deadEnds: SortedList<string>; // Storage of discovered dead ends
  solved: boolean; // End found?
  constructor(m: Maze, delay: number = 0) {
    if (delay > 0) {
      this.delay = delay;
    }
    this.solved = false;
    this.maze = m;
    this.pos = this.maze.start;
    this.path = new Array<Vector2D>(this.pos);
    this.maze.path = this.path;
    this.crossings = new Array<Vector2D>();
    this.possibleDeadEnds = new Array<Vector2D>();
    this.possibleDeadEndReturns = new Array<Vector2D>();
    this.takenPaths = new SortedList<string>();
    this.deadEnds = new SortedList<string>();
    this.solve();
  }

  async solve() {
    let step;
    for (step = 0; step < 50000 && !this.solved; step++) {
      if (this.step()) {
        this.maze.drawToCanvas(this.pos);
        if (this.pos.y === this.maze.size - 1) {
          this.solved = true;
          break;
        } else if (this.delay) {
          await sleep(this.delay);
        }
        this.deadEnds.add(newDeadEnd.toString());
      } else {
        if (this.possibleDeadEnds.length > 0) {
          let newDeadEnd = <Vector2D>this.possibleDeadEnds.pop();
          this.pos = <Vector2D>this.possibleDeadEndReturns.pop();
          let newPosIndex = this.path.indexOf(this.pos) + 1;
          this.path.splice(newPosIndex, this.path.length - newPosIndex);
        }
      }
    }
    if (this.solved) {
      console.log(`Took ${step} steps`);
    } else {
      throw new Error(`Not solved after ${step} steps`);
    }
    await sleep(25);
    this.maze.drawToCanvas();
  }

  step(): boolean {
    let options = this.findWalkablePaths();
    let isCrossing = false;
    if (options.length > 1) {
      this.crossings.push(this.pos);
      isCrossing = true;
    }
    for (let path of options) {
      let pathStr = path.toString();
      if (this.doiWantToWalkHere(pathStr)) {
        if (isCrossing) {
          this.possibleDeadEnds.push(path);
          this.possibleDeadEndReturns.push(this.pos);
        }
        this.takenPaths.add(pathStr);
        this.path.push(path);
        this.pos = path;
        return true;
      }
    }
    return false;
  }

  findWalkablePaths(): Array<Vector2D> {
    let r = new Array<Vector2D>();
    let options = [
      new Vector2D(0, 1),
      new Vector2D(-1, 0),
      new Vector2D(1, 0),
      new Vector2D(0, -1),
    ];
    for (let i of options) {
      let j = this.pos.add(i);
      if (this.maze.posIsInMaze(j) && this.maze.data[j.y][j.x]) {
        r.push(j);
      }
    }
    return r;
  }

  doiWantToWalkHere(pathStr: string): boolean {
    return (
      !this.takenPaths.includes(pathStr) && !this.deadEnds.includes(pathStr)
    );
  }
}
