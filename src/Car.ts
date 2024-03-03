import { Controls } from "./Controls";
import { NeuralNetwork } from "./Network";
import { Sensor } from "./Sensor";
import { numberToBool, polygonIntersect } from "./math/utils";
import { ControlType, TPoint } from "./types";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controls: Controls;
  speed: number;
  acceleration: number;
  maxSpeed: number;
  friction: number;
  angle: number;
  sensor: Sensor | undefined;
  polygon: TPoint[];
  damaged: boolean;
  brain: NeuralNetwork | undefined;
  useBrain: boolean;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: ControlType,
    maxSpeed = 3
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.polygon = [];
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.useBrain = controlType === "AI";

    this.damaged = false;

    this.controls = new Controls(controlType);

    if (controlType !== "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 8, 4]);
    }
  }
  private move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  private createPolygon() {
    const points: TPoint[] = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }
  private assesDamage(roadBorders: TPoint[][], traffic: Car[] = []) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polygonIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polygonIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  update(roadBorders: TPoint[][], traffic: Car[] = []) {
    if (!this.damaged) {
      this.move();
      this.polygon = this.createPolygon();
      this.damaged = this.assesDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
    if (this.brain && this.sensor) {
      const offsets = this.sensor.readings.map((s) =>
        s === null || s === undefined ? 0 : 1 - s.offset
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      if (this.useBrain) {
        this.controls.forward = numberToBool(outputs[0]);
        this.controls.left = numberToBool(outputs[1]);
        this.controls.right = numberToBool(outputs[2]);
        this.controls.reverse = numberToBool(outputs[3]);
      }
    }
  }
  draw(ctx: CanvasRenderingContext2D, color = "black") {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();
    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
