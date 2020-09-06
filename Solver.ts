/// <reference path="Maze.ts"/>
/// <reference path="Vector.ts"/>
/// <reference path="miscellanies.ts"/>
class Solver {
  maze: Maze; // Reference to Maze object
  delay: number | undefined;
  pos: Array<Vector2D>; // Current Possition
  path: Array<Array<Vector2D>>; // Path to be drawn on the canvas
  takenPaths: SortedList<string>; // Storage of which paths have already been taken
  // deadEnds: SortedList<string>; // Storage of discovered dead ends
  solved: boolean; // End found?
  leftFirst: boolean;
  constructor(m: Maze, delay: number = 0) {
    if (delay > 0) {
      // wenn kein Delay deniniert dann
      this.delay = delay;
    }
    this.solved = false;
    this.maze = m;
    this.pos = [this.maze.start];
    this.path = [[this.maze.start]];
    this.maze.path = this.path;
    this.takenPaths = new SortedList<string>();
    // this.deadEnds = new SortedList<string>();
    this.leftFirst = false;
    for (let i = 0; i < this.maze.size - 1; i++) {
      if (this.maze.data[this.maze.size - 1][i]) {
        if (i < this.maze.size / 2) {
          this.leftFirst = true;
        }
        break;
      }
    }
  }

  async solve() {
    this.takenPaths = new SortedList<string>();
    this.takenPaths.add(this.pos.toString());
    let finishLine = this.maze.size - 1;
    for (let step = 0; step < Number.MAX_SAFE_INTEGER && !this.solved; step++) {
      for (
        let solverIndex = 0;
        solverIndex < this.pos.length && !this.solved;
        solverIndex++
      ) {
        if (await this.step(solverIndex)) {
          if (this.pos[solverIndex].y === finishLine) {
            this.setSolved(solverIndex, step);
            break;
          }
        } else {
          this.path.splice(solverIndex, 1);
          this.pos.splice(solverIndex, 1);
        }
      }
      if (this.delay) {
        this.maze.drawToCanvas(this.pos);
        await sleep(this.delay);
      }
    }
    if (!this.solved) {
      throw new Error(`Not solved`);
    }
  }

  async step(solverIndex: number): Promise<boolean> {
    const options = await this.findWalkablePaths(solverIndex);
    let hasPath = false;
    let isCrossing = false;
    if (options.length > 1) {
      isCrossing = true;
    }
    let pathSaver = this.path[solverIndex];
    for (const path of options) {
      let pathStr = path.toString();
      if (this.doIWantToGoHere(pathStr)) {
        if (isCrossing) {
          if (!hasPath) {
            this.path.splice(solverIndex, 1);
            this.pos.splice(solverIndex, 1);
          }
          this.pos.push(path);
          this.path.push(pathSaver.concat(path));
        } else {
          this.path[solverIndex].push(path);
          this.pos[solverIndex] = path;
          return true;
        }
        hasPath = true;
      }
    }
    return hasPath;
  }

  async findWalkablePaths(solverIndex: number): Promise<Array<Vector2D>> {
    let r = new Array<Vector2D>();
    let options: Array<Vector2D>;
    if (this.leftFirst)
      options = [
        new Vector2D(0, 1),
        new Vector2D(-1, 0),
        new Vector2D(1, 0),
        new Vector2D(0, -1),
      ];
    else
      options = [
        new Vector2D(0, 1),
        new Vector2D(1, 0),
        new Vector2D(-1, 0),
        new Vector2D(0, -1),
      ];
    for await (const i of options) {
      let j = this.pos[solverIndex].add(i);
      if (this.maze.posIsInMaze(j) && this.maze.data[j.y][j.x]) {
        r.push(j);
      }
    }
    return r;
  }

  doIWantToGoHere(pathStr: string): boolean {
    let r = !this.takenPaths.includes(pathStr);
    this.takenPaths.add(pathStr);
    return r;
  }

  // shorten(solverIndex: number) {
  //   for (this.pos of this.path) {
  //     let currentIndex = this.path.indexOf(this.pos);
  //     const options = [
  //       new Vector2D(1, 0),
  //       new Vector2D(-1, 0),
  //       new Vector2D(0, 1),
  //       new Vector2D(0, -1),
  //     ];
  //     for (const testPath of options) {
  //       let testIndex = -1;
  //       for (let i = this.path.length - 1; i > currentIndex + 1; i--) {
  //         const testVector = this.path[i].add(testPath);
  //         if (testVector.x === this.pos.x && testVector.y === this.pos.y) {
  //           testIndex = i;
  //           break;
  //         }
  //       }
  //       if (testIndex >= 0) {
  //         console.count("optimization");
  //         this.path.splice(currentIndex + 1, testIndex - currentIndex - 1);
  //       }
  //     }
  //   }
  //   this.maze.drawToCanvas();
  // }
  setSolved(solverIndex: number, steps: number) {
    this.solved = true;
    // this.shorten(solverIndex);
    console.log(`Solved by tree ${solverIndex}`);
    console.log(`Took ${steps} steps`);
    console.log(`Final path length: ${this.path[solverIndex].length}`);
    this.path.splice(0, solverIndex);
    this.path.splice(solverIndex + 1, this.path.length - solverIndex - 1);
    this.maze.drawToCanvas();
    // console.table(this.path[solverIndex]);
  }
}
