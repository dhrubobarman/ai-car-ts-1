import type { InfoSegment, SegmentDrawOptions } from "@/types";
import Point from "@/primitives/point";
import {
  add,
  distance,
  dot,
  magnitude,
  normalize,
  scale,
  subtract,
} from "@/math/utils";
class Segment {
  p1: Point;
  p2: Point;
  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }
  static load(info: InfoSegment) {
    return new Segment(Point.load(info.p1), Point.load(info.p2));
  }
  length() {
    return distance(this.p1, this.p2);
  }
  directionVector() {
    return normalize(subtract(this.p2, this.p1));
  }
  equals(segment: Segment) {
    return this.includes(segment.p1) && this.includes(segment.p2);
  }
  includes(point: Point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }
  distanceToPoint(point: Point) {
    const proj = this.projectPoint(point);
    if (proj.offset > 0 && proj.offset < 1) {
      return distance(point, proj.point);
    }
    const distToP1 = distance(point, this.p1);
    const distToP2 = distance(point, this.p2);
    return Math.min(distToP1, distToP2);
  }
  projectPoint(point: Point) {
    const a = subtract(point, this.p1);
    const b = subtract(this.p2, this.p1);
    const normB = normalize(b);
    const scaler = dot(a, normB);
    const proj = {
      point: add(this.p1, scale(normB, scaler)),
      offset: scaler / magnitude(b),
    };
    return proj;
  }
  draw(ctx: CanvasRenderingContext2D, options?: SegmentDrawOptions) {
    const {
      width = 2,
      strokeStyle = "black",
      dash = [],
      ...rest
    } = options || {};
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = strokeStyle;
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.setLineDash(dash);
    if (rest) {
      Object.assign(ctx, rest);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
}

export default Segment;
