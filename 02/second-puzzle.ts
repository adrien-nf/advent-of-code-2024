import fs from "fs";

const input = fs.readFileSync("./02/input.txt").toString();

const lines = input.split("\n");

const data = lines.map((line) => line.split(" ").map((n) => parseInt(n)));

const answer = data.filter((line) => {
  return isSafe(line) || isSafeIsh(line);
}).length;

function isSafe(line: number[]): boolean {
  return isGrowingOrDescending(line) && isDeltaBetweenOneAndThree(line);
}

function isGrowingOrDescending(line: number[]): boolean {
  const sorted = line.toSorted((a, b) => a - b);

  const isGrowing = sorted.join(",") === line.join(",");
  const isDescending = sorted.toReversed().join(",") === line.join(",");

  return isGrowing || isDescending;
}

function isDeltaBetweenOneAndThree(line: number[]): boolean {
  return line.every((current, i) => {
    if (i === 0) {
      return true;
    }

    const diff = Math.abs(current - line[i - 1]);

    return diff >= 1 && diff <= 3;
  });
}

function isSafeIsh(line: number[]): boolean {
  return line.some((current, i) => {
    return isSafe(line.toSpliced(i, 1));
  });
}

console.log(answer);
