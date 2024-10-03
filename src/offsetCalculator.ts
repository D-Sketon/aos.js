import getInlineOption from "./getInlineOption";

const getOffset = function (el: HTMLElement) {
  let left = 0;
  let top = 0;

  while (el) {
    left += el.offsetLeft - (el.tagName != "BODY" ? el.scrollLeft : 0);
    top += el.offsetTop - (el.tagName != "BODY" ? el.scrollTop : 0);
    el = el.offsetParent as HTMLElement;
  }

  return {
    top,
    left,
  };
};

export const getPositionIn = (
  el: HTMLElement,
  defaultOffset: number,
  defaultAnchorPlacement: string
) => {
  const windowHeight = window.innerHeight;
  const anchor = getInlineOption(el, "anchor");
  const inlineAnchorPlacement = getInlineOption(el, "anchor-placement");
  const additionalOffset = Number(
    getInlineOption(el, "offset", inlineAnchorPlacement ? 0 : defaultOffset)
  );
  const anchorPlacement = inlineAnchorPlacement || defaultAnchorPlacement;

  const finalEl = anchor
    ? (document.querySelector(anchor) as HTMLElement) || el
    : el;

  let triggerPoint = getOffset(finalEl).top - windowHeight;

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
      triggerPoint += windowHeight / 2;
      break;
    case "center-center":
      triggerPoint += windowHeight / 2 + finalEl.offsetHeight / 2;
      break;
    case "bottom-center":
      triggerPoint += windowHeight / 2 + finalEl.offsetHeight;
      break;
    case "top-top":
      triggerPoint += windowHeight;
      break;
    case "bottom-top":
      triggerPoint += windowHeight + finalEl.offsetHeight;
      break;
    case "center-top":
      triggerPoint += windowHeight + finalEl.offsetHeight / 2;
      break;
  }

  return triggerPoint + additionalOffset;
};

export const getPositionOut = (el: HTMLElement, defaultOffset: number) => {
  const anchor = getInlineOption(el, "anchor");
  const additionalOffset = getInlineOption(el, "offset", defaultOffset);
  const finalEl = anchor
    ? (document.querySelector(anchor) as HTMLElement) || el
    : el;

  const elementOffsetTop = getOffset(finalEl).top;

  return elementOffsetTop + finalEl.offsetHeight - additionalOffset;
};
