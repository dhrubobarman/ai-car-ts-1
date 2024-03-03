import { average, getIntersection, getRandomColor } from "@/math/utils";
import type { InfoPoly, PolygonDrawOptions } from "@/types";
import Point from "./point";
import Segment from "./segment";

class Polygon {
  points: Point[];
  segments: Segment[];
  constructor(points: Point[]) {
    this.points = points;
    this.segments = [];
    for (let i = 1; i <= points.length; i++) {
      this.segments.push(new Segment(points[i - 1], points[i % points.length]));
    }
  }

  static load(info: InfoPoly) {
    return new Polygon(info.points.map((p) => Point.load(p)));
  }

  static union(polys: Polygon[]) {
    Polygon.multiBreak(polys);
    const kepTPoints = [];
    for (let i = 0; i < polys.length; i++) {
      for (const seg of polys[i].segments) {
        let keep = true;
        for (let j = 0; j < polys.length; j++) {
          if (i !== j) {
            if (polys[j].containsSegment(seg)) {
              keep = false;
              break;
            }
          }
        }
        if (keep) {
          kepTPoints.push(seg);
        }
      }
    }
    return kepTPoints;
  }
  static multiBreak(polys: Polygon[]) {
    for (let i = 0; i < polys.length - 1; i++) {
      for (let j = i + 1; j < polys.length; j++) {
        Polygon.break(polys[i], polys[j]);
      }
    }
  }
  static break(poly1: Polygon, poly2: Polygon) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        if (!segs1[i].p1 || !segs1[i].p2 || !segs2[j].p1 || !segs2[j].p2) {
          continue;
        }
        const intersection = getIntersection(
          segs1[i].p1,
          segs1[i].p2,
          segs2[j].p1,
          segs2[j].p2
        );
        if (
          intersection &&
          intersection.offset !== 1 &&
          intersection.offset !== 0
        ) {
          const point = new Point(intersection.x, intersection.y);
          let aux = segs1[i].p2;
          segs1[i].p2 = point;
          segs1.splice(i + 1, 0, new Segment(point, aux));
          aux = segs2[j].p2;
          segs2[j].p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }

  distanceToPoint(point: Point) {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
  }

  distanceToPolly(poly: Polygon) {
    return Math.min(...this.points.map((p) => poly.distanceToPoint(p)));
  }

  intersectsPoly(poly: Polygon) {
    for (let s1 of this.segments) {
      for (let s2 of poly.segments) {
        if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  containsSegment(seg: Segment) {
    const midPoint = average(seg.p1, seg.p2);
    return this.containsPoint(midPoint);
  }
  containsPoint(point: Point) {
    const outerPoint = new Point(-1000, -1000);
    let intersectionCount = 0;
    for (const seg of this.segments) {
      const int = getIntersection(outerPoint, point, seg.p1, seg.p2);
      if (int) {
        intersectionCount++;
      }
    }
    return intersectionCount % 2 === 1; // odd number of intersections means point is inside polygon
  }

  drawSegments(ctx: CanvasRenderingContext2D) {
    for (const seg of this.segments) {
      seg.draw(ctx, { strokeStyle: getRandomColor(), width: 5 });
    }
    // return this; // for chaining
  }

  draw(ctx: CanvasRenderingContext2D, options?: PolygonDrawOptions) {
    const {
      strokeStyle = "blue",
      lineWidth = 2,
      fillStyle = "rgba(0,0,255,0.3)",
      ...rest
    } = options || {};

    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    if (rest) {
      Object.assign(ctx, rest);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
export default Polygon;
