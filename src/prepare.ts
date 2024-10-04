import { getPositionIn, getPositionOut } from "./offsetCalculator";
import getInlineOption from "./getInlineOption";
import type { Options, ElementNode } from ".";

export default function prepare(
  elements: ElementNode[],
  options: Options,
  container: Window | Element
): ElementNode[] {
  elements.forEach((element) => {
    const { node } = element;
    const mirror = getInlineOption(node, "mirror", options.mirror);
    const once = getInlineOption(node, "once", options.once);
    const id = getInlineOption(node, "id");

    const customClassNames = options.useClassNames
      ? node.getAttribute("data-aos")?.split(" ") || []
      : [];

    const animatedClassNames = [
      options.animatedClassName,
      ...customClassNames,
    ].filter((className) => typeof className === "string");

    if (options.initClassName) {
      node.classList.add(options.initClassName);
    }

    element.position = {
      in: getPositionIn(node, options.offset, options.anchorPlacement, container),
      out: mirror && getPositionOut(node, options.offset, container),
    };

    element.options = {
      once,
      mirror,
      animatedClassNames,
      id,
    };
  });

  return elements;
}
