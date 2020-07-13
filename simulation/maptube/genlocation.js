const location = [
  { x: 183.93, y: 231.01 },
  { x: 256.44, y: 231.01 },
];
let output = [];

function loopx() {
  let start = location[0].x;
  let limit = location[1].x;

  const step = 0.5;

  while (start < limit) {
    console.log(start);
    start = start + step;
  }
}

function loopy() {}

function loopxy() {}

function get_nth(array, n) {
  let newArray = [];
  newArray.push(array[n - 1]);
  newArray.push(array[n]);
  return newArray;
}

function main() {
  const length = location.length;
  for (i = 0; i < cars.length; i++) {
    console.log(get_nth(location, i));
  }
}

main();
