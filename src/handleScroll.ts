import type { ElementNode } from ".";
import { getElementOffset } from "./container";

const updateClasses = (
  node: HTMLElement,
  classes?: string[],
  action: "add" | "remove" = "add"
) => classes?.forEach((className) => node.classList[action](className));

const fireEvent = (eventName: string, data: any) =>
  document.dispatchEvent(
    new CustomEvent(eventName, {
      detail: data,
    })
  );

const toggleClasses = (el: ElementNode, isVisible: boolean) => {
  if (el.animated === isVisible) return;
  const { options, node } = el;
  const eventName = isVisible ? "aos:in" : "aos:out";
  const action = isVisible ? "add" : "remove";

  updateClasses(node, options.animatedClassNames, action);
  fireEvent(eventName, node);

  if (options.id) {
    fireEvent(`${eventName}:${options.id}`, node);
  }

  el.animated = isVisible;
};

const applyClasses = (el: ElementNode, top: number) => {
  const { options, position } = el;

  if (options.mirror && top >= position.out && !options.once) {
    toggleClasses(el, false);
  } else if (top >= position.in) {
    toggleClasses(el, true);
  } else if (el.animated && !options.once) {
    toggleClasses(el, false);
  }
};

export default (elements: ElementNode[], container: Window | Element) => {
  elements.forEach((el) => applyClasses(el, getElementOffset(container)));
};
