import fs from "fs";

const input = fs.readFileSync("./06/input.txt").toString();

const lines = input.split("\n");

type Position = { x: number; y: number };

class PointSet {
  protected points: Point[] = [];

  public add(point: Point): void {
    if (!this.has(point)) {
      this.points.push(point);
    }
  }

  public has(point: Point): boolean {
    return this.points.some((p) => p.positionEquals(point));
  }

  public delete(point: Point): boolean {
    const index = this.points.findIndex((p) => p.equals(point));
    if (index !== -1) {
      this.points.splice(index, 1);
      return true;
    }
    return false;
  }

  public values(): Point[] {
    return [...this.points];
  }
}

class DirectionPointSet extends PointSet {
  public has(point: Point): boolean {
    return this.points.some((p) => p.equals(point));
  }
}

class Point {
  constructor(
    protected x: number,
    protected y: number,
    protected direction: Direction
  ) {}

  public mergeWith(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y, other.direction);
  }

  public getPosition(): Position {
    return { x: this.x, y: this.y };
  }

  public getDirection(): Direction {
    return this.direction;
  }

  public positionEquals(other: Point): boolean {
    const { x: myX, y: myY } = this.getPosition();
    const { x: otherX, y: otherY } = other.getPosition();

    return myX === otherX && myY === otherY;
  }

  public equals(other: Point): boolean {
    const { x: myX, y: myY } = this.getPosition();
    const { x: otherX, y: otherY } = other.getPosition();

    return (
      myX === otherX && myY === otherY && this.direction === other.direction
    );
  }
}

enum Cell {
  Empty = ".",
  Wall = "#",
  OutOfBound = "/",
}

enum Direction {
  Up = "^",
  Down = "v",
  Left = "<",
  Right = ">",
}

class Map {
  protected guardPosition: Point;

  protected visitedCells: PointSet = new PointSet();

  constructor(protected map: string[]) {
    this.guardPosition = this.getGuardPosition();
  }

  protected getGuardPosition(): Point {
    const startingLineIndex = this.map.findIndex((line) =>
      line.includes(Direction.Up)
    );

    const startingCellIndex = this.map[startingLineIndex].indexOf(Direction.Up);

    return new Point(
      Number(startingCellIndex),
      Number(startingLineIndex),
      Direction.Up
    );
  }

  public getVisitedCells(): Point[] {
    this.visitedCells.add(this.guardPosition);

    while (this.moveGuard());

    return this.visitedCells.values();
  }

  protected moveGuard(): boolean {
    const directionVector = this.getDirectionVector();

    let nextPosition = this.guardPosition.mergeWith(directionVector);
    let nextCellContent = this.getCellContent(nextPosition);

    while (
      nextCellContent !== Cell.Wall &&
      nextCellContent !== Cell.OutOfBound
    ) {
      this.visitedCells.add(nextPosition);
      this.guardPosition = nextPosition;
      nextPosition = nextPosition.mergeWith(directionVector);
      nextCellContent = this.getCellContent(nextPosition);
    }

    if (nextCellContent === Cell.Wall) {
      const newDirection = this.getNewDirection();

      this.guardPosition = this.guardPosition.mergeWith(
        new Point(0, 0, newDirection)
      );
    }

    return nextCellContent !== Cell.OutOfBound;
  }

  protected getDirectionVector(): Point {
    switch (this.guardPosition.getDirection()) {
      case Direction.Up:
        return new Point(0, -1, Direction.Up);
      case Direction.Down:
        return new Point(0, 1, Direction.Down);
      case Direction.Left:
        return new Point(-1, 0, Direction.Left);
      case Direction.Right:
        return new Point(1, 0, Direction.Right);
    }
  }

  protected getNewDirection(): Direction {
    switch (this.guardPosition.getDirection()) {
      case Direction.Up:
        return Direction.Right;
      case Direction.Right:
        return Direction.Down;
      case Direction.Down:
        return Direction.Left;
      case Direction.Left:
        return Direction.Up;
    }
  }

  protected getCellContent(point: Point): Cell {
    const { x, y } = point.getPosition();

    if (x < 0 || y < 0 || x >= this.map[0].length || y >= this.map.length) {
      return Cell.OutOfBound;
    }

    return this.map[y][x] as Cell;
  }
}

class LoopFinder extends Map {
  protected visitedCells: DirectionPointSet = new DirectionPointSet();
  protected mapHasLoop: boolean = false;

  public setCell(point: Point, cell: Cell): void {
    const { x, y } = point.getPosition();

    this.map[y] = this.map[y].split("").toSpliced(x, 1, cell).join("");
  }

  public hasLoop(): boolean {
    while (this.moveGuard());

    return this.mapHasLoop;
  }

  protected moveGuard(): boolean {
    if (this.visitedCells.has(this.guardPosition)) {
      this.mapHasLoop = true;
      return false;
    }

    this.visitedCells.add(this.guardPosition);

    const directionVector = this.getDirectionVector();

    let nextPosition = this.guardPosition.mergeWith(directionVector);
    let nextCellContent = this.getCellContent(nextPosition);

    if (nextCellContent === Cell.Wall) {
      const newDirection = this.getNewDirection();
      this.guardPosition = this.guardPosition.mergeWith(
        new Point(0, 0, newDirection)
      );
    } else {
      this.guardPosition = nextPosition;
    }

    return nextCellContent !== Cell.OutOfBound;
  }
}

const map = new Map(lines);

const answer = map
  .getVisitedCells()
  .slice(1)
  .reduce((acc, curr, index) => {
    const loopFinder = new LoopFinder([...lines]);
    loopFinder.setCell(curr, Cell.Wall);
    return acc + (loopFinder.hasLoop() ? 1 : 0);
  }, 0);

console.log(answer);
