import fs from "fs";

const input = fs.readFileSync("./05/input.txt").toString();

const [requirementList, pageList] = input.split("\r\n\r\n");

class Requirements {
  protected requirements: Map<number, number[]>;

  constructor(requirements: string[]) {
    this.requirements = requirements.reduce((acc, curr) => {
      const [required, requiredBy] = curr.split("|");

      acc.set(Number(requiredBy), [
        ...(acc.get(Number(requiredBy)) || []),
        Number(required),
      ]);

      return acc;
    }, new Map<number, number[]>());
  }

  public getRequirements(page: number) {
    if (!this.requirements.has(page)) return [];

    return this.requirements.get(page);
  }
}

class PageList {
  protected pages: number[];

  constructor(pages: string) {
    this.pages = pages.split(",").map((page) => Number(page));
  }

  public isInOrder(requirements: Requirements): boolean {
    return this.pages.every((page, index) => {
      const actualRequirements = requirements
        .getRequirements(page)
        .filter((requirement) => this.pages.includes(requirement));

      if (actualRequirements.length === 0) return true;

      return actualRequirements.every((requirement) => {
        return this.pages.slice(0, index).includes(requirement);
      });
    });
  }

  public getMiddleNumber(): number {
    return this.pages[Math.floor(this.pages.length / 2)];
  }

  public getPages(): number[] {
    return this.pages;
  }
}

class PageOrderer {
  protected orderedPages: number[];

  constructor(protected pages: number[], protected requirements: Requirements) {
    this.orderedPages = [];
  }

  public toOrdered(): PageList {
    while (this.orderedPages.length < this.pages.length) {
      const missingPages = this.pages.filter(
        (page) => !this.orderedPages.includes(page)
      );

      const pagesWithNoRequirements = missingPages.filter(
        (page) => this.getCurrentRequirements(page).length === 0
      );

      this.orderedPages = [...this.orderedPages, ...pagesWithNoRequirements];
    }

    return new PageList(this.orderedPages.join(","));
  }

  protected getCurrentRequirements(page: number): number[] {
    const pageRequirements = this.requirements
      .getRequirements(page)
      .filter((requirement) => this.pages.includes(requirement));

    const currentRequirements = pageRequirements.filter(
      (requirement) => !this.orderedPages.includes(requirement)
    );

    return currentRequirements;
  }
}

const requirements = new Requirements(requirementList.split("\n"));

const pages = pageList.split("\n").map((page) => new PageList(page));

const answer = pages
  .filter((page) => !page.isInOrder(requirements))
  .map((page) => new PageOrderer(page.getPages(), requirements).toOrdered())
  .reduce((acc, curr) => {
    return acc + curr.getMiddleNumber();
  }, 0);

console.log(answer);
