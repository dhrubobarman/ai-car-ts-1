import { discard, save } from "@/main";
import { createElement } from "./createElement";

export const carCanvas = createElement("canvas", {
  id: "environment",
});
export const controls = createElement("div", {
  className:
    "controls flex gap-2 items-center absolute bottom-2 left-2 right-2 justify-center",
});
export const networkCanvas = createElement("canvas", {
  id: "nCanvas",
});

const buttonStyle =
  "select-none rounded-md py-[10px] px-6 text-center align-middle font-sans text-xs font-bold uppercase  shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.6] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";

const iconButtonStyle =
  "select-none rounded-md py-[8px] px-[8px] text-center align-middle font-sans text-md font-bold uppercase  shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.6] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";

export const saveButton = createElement(
  "button",
  {
    className: `bg-gray-900 text-white ${iconButtonStyle}`,
    innerText: "💾",
    onclick: save,
  },
  controls
);

export const deleteButton = createElement(
  "button",
  {
    className: `bg-gray-900 text-white ${iconButtonStyle}`,
    innerText: "🗑️",
    onclick: discard,
  },
  controls
);
