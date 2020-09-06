function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
class SortedList<T> {
  private list: Array<T>;
  private hasChangedSinceLastSort: boolean;
  constructor() {
    this.hasChangedSinceLastSort = true;
    this.list = new Array<T>();
  }
  add(value: T) {
    this.list.push(value);
    this.hasChangedSinceLastSort = true;
  }
  remove(value: T) {
    this.list.splice(this.indexOf(value), 1);
    this.hasChangedSinceLastSort = true;
  }
  indexOf(value: T): number {
    if (this.hasChangedSinceLastSort) {
      this.list.sort();
    }
    this.hasChangedSinceLastSort = false;
    let firstIndex = 0,
      lastIndex = this.list.length - 1,
      middleIndex = Math.floor((lastIndex + firstIndex) / 2);
    while (this.list[middleIndex] !== value && firstIndex < lastIndex) {
      if (value < this.list[middleIndex]) {
        lastIndex = middleIndex - 1;
      } else if (value > this.list[middleIndex]) {
        firstIndex = middleIndex + 1;
      }
      middleIndex = Math.floor((lastIndex + firstIndex) / 2);
    }
    return this.list[middleIndex] !== value ? -1 : middleIndex;
  }
  includes(value: T): boolean {
    if (this.hasChangedSinceLastSort) {
      this.list.sort();
    }
    this.hasChangedSinceLastSort = false;
    let firstIndex = 0,
      lastIndex = this.list.length - 1,
      middleIndex = Math.floor((lastIndex + firstIndex) / 2);
    while (this.list[middleIndex] !== value && firstIndex < lastIndex) {
      if (value < this.list[middleIndex]) {
        lastIndex = middleIndex - 1;
      } else if (value > this.list[middleIndex]) {
        firstIndex = middleIndex + 1;
      }
      middleIndex = Math.floor((lastIndex + firstIndex) / 2);
    }
    return this.list[middleIndex] === value;
  }
}
