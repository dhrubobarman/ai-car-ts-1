import { Car } from "./Car";
import "./style.scss";
import { canvas } from "./utils";
import "./utils/helperElements";

canvas.width = 200;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;

const car = new Car(100, 100, 30, 50);

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.update();
  car.draw(ctx);

  requestAnimationFrame(animate);
};
animate();
