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
    if (~delay) {
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
  }

  async solve() {
    let step;
    let finishLine = this.maze.size - 1;
    for (step = 0; step < 500000; step++) {
      if (await this.step()) {
        if (this.delay) {
          this.maze.drawToCanvas(this.pos);
        }
        if (this.pos.y === finishLine) {
          this.solved = true;
          break;
        } else if (this.delay) {
          await sleep(this.delay);
        }
      } else if (~this.possibleDeadEnds.length) {
        let newDeadEnd = <Vector2D>this.possibleDeadEnds.pop();
        this.deadEnds.add(newDeadEnd.toString());
        this.pos = <Vector2D>this.possibleDeadEndReturns.pop();
        let newPosIndex = this.path.indexOf(this.pos) + 1;
        this.path.splice(newPosIndex, this.path.length - newPosIndex);
      } else {
        throw new Error("Maze not solveable");
      }
    }
    if (this.solved) {
      this.shorten();
      console.log(`Took ${step} steps`);
      console.log(`Final path length: ${this.path.length}`);
    } else {
      throw new Error(`Not solved after ${step} steps`);
    }
    await sleep(25);
    this.maze.drawToCanvas();
  }

  async step(): Promise<boolean> {
    const options = await this.findWalkablePaths();
    let isCrossing = false;
    if (options.length > 1) {
      this.crossings.push(this.pos);
      isCrossing = true;
    }
    for (const path of options) {
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

  async findWalkablePaths(): Promise<Array<Vector2D>> {
    let r = new Array<Vector2D>();
    let options = [
      new Vector2D(0, 1),
      new Vector2D(-1, 0),
      new Vector2D(1, 0),
      new Vector2D(0, -1),
    ];
    for await (const i of options) {
      let j = this.pos.add(i);
      if (this.maze.posIsInMaze(j) && this.maze.data[j.y][j.x]) {
        r.push(j);
      }
    }
    return r;
  }

  doiWantToWalkHere(pathStr: string): boolean {
    return !(
      this.takenPaths.includes(pathStr) || this.deadEnds.includes(pathStr)
    );
  }

  shorten() {
    for (this.pos of this.path) {
      let currentIndex = this.path.indexOf(this.pos);
      const options = [
        new Vector2D(1, 0),
        new Vector2D(-1, 0),
        new Vector2D(0, 1),
        new Vector2D(0, -1),
      ];
      for (const testPath of options) {
        let testIndex = -1;
        for (let i = this.path.length - 1; i > currentIndex + 1; i--) {
          const testVector = this.path[i].add(testPath);
          if (testVector.x === this.pos.x && testVector.y === this.pos.y) {
            testIndex = i;
            break;
          }
        }
        if (~testIndex) {
          console.count("optimization");
          this.path.splice(currentIndex + 1, testIndex - currentIndex - 1);
        }
      }
    }
    this.maze.drawToCanvas();
  }
}
