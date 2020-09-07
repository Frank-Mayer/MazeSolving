/// <reference path="miscellanies.ts"/>

function performanceTest(type: string) {
  console.time(type);
  let x: Array<number> | SortedList<number>;
  if (type === "Array") {
    x = new Array<number>();
  } else if (type === "SortedList") {
    x = new SortedList<number>();
  } else return;
  for (let i = 0; i < 1000000; i++) {
    let y = Math.floor(Math.random() * 1000000);
    if (x instanceof Array) {
      x.push(y);
    } else if (x instanceof SortedList) {
      x.add(y);
    }
  }
  for (let i = 0; i < 100000; i++) {
    x.includes(Math.floor(Math.random() * 1000000));
  }
  console.timeEnd(type);
}
