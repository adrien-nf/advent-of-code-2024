import fs from "fs";

const line = fs.readFileSync("./03/input.txt").toString();

const multipliers = /mul\((\d+),(\d+)\)/g;

const matches = [...line.matchAll(multipliers)];

const answer = matches.reduce((acc, match) => {
  acc += getResult(match);
  return acc;
}, 0);

function getResult(match): number {
  return match[1] * match[2];
}

console.log(answer);
