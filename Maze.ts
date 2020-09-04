/// <reference path="Vector.ts"/>
class Maze {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  size: number;
  data: Array<Array<boolean>>;
  start: Vector2D;
  path: Array<Vector2D> | undefined;
  constructor(size: number = 10, complexity: number = 50) {
    if (size < 25) {
      size = 25;
    }
    if (complexity <= 50) {
      complexity = 500;
    } else {
      complexity = complexity * 10;
    }
    this.canvas = document.createElement("canvas");
    this.size = size;
    this.start = new Vector2D(Math.floor(this.size / 2), 0);
    let canvasSize = Math.abs(
      Math.min(window.innerHeight, window.innerWidth) - 50
    );
    this.canvas.style.height = `${canvasSize}px`;
    this.canvas.style.width = `${canvasSize}px`;
    document.body.appendChild(this.canvas);
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.data = new Array<Array<boolean>>(this.size);
    this.createMaze(this.size, complexity);
  }
  destroy() {
    this.canvas.remove();
    this.data = new Array();
  }
  createMaze(size: number, complexity: number) {
    this.size = size;
    this.start = new Vector2D(Math.floor(this.size / 2), 0);
    this.canvas.height = this.size;
    this.canvas.width = this.size;
    for (let y = 0; y < size; y++) {
      let tempArray = new Array<boolean>();
      for (let x = 0; x < size; x++) {
        tempArray[x] = false;
      }
      this.data[y] = tempArray;
    }
    let pos = this.start.copy();
    this.data[pos.y][pos.x] = true;
    let adder = new Vector2D();
    let counter: number = 0;
    let i: number;
    let finished = false;
    for (i = 0; i < this.size * complexity; i++) {
      if (counter > 0 && this.posIsInMaze(pos.add(adder))) {
        pos = pos.add(adder);
        counter--;
        this.data[pos.y][pos.x] = true;
      } else {
        adder = this.getRandomPosAround(pos);
        counter = Math.round(Math.random() * 10);
      }
      if (pos.y >= this.size - 1) {
        finished = true;
        break;
      }
    }
    if (!finished) {
      // If Maze is not finished, draw line from current possition to bottom
      while (pos.y < this.size - 1) {
        this.data[pos.y][pos.x] = true;
        pos.y++;
      }
    }
    console.log(`Complexity: ${i}`);
    this.drawToCanvas();
  }
  posIsInMaze(pos: Vector2D) {
    return pos.x >= 0 && pos.y >= 0 && pos.x < this.size && pos.y < this.size;
  }
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
  async drawToCanvas(pos: Vector2D | undefined = undefined) {
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
      this.ctx.fillStyle = "whitesmoke";
      for await (let el of this.path) {
        this.ctx.rect(el.x, el.y, 1, 1);
      }
      this.ctx.fill();
      this.ctx.closePath();
    }

    // Mark current possition
    if (pos) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "#54D158";
      this.ctx.rect(pos.x, pos.y, 1, 1);
      this.ctx.fill();
      this.ctx.closePath();
    }
  }
}
