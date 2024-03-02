import "./utils/helperElements";
import "./style.scss";
import { canvas } from "./utils";

canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext("2d")!;

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(animate);
};
animate();
