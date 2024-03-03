import { Car } from "./Car";
import { Road } from "./Road";
import "./style.scss";
import { canvas } from "./utils";
import "./utils/helperElements";

canvas.width = 200;

const ctx = canvas.getContext("2d")!;

const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(road.getlaneCenter(1), 100, 30, 50, "AI");
const traffic = [new Car(road.getlaneCenter(1), -100, 30, 50, "DUMMY", 2)];

const animate = () => {
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const car of traffic) {
    car.update(road.borders, []);
  }
  car.update(road.borders, traffic);
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);
  road.draw(ctx);
  for (const trafficCar of traffic) {
    trafficCar.draw(ctx, "red");
  }
  car.draw(ctx, "blue");

  ctx.restore();
  requestAnimationFrame(animate);
};
animate();
