import getInlineOption from "./getInlineOption";
import { getElementHeight, getElementOffset } from "./container";

const getOffset = function (el: HTMLElement, container: Window | Element) {
  let left = 0;
  let top = 0;

  while (el) {
    left += el.offsetLeft - (el.tagName != "BODY" ? el.scrollLeft : 0);
    top += el.offsetTop - (el.tagName != "BODY" ? el.scrollTop : 0);
    el =
      el.offsetParent === container ? null : (el.offsetParent as HTMLElement);
  }

  return {
    top,
    left,
  };
};

export const getPositionIn = (
  el: HTMLElement,
  defaultOffset: number,
  defaultAnchorPlacement: string,
  container: Window | Element
) => {
  const containerHeight = getElementHeight(container);
  const anchor = getInlineOption(el, "anchor");
  const inlineAnchorPlacement = getInlineOption(el, "anchor-placement");
  const additionalOffset = Number(
    getInlineOption(el, "offset", inlineAnchorPlacement ? 0 : defaultOffset)
  );
  const anchorPlacement = inlineAnchorPlacement || defaultAnchorPlacement;

  let finalEl = el;

  if (anchor) {
    const queryResult = (
      (container === window ? document : container) as HTMLElement
    ).querySelector(anchor);
    if (queryResult) finalEl = queryResult;
  }

  let triggerPoint = getOffset(finalEl, container).top - containerHeight;

  switch (anchorPlacement) {
    case "top-bottom":
      // Default offset
      break;
    case "center-bottom":
      triggerPoint += finalEl.offsetHeight / 2;
      break;
    case "bottom-bottom":
      triggerPoint += finalEl.offsetHeight;
      break;
    case "top-center":
      triggerPoint += containerHeight / 2;
      break;
    case "center-center":
      triggerPoint += containerHeight / 2 + finalEl.offsetHeight / 2;
      break;
    case "bottom-center":
      triggerPoint += containerHeight / 2 + finalEl.offsetHeight;
      break;
    case "top-top":
      triggerPoint += containerHeight;
      break;
    case "bottom-top":
      triggerPoint += containerHeight + finalEl.offsetHeight;
      break;
    case "center-top":
      triggerPoint += containerHeight + finalEl.offsetHeight / 2;
      break;
  }

  return triggerPoint + additionalOffset;
};

export const getPositionOut = (
  el: HTMLElement,
  defaultOffset: number,
  container: Window | Element
) => {
  const anchor = getInlineOption(el, "anchor");
  const additionalOffset = getInlineOption(el, "offset", defaultOffset);
  let finalEl = el;

  if (anchor) {
    const queryResult = (
      (container === window ? document : container) as HTMLElement
    ).querySelector(anchor);
    if (queryResult) finalEl = queryResult;
  }

  const elementOffsetTop = getOffset(finalEl, container).top;

  return elementOffsetTop + finalEl.offsetHeight - additionalOffset;
};
