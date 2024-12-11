import fs from "fs";

const input = fs.readFileSync("./11/input.txt").toString();

const stones = input.split(" ").map(Number);

class StoneMultiplier {
  protected dataSaver: Map<number, number>;

  constructor() {
    this.dataSaver = new Map();
  }

  public getNumberOfStonesAfterSteps(stones: number[], steps: number): number {
    let iterations = stones;

    while (steps-- > 0) {
      iterations = this.getStonesFor(iterations);
    }

    return iterations.length;
  }

  protected getStonesFor(stones: number[]): number[] {
    return stones.flatMap((stone) => this.transformStone(stone));
  }

  protected transformStone(stone: number): number[] {
    if (stone === 0) {
      return [1];
    }

    const stoneArray = stone.toString().split("");

    if (stoneArray.length % 2 === 0) {
      return [
        Number(stoneArray.slice(0, stoneArray.length / 2).join("")),
        Number(stoneArray.slice(stoneArray.length / 2).join("")),
      ];
    }

    return [stone * 2024];
  }
}

const stoneMultiplier = new StoneMultiplier();

const answer = stoneMultiplier.getNumberOfStonesAfterSteps(stones, 25);

console.log(answer);
