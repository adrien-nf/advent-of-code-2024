import fs from "fs";

const line = fs.readFileSync("./03/input.txt").toString();

const multipliers = /mul\((\d+),(\d+)\)/g;
const dos = /do()/g;
const donts = /don\'t()/g;

const matches = [
  ...line.matchAll(multipliers),
  ...line.matchAll(dos),
  ...line.matchAll(donts),
].toSorted((a, b) => a.index - b.index);

let isDoing = true;

const answer = matches.reduce((acc, match) => {
  const identifier = match[0];

  if (identifier.includes("do")) {
    isDoing = !identifier.includes("don't");
    return acc;
  }

  acc += isDoing ? getResult(match) : 0;

  return acc;
}, 0);

function getResult(match): number {
  return match[1] * match[2];
}

console.log(answer);
