/// <reference path="Vector.ts"/>
class Maze {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  size: number;
  data: Array<Array<boolean>>;
  start: Vector2D;
  path: Array<Array<Vector2D>> | undefined; // From solver

  constructor(size: number = 10, complexity: number = 50) {
    if (size < 25) {
      size = 25;
    }
    this.canvas = document.createElement("canvas");
    this.size = size;
    this.start = new Vector2D(Math.floor(this.size / 2), 0); // Start is in the middle at the top
    let canvasSize = Math.max(
      Math.min(window.innerHeight, window.innerWidth) - 50,
      200
    ); // Canvas takes up most of the screen
    this.canvas.style.height = `${canvasSize}px`; // Set style to actual size
    this.canvas.style.width = `${canvasSize}px`;
    document.body.appendChild(this.canvas);
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.data = new Array<Array<boolean>>(this.size); // Empty array
    this.createMaze(this.size, complexity);
  }

  destroy() {
    this.canvas.remove();
    for (let property in this) {
      if (this.hasOwnProperty(property)) {
        delete this[property];
      }
    }
    console.debug(this);
  }

  /** Randomly generate maze
   * @param size Size of maze in pixels (x and y)
   * @param complexity Maximum lines to create the maze (is going to be multiplied by size)
   */
  createMaze(size: number, complexity: number) {
    this.size = size;
    this.start = new Vector2D(Math.floor(this.size / 2), 0);
    this.canvas.height = this.size; // Set render size to maze size
    this.canvas.width = this.size;
    for (let y = 0; y < size; y++) {
      const tempArray = new Array<boolean>();
      for (let x = 0; x < size; x++) {
        tempArray[x] = false;
      }
      this.data[y] = tempArray;
    }
    let pos = this.start.copy();
    this.data[pos.y][pos.x] = true;
    let adder = new Vector2D();
    let counter = 0;
    let i: number;
    let finished = false;
    for (i = 0; i < this.size * complexity; i++) {
      if (counter > 0 && this.posIsInMaze(pos.add(adder))) {
        pos = pos.add(adder);
        counter--;
        this.data[pos.y][pos.x] = true;
      } else {
        adder = this.getRandomPosAround(pos);
        counter = Math.floor(Math.random() * 10) + 1; // Length of the corridor, 1 to 10
      }
      if (pos.y >= this.size - 1) {
        // Exit is bottom of the maze
        // Only one exit
        finished = true;
        break;
      }
    }
    if (!finished) {
      // If Maze is not finished, draw line from current possition to bottom
      while (pos.y < this.size - 1) {
        this.data[pos.y][pos.x] = true;
        pos.y++;
        i++;
      }
    }
    console.log(`Complexity: ${i}`);
    this.drawToCanvas(); // Draw finished maze
  }

  /** Check if vector is valid maze location */
  posIsInMaze(pos: Vector2D) {
    return pos.x >= 0 && pos.y >= 0 && pos.x < this.size && pos.y < this.size;
  }

  /** Random position around a given vector that is inside the maze */
  getRandomPosAround(pos: Vector2D): Vector2D {
    let r = Math.round(Math.random() * 3);
    if (r === 0 && pos.y > 1) {
      return new Vector2D(0, -1);
    } else if (r === 1 && pos.x > 1) {
      return new Vector2D(-1, 0);
    } else if (r === 2 && pos.x < this.size - 2) {
      return new Vector2D(1, 0);
    } else {
      return new Vector2D(0, 1);
    }
  }

  /** Clear canvas and draw maze, paths and path follower positions */
  async drawToCanvas(
    pos: Array<Vector2D> | undefined = undefined,
    solved = false
  ) {
    // Clear Canvas
    this.ctx.clearRect(0, 0, this.size, this.size);

    // Draw maze
    this.ctx.beginPath();
    this.ctx.fillStyle = "#7f7f7f";
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.data[y][x]) {
          this.ctx.rect(x, y, 1, 1);
        }
      }
    }
    this.ctx.fill();
    this.ctx.closePath();

    // Draw path
    if (this.path) {
      this.ctx.beginPath();
      this.ctx.fillStyle = solved ? "#54D158" : "whitesmoke";
      for await (const path of this.path)
        for await (let el of path) {
          this.ctx.rect(el.x, el.y, 1, 1);
        }
      this.ctx.fill();
      this.ctx.closePath();
    }

    // Mark current possition
    if (pos) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "#54D158";
      for await (const el of pos) {
        this.ctx.rect(el.x, el.y, 1, 1);
      }
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}
