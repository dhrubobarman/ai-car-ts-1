import { ControlType } from "./types";

export class Controls {
  forward: boolean;
  reverse: boolean;
  left: boolean;
  right: boolean;
  constructor(controlType: ControlType) {
    this.forward = false;
    this.reverse = false;
    this.left = false;
    this.right = false;
    switch (controlType) {
      case "KEYS":
        this.addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
    }
  }
  private addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (true) {
        case ["ArrowLeft", "a", "A"].includes(event.key):
          this.left = true;
          break;
        case ["ArrowRight", "d", "D"].includes(event.key):
          this.right = true;
          break;
        case ["ArrowDown", "s", "S"].includes(event.key):
          this.reverse = true;
          break;
        case ["ArrowUp", "w", "W"].includes(event.key):
          this.forward = true;
          break;
      }
    };
    document.onkeyup = (event) => {
      switch (true) {
        case ["ArrowLeft", "a", "A"].includes(event.key):
          this.left = false;
          break;
        case ["ArrowRight", "d", "D"].includes(event.key):
          this.right = false;
          break;
        case ["ArrowDown", "s", "S"].includes(event.key):
          this.reverse = false;
          break;
        case ["ArrowUp", "w", "W"].includes(event.key):
          this.forward = false;
          break;
      }
    };
  }
}
