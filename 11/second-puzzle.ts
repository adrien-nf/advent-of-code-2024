import fs from "fs";

const input = fs.readFileSync("./11/input.txt").toString();

const stones = input.split(" ").map(Number);

class DataSaver {
  protected dataSaver: Map<number, Map<number, number>>;

  constructor() {
    this.dataSaver = new Map();
  }

  public get(stone: number, step: number): number {
    if (this.dataSaver.has(stone)) {
      return this.dataSaver.get(stone)!.get(step)!;
    }
  }

  public has(stone: number, step: number): boolean {
    return this.dataSaver.has(stone) && this.dataSaver.get(stone)!.has(step);
  }

  public set(stone: number, step: number, value: number): void {
    if (!this.dataSaver.has(stone)) {
      this.dataSaver.set(stone, new Map());
    }

    this.dataSaver.get(stone)!.set(step, value);
  }
}

class StoneMultiplier {
  protected dataSaver = new DataSaver();

  public proxyNumberOfStonesAfterSteps(
    stones: number[],
    steps: number
  ): number {
    const v = this.getNumberOfStonesAfterSteps(stones, steps);

    return v;
  }

  public getNumberOfStonesAfterSteps(stones: number[], steps: number): number {
    if (steps === 0) return stones.length;

    const amount = stones.reduce(
      (acc, stone) => acc + this.getTotalStonesAfterSteps(stone, steps),
      0
    );

    return amount;
  }

  protected getTotalStonesAfterSteps(stone: number, steps: number): number {
    if (this.dataSaver.has(stone, steps))
      return this.dataSaver.get(stone, steps);

    let currentStep = 1;

    while (steps >= currentStep) {
      const newStones = this.transformStone(stone);
      const amount = this.getNumberOfStonesAfterSteps(newStones, steps - 1);

      this.dataSaver.set(stone, steps, amount);
      currentStep++;
    }

    return this.dataSaver.get(stone, steps);
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
const answer = stoneMultiplier.proxyNumberOfStonesAfterSteps(stones, 75);

console.log(answer);
