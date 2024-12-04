import fs from "fs";

const input = fs.readFileSync("./04/input.txt").toString();

const letters = input.split("\n").map((line) => line.trim());

class WordSearch {
  constructor(protected lines: string[]) {}

  public amountOfWords(word: string): number {
    const indexes = this.findFirstLetterIndexes(word);

    return indexes.reduce(
      (acc, curr, index) => acc + this.findAllWordsForLine(index, curr, word),
      0
    );
  }

  protected findFirstLetterIndexes(word: string): number[][] {
    const firstLetter = word[0];

    return this.lines.reduce((acc, curr) => {
      return [
        ...acc,
        [...curr.matchAll(new RegExp(firstLetter, "g"))].map((x) => x.index),
      ];
    }, []);
  }

  protected findAllWordsForLine(
    y: number,
    listOfX: number[],
    word: string
  ): number {
    return listOfX.reduce(
      (acc, x) => acc + this.findWordAmountForIndex({ x, y }, word),
      0
    );
  }

  protected findWordAmountForIndex(
    { x, y }: { x: number; y: number },
    word: string
  ): number {
    const possibilities = new PossibilitiesFinder(
      this.lines,
      { y, x },
      word.length,
      1
    ).findPossibilities();

    return Math.floor(
      possibilities.filter(
        (possibility) => possibility === "MAS" || possibility === "SAM"
      ).length / 2
    ) > 1
      ? 1
      : 0;
  }
}

class PossibilitiesFinder {
  public constructor(
    protected lines: string[],
    protected position: { x: number; y: number },
    protected length: number,
    protected offset: number
  ) {}

  public findPossibilities(): string[] {
    return [
      this.toTopRight(),
      this.toTopLeft(),
      this.toBottomRight(),
      this.toBottomLeft(),
    ].flat();
  }

  protected toTopRight(): string {
    if (this.isTooCloseRight() || this.isTooCloseTop()) {
      return "";
    }

    return this.getIndexes()
      .map(
        (index) =>
          this.lines[this.position.y - index]?.[this.position.x + index]
      )
      .join("");
  }

  protected toBottomRight(): string {
    if (this.isTooCloseRight() || this.isTooCloseBottom()) {
      return "";
    }

    return this.getIndexes()
      .map(
        (index) =>
          this.lines[this.position.y + index]?.[this.position.x + index]
      )
      .join("");
  }

  protected toTopLeft(): string {
    if (this.isTooCloseTop() || this.isTooCloseLeft()) {
      return "";
    }

    return this.getIndexes()
      .map(
        (index) =>
          this.lines[this.position.y - index]?.[this.position.x - index]
      )
      .join("");
  }

  protected toBottomLeft(): string {
    if (this.isTooCloseBottom() || this.isTooCloseLeft()) {
      return "";
    }

    return this.getIndexes()
      .map(
        (index) =>
          this.lines[this.position.y + index]?.[this.position.x - index]
      )
      .join("");
  }

  protected getIndexes(): number[] {
    return new Array(this.length + this.offset)
      .fill(0)
      .map((_, i) => i - this.offset);
  }

  protected isTooCloseTop(): boolean {
    return this.position.y - this.length + 1 < 0;
  }

  protected isTooCloseRight(): boolean {
    return this.position.x + this.length > this.lines[this.position.y].length;
  }

  protected isTooCloseBottom(): boolean {
    return this.lines.length - this.position.y - this.length < 0;
  }

  protected isTooCloseLeft(): boolean {
    return this.position.x - this.length + 1 < 0;
  }
}

const wordSearch = new WordSearch(letters);

console.log(wordSearch.amountOfWords("AS"));
