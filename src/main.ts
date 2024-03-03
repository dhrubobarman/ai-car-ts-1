import { Car } from "./Car";
import { NeuralNetwork } from "./Network";
import { Road } from "./Road";
import { Visualiser } from "./Visualiser";
import { getRandomColor } from "./math/utils";
import "./style.scss";
import { carCanvas, networkCanvas } from "./utils";
import "./utils/helperElements";

carCanvas.width = 200;
networkCanvas.width = window.innerWidth - (carCanvas.width + 30);

const carCtx = carCanvas.getContext("2d")!;
const networkCtx = networkCanvas.getContext("2d")!;

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);
const cars = generateCars(1);
const traffic = [
  new Car(road.getlaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getlaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getlaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getlaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getlaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getlaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getlaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  console.log("loading best brain");
  for (const car of cars) {
    car.brain = JSON.parse(localStorage.getItem("bestBrain")!);
    NeuralNetwork.mutate(car.brain!, 0.2);
  }

  bestCar.brain = JSON.parse(localStorage.getItem("bestBrain")!);
}

export function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
export function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(n: number) {
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push(new Car(road.getlaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

const animate = (time: number = 0) => {
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);

  for (const car of traffic) {
    car.update(road.borders, []);
  }
  for (const car of cars) {
    car.update(road.borders, traffic);
  }
  bestCar =
    cars.find((c) => c.y === Math.min(...cars.map((c) => c.y))) || cars[0];

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  for (const trafficCar of traffic) {
    trafficCar.draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (const car of cars) {
    car.draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualiser.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
};
animate();
