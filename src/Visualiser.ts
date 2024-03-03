import { Level, NeuralNetwork } from "./Network";
import { getRGBA, lerp } from "./math/utils";

export class Visualiser {
  static drawNetwork(
    ctx: CanvasRenderingContext2D,
    network: NeuralNetwork | undefined
  ) {
    if (!network) return;

    const margin = 30;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1)
        );

      ctx.setLineDash([7, 3]);
      Visualiser.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? ["🠉", "🠈", "🠊", "🠋"] : []
      );
    }
  }
  static drawLevel(
    ctx: CanvasRenderingContext2D,
    level: Level,
    left: number,
    top: number,
    width: number,
    height: number,
    outputLevels: string[] = []
  ) {
    const right = left + width;
    const bottom = top + height;

    const nodeRadius = 18;

    const { inputs, outputs, weights, biases } = level;

    // Connections
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualiser.getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualiser.getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;

        ctx.strokeStyle = getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }

    // input nodes
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualiser.getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    // output nodes
    for (let i = 0; i < outputs.length; i++) {
      const x = Visualiser.getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLevels[i]) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = nodeRadius * 1.5 + "px Arial";
        ctx.fillText(outputLevels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLevels[i], x, top + nodeRadius * 0.1);
      }
    }
  }
  private static getNodeX(
    nodes: number[],
    index: number,
    left: number,
    right: number
  ) {
    return lerp(
      left,
      right,
      nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
