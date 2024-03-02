import { angle, subtract, translate } from "@/math/utils";
import Polygon from "./Polygon";
import Segment from "./segment";
import { EnvelopeDrawOptions, InfoEnvelope } from "@/types";
import Point from "./point";

class Envelope {
  skeleton!: Segment;
  poly!: Polygon;
  constructor(skeleton?: Segment, width?: number, roundness = 1) {
    if (skeleton && width) {
      this.skeleton = skeleton;
      this.poly = this.generatePolygon(width, roundness);
    }
  }
  static load(info: InfoEnvelope) {
    const env = new Envelope();
    env.skeleton = new Segment(
      new Point(info.skeleton.p1.x, info.skeleton.p1.y),
      new Point(info.skeleton.p2.x, info.skeleton.p2.y)
    );
    env.poly = Polygon.load(info.poly);
    return env;
  }
  private generatePolygon(width: number, roundness: number) {
    const { p1, p2 } = this.skeleton;
    const radius = width / 2;
    const alpha = angle(subtract(p1, p2));
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;

    const points = [];
    const step = Math.PI / Math.max(roundness, 1);
    const eps = step / 2;
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p1, i, radius));
    }
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    return new Polygon(points);
  }
  draw(ctx: CanvasRenderingContext2D, options?: EnvelopeDrawOptions) {
    this.poly.draw(ctx, options);
  }
}
export default Envelope;
