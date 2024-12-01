import fs from "fs";
import { parse } from "path";

const input = fs.readFileSync("./01/input.txt").toString();

const lists = input
  .split("\n")
  .map((line) => {
    const [left, right] = line.split("   ");

    return [parseInt(left), parseInt(right)];
  })
  .reduce(
    (acc, cur) => {
      acc.left.push(cur[0]);
      acc.right.push(cur[1]);
      return acc;
    },
    { left: [], right: [] }
  );

const { left, right } = lists;

left.sort();
right.sort();

const zip = left.map((x, i) => [x, right[i]]);

const answer = zip.reduce((acc, cur) => {
  const [left, right] = cur;

  return acc + Math.abs(left - right);
}, 0);

console.log(answer);
