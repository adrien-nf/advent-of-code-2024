import fs from "fs";

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

const memoizedSimilarities = new Map<number, number>();

const answer = left.reduce((acc, cur) => {
  const score = getSimilarityScore(cur);

  return acc + score;
}, 0);

function getSimilarityScore(value: number): number {
  if (memoizedSimilarities.has(value)) {
    return memoizedSimilarities.get(value)!;
  }

  const occurences = getOccurences(value);

  const score = value * occurences;

  memoizedSimilarities.set(value, score);

  return score;
}

function getOccurences(value: number): number {
  return right.filter((x) => x === value).length;
}

console.log(answer);
