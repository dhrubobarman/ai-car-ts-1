export const appContainer = document.querySelector("#app")!;

export function createElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?: Partial<HTMLElementTagNameMap[T]>,
  appendToElement: Element | null | false = appContainer
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag);
  if (attributes) {
    Object.assign(element, attributes);
  }
  if (appendToElement) appendToElement.appendChild(element);
  return element;
}
