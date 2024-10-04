const phoneRe =
  /iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|mobile|phone/i;
const tabletRe = /ipad|android(?!.*mobile)|tablet|kindle/i;

function ua() {
  return navigator.userAgent;
}

class Detector {
  userAgent = ua();

  phone() {
    return phoneRe.test(this.userAgent);
  }

  mobile() {
    return phoneRe.test(this.userAgent) || tabletRe.test(this.userAgent);
  }

  tablet() {
    return tabletRe.test(this.userAgent);
  }
}

export default new Detector();
