/// <reference path="Maze.ts"/>
/// <reference path="Vector.ts"/>
/// <reference path="miscellanies.ts"/>
class Solver {
  maze: Maze; // Reference to Maze object
  delay: number | undefined;
  pos: Array<Vector2D>; // Current Possition
  path: Array<Array<Vector2D>>; // Path to be drawn on the canvas
  takenPaths: LinkedList<string>; // Storage of which paths have already been taken
  solved: boolean; // End found?
  leftFirst: boolean;
  finishLine: number;

  constructor(m: Maze, delay: number = 0) {
    if (delay > 0) {
      // wenn kein Delay deniniert dann
      this.delay = delay;
    }
    this.solved = false;
    this.maze = m;
    this.finishLine = this.maze.size - 1;
    this.pos = [this.maze.start]; // Create first path follower
    this.path = [[this.maze.start]]; // Add start to first path
    this.maze.path = this.path; // Give a reference to path Array to the maze, to draw
    this.takenPaths = new LinkedList<string>();
    this.leftFirst = false;
    for (let i = 0; i < this.maze.size - 1; i++) {
      if (this.maze.data[this.maze.size - 1][i]) {
        if (i < this.maze.size / 2) {
          // Is the exit on the left or right
          this.leftFirst = true;
        }
        break;
      }
    }
  }

  destroy() {
    for (let property in this) {
      if (this.hasOwnProperty(property)) {
        delete this[property];
      }
    }
    console.debug(this);
  }

  async solve() {
    if (!this.takenPaths.isEmpty()) {
      this.takenPaths = new LinkedList<string>();
    }
    this.takenPaths.append(this.pos.toString());
    for (let step = 0; step < Number.MAX_SAFE_INTEGER && !this.solved; step++) {
      for (
        let solverIndex = 0;
        solverIndex < this.pos.length && !this.solved;
        solverIndex++
      ) {
        if (await this.step(solverIndex)) {
          if (this.pos[solverIndex].y >= this.finishLine) {
            // Check if exit is reached
            this.setSolved(solverIndex, step);
            break;
          }
        } else {
          // Remove solver tree of no stepps possible
          this.path.splice(solverIndex, 1);
          this.pos.splice(solverIndex, 1);
        }
      }
      if (this.delay && !this.solved) {
        this.maze.drawToCanvas(this.pos);
        await delay(this.delay);
      }
    }
    if (!this.solved) {
      this.destroy();
      throw new Error(`Not solved`);
    }
  }

  async step(solverIndex: number): Promise<boolean> {
    const options = await this.findWalkablePaths(solverIndex);
    let hasPath = false;
    let isCrossing = false;
    // There are several options to go?
    if (options.length > 1) {
      isCrossing = true;
    }
    let pathSaver = this.path[solverIndex];
    for (const path of options) {
      let pathStr = path.toString();
      if (this.doIWantToGoHere(pathStr)) {
        if (path.y >= this.maze.size - 1) {
          this.setSolved(solverIndex, -1);
        }
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
    if (this.leftFirst) {
      options = [
        new Vector2D(0, 1),
        new Vector2D(-1, 0),
        new Vector2D(1, 0),
        new Vector2D(0, -1),
      ];
    } else {
      options = [
        new Vector2D(0, 1),
        new Vector2D(1, 0),
        new Vector2D(-1, 0),
        new Vector2D(0, -1),
      ];
    }
    for await (const i of options) {
      let j = this.pos[solverIndex].add(i);
      if (this.maze.posIsInMaze(j) && this.maze.data[j.y][j.x]) {
        r.push(j);
      }
    }
    return r;
  }

  doIWantToGoHere(pathStr: string): boolean {
    let notIncluded = !this.takenPaths.includes(pathStr);
    if (notIncluded) this.takenPaths.append(pathStr);
    return notIncluded;
  }

  shorten(solverIndex: number) {
    for (let tempPos of this.path[solverIndex]) {
      let currentIndex = this.path[solverIndex].indexOf(tempPos);
      const options = [
        new Vector2D(1, 0),
        new Vector2D(-1, 0),
        new Vector2D(0, 1),
        new Vector2D(0, -1),
      ];
      for (const testPath of options) {
        let testIndex = -1;
        for (
          let i = this.path[solverIndex].length - 1;
          i > currentIndex + 1;
          i--
        ) {
          const testVector = this.path[solverIndex][i].add(testPath);
          if (testVector.x === tempPos.x && testVector.y === tempPos.y) {
            testIndex = i;
            break;
          }
        }
        if (testIndex >= 0) {
          console.count("optimization");
          this.path[solverIndex].splice(
            currentIndex + 1,
            testIndex - currentIndex - 1
          );
        }
      }
    }
    this.maze.drawToCanvas();
  }
  setSolved(solverIndex: number, steps: number) {
    if (!this.solved) {
      this.solved = true;
      // Try small path length optimizations
      this.shorten(solverIndex);
      // Only keep solver path
      this.path.splice(1, this.path.length - solverIndex - 1);
      this.path.splice(0, solverIndex);
      if (steps > 0) {
        console.log(`Took ${steps} steps`);
      }
      console.log(`Final path length: ${this.path[0].length}`);
      this.maze.drawToCanvas(undefined, true);
    }
  }
}
