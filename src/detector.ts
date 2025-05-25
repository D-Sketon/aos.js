const phoneRe =
  /iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|mobile|phone/i;
const tabletRe = /ipad|android(?!.*mobile)|tablet|kindle/i;

export default {
  phone: () => phoneRe.test(navigator.userAgent),
  mobile: () =>
    phoneRe.test(navigator.userAgent) || tabletRe.test(navigator.userAgent),
  tablet: () => tabletRe.test(navigator.userAgent),
};
