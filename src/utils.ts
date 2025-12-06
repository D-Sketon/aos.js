export function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: number | undefined;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle(func: (...args: any[]) => void, limit: number) {
  let lastFunc: number | undefined, lastRan: number;

  return (...args: any[]) => {
    const now = Date.now();
    if (!lastRan || now - lastRan >= limit) {
      func(...args);
      lastRan = now;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        func(...args);
        lastRan = Date.now();
      }, limit - (now - lastRan));
    }
  };
}
