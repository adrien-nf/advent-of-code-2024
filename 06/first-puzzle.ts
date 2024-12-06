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
    return this.points.some((p) => p.equals(point));
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

class Point {
  constructor(protected x: number, protected y: number) {}

  public mergeWith(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  public getPosition(): Position {
    return { x: this.x, y: this.y };
  }

  public equals(other: Point): boolean {
    const { x: myX, y: myY } = this.getPosition();
    const { x: otherX, y: otherY } = other.getPosition();

    return myX === otherX && myY === otherY;
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
  protected guardDirection: Direction;

  protected visitedCells: PointSet = new PointSet();

  constructor(protected map: string[]) {
    this.guardPosition = this.getGuardPosition();
    this.guardDirection = Direction.Up;
  }

  protected getGuardPosition(): Point {
    const startingLineIndex = this.map.findIndex((line) =>
      line.includes(Direction.Up)
    );

    const startingCellIndex = this.map[startingLineIndex].indexOf(Direction.Up);

    return new Point(Number(startingCellIndex), Number(startingLineIndex));
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

    this.guardDirection = this.getNewDirection();

    return nextCellContent !== Cell.OutOfBound;
  }

  protected getDirectionVector(): Point {
    switch (this.guardDirection) {
      case Direction.Up:
        return new Point(0, -1);
      case Direction.Down:
        return new Point(0, 1);
      case Direction.Left:
        return new Point(-1, 0);
      case Direction.Right:
        return new Point(1, 0);
    }
  }

  protected getNewDirection(): Direction {
    switch (this.guardDirection) {
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

const map = new Map(lines);

const answer = map.getVisitedCells().length;

console.log(answer);
