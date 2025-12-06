const phoneRe =
  /iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|mobile|phone/i;
const tabletRe = /ipad|android(?!.*mobile)|tablet|kindle/i;

const check = (regex: RegExp) => regex.test(navigator.userAgent);

export default {
  phone: () => check(phoneRe),
  mobile: () => check(phoneRe) || check(tabletRe),
  tablet: () => check(tabletRe),
};
