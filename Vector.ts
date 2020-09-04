class Vector2D {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  add(v2: Vector2D) {
    return new Vector2D(this.x + v2.x, this.y + v2.y);
  }
  copy() {
    return new Vector2D(this.x, this.y);
  }
  toString() {
    return `${this.x};${this.y}`;
  }
}
