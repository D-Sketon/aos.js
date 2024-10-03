export default (el: Element, key: string, fallback?: any) => {
  const attr = el.getAttribute(`data-aos-${key}`);

  if (attr === "true") return true;
  if (attr === "false") return false;

  return attr || fallback;
};
