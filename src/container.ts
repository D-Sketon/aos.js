export const resolveContainer = (container: Window | Element | string) => {
  if (container instanceof Element || container === window) return container;
  return typeof container === "string"
    ? document.querySelector(container)
    : null;
};

export const getElementHeight = (container: Window | Element) => {
  return container === window
    ? container.innerHeight
    : (container as Element).clientHeight;
};

export const getElementOffset = (container: Window | Element) => {
  return container === window
    ? container.pageYOffset
    : (container as Element).scrollTop;
};
