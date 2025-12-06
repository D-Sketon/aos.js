import type { ElementNode } from ".";
import { getElementOffset } from "./container";

const fireEvent = (eventName: string, detail: any) =>
  document.dispatchEvent(
    new CustomEvent(eventName, {
      detail,
    })
  );

const toggleClasses = (el: ElementNode, isVisible: boolean) => {
  if (el.animated === isVisible) return;
  const { options, node } = el;
  const eventName = isVisible ? "aos:in" : "aos:out";
  const action = isVisible ? "add" : "remove";

  options.animatedClassNames?.forEach((className) => node.classList[action](className));
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
