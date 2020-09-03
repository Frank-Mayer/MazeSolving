/// <reference path="Vector.ts"/>
class Maze {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  size: number;
  data: Array<Array<boolean>>;
  start: Vector2D;
  path: Array<Vector2D> | undefined;
  constructor() {
    this.canvas = document.createElement("canvas");
    this.size = 50;
    this.start = new Vector2D(Math.floor(this.size / 2), 0);
    let canvasSize = Math.min(window.innerHeight, window.innerWidth);
    this.canvas.style.height = `${canvasSize}px`;
    this.canvas.style.width = `${canvasSize}px`;
    document.body.appendChild(this.canvas);
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.data = new Array<Array<boolean>>();
    this.createMaze(this.size);
  }
  createMaze(size: number) {
    this.size = size;
    this.canvas.height = this.size;
    this.canvas.width = this.size;
    for (let y = 0; y < size; y++) {
      let tempArray = new Array<boolean>();
      for (let x = 0; x < size; x++) {
        tempArray[x] = false;
      }
      this.data[y] = tempArray;
    }
    this.start = new Vector2D(Math.floor(this.size / 2), 0);
    let pos = this.start.copy();
    let adder = new Vector2D();
    let counter: number = 0;
    this.data[pos.y][pos.x] = true;
    let i: number;
    for (i = 0; i < 10000 && pos.y < this.size - 1; i++) {
      if (
        counter > 0 &&
        this.posIsInMaze(new Vector2D(pos.x, pos.y).add(adder))
      ) {
        pos = pos.add(adder);
        counter--;
        this.data[pos.y][pos.x] = true;
      } else {
        adder = this.getRandomPosAround(pos);
        counter = Math.round(Math.random() * 20);
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
  drawToCanvas() {
    this.ctx.clearRect(0, 0, this.size, this.size);
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.data[y][x]) {
          this.ctx.beginPath();
          this.ctx.fillStyle = "white";
          this.ctx.rect(x, y, 1, 1);
          this.ctx.closePath();
          this.ctx.fill();
        }
      }
    }
    if (this.path) {
      for (let el of this.path) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "red";
        this.ctx.rect(el.x, el.y, 1, 1);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }
  }
}
