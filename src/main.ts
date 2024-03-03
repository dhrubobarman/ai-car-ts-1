import { Car } from "./Car";
import { Road } from "./Road";
import "./style.scss";
import { canvas } from "./utils";
import "./utils/helperElements";

canvas.width = 200;

const ctx = canvas.getContext("2d")!;

const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(road.getlaneCenter(1), 100, 30, 50);

const animate = () => {
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.update(road.borders);
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
};
animate();
