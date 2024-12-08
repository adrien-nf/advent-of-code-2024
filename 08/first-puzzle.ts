import fs from "fs";

const input = fs.readFileSync("./08/input.txt").toString();

class Point {
  constructor(protected x: number, protected y: number) {}

  public equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public getSymmetrical(other: Point): Point {
    return new Point(2 * this.x - other.x, 2 * this.y - other.y);
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }
}

class PointSet {
  protected points: Point[];

  constructor(points: Point[] = []) {
    this.points = points;
  }

  public size(): number {
    return this.points.length;
  }

  public has(point: Point): boolean {
    return this.points.some((p) => p.equals(point));
  }

  public add(point: Point): void {
    if (!this.has(point)) {
      this.points.push(point);
    }
  }

  public addAll(points: Point[]): void {
    points.forEach((point) => this.add(point));
  }
}

class CityMap {
  protected antennasPositions: Map<string, Point[]>;
  protected grid: string[];

  constructor(protected lines: string) {
    this.grid = lines.split("\n");

    this.antennasPositions = this.getAntennasPositionsMap();
  }

  protected getAntennasPositionsMap(): Map<string, Point[]> {
    const map = new Map<string, Point[]>();

    this.grid.forEach((line, y) => {
      line.split("").forEach((char, x) => {
        if (![".", "\r", "\n"].includes(char)) {
          const key = char;
          const value: Point[] = [];

          if (map.has(key)) {
            value.push(...map.get(key)!);
          }

          value.push(new Point(x, y));
          map.set(key, value);
        }
      });
    });

    return map;
  }

  public getAntinodes(): PointSet {
    const antinodes = new PointSet();

    this.antennasPositions.forEach((points) => {
      antinodes.addAll(
        this.findAntinodes(points).filter((p) => this.isInGrid(p))
      );
    });

    return antinodes;
  }

  protected findAntinodes(pointsToCheck: Point[]): Point[] {
    return pointsToCheck.flatMap((point, index) => {
      return this.findAntinodesFrom(point, pointsToCheck.toSpliced(index, 1));
    });
  }

  protected findAntinodesFrom(point: Point, pointsToCheck: Point[]): Point[] {
    return pointsToCheck.map((p) => point.getSymmetrical(p));
  }

  protected isInGrid(point: Point): boolean {
    return (
      point.getX() >= 0 &&
      point.getX() < this.grid[0].length - 1 &&
      point.getY() >= 0 &&
      point.getY() < this.grid.length
    );
  }
}

const cityMap = new CityMap(input);

const answer = cityMap.getAntinodes().size();

console.log(answer);
