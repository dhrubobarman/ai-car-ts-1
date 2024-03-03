import type { TPoint, PointDrawOptions } from "@/types";

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  static load(info: TPoint) {
    return new Point(info.x, info.y);
  }

  equals(point: Point | TPoint) {
    return this.x === point.x && this.y === point.y;
  }

  draw(ctx: CanvasRenderingContext2D, options?: PointDrawOptions) {
    const {
      size = 18,
      fillStyle = "black",
      outline = false,
      fillPoint = false,
      ...rest
    } = options || {};
    const rad = size / 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, rad, 0, 2 * Math.PI);
    ctx.fillStyle = fillStyle;

    Object.assign(ctx, rest);
    ctx.fill();
    if (outline) {
      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.arc(this.x, this.y, rad * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (fillPoint) {
      ctx.beginPath();
      ctx.fillStyle = "yellow";
      ctx.arc(this.x, this.y, rad * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default Point;
