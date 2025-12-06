import getInlineOption from "./getInlineOption";
import { getElementHeight } from "./container";

const getOffsetTop = function (el: HTMLElement, container: Window | Element) {
  let top = 0;

  while (el) {
    top += el.offsetTop - (el.tagName != "BODY" ? el.scrollTop : 0);
    el =
      el.offsetParent === container ? null : (el.offsetParent as HTMLElement);
  }

  return top;
};

const getAnchor = (el: HTMLElement, container: Window | Element) => {
  const anchor = getInlineOption(el, "anchor");
  if (anchor) {
    const queryResult = (
      (container === window ? document : container) as HTMLElement
    ).querySelector(anchor);
    if (queryResult) return queryResult as HTMLElement;
  }
  return el;
};

export const getPositionIn = (
  el: HTMLElement,
  defaultOffset: number,
  defaultAnchorPlacement: string,
  container: Window | Element
) => {
  const containerHeight = getElementHeight(container);
  const inlineAnchorPlacement = getInlineOption(el, "anchor-placement");
  const additionalOffset = Number(
    getInlineOption(el, "offset", inlineAnchorPlacement ? 0 : defaultOffset)
  );
  const anchorPlacement = inlineAnchorPlacement || defaultAnchorPlacement;

  const finalEl = getAnchor(el, container);
  let triggerPoint = getOffsetTop(finalEl, container) - containerHeight;

  const [elementPart, viewportPart] = anchorPlacement.split("-");

  if (viewportPart === "center") {
    triggerPoint += containerHeight / 2;
  } else if (viewportPart === "top") {
    triggerPoint += containerHeight;
  }

  if (elementPart === "center") {
    triggerPoint += finalEl.offsetHeight / 2;
  } else if (elementPart === "bottom") {
    triggerPoint += finalEl.offsetHeight;
  }

  return triggerPoint + additionalOffset;
};

export const getPositionOut = (
  el: HTMLElement,
  defaultOffset: number,
  container: Window | Element
) => {
  const additionalOffset = getInlineOption(el, "offset", defaultOffset);
  const finalEl = getAnchor(el, container);
  return (
    getOffsetTop(finalEl, container) + finalEl.offsetHeight - additionalOffset
  );
};
