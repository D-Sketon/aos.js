import { throttle, debounce } from "es-toolkit";
import detect from "./detector";
import handleScroll from "./handleScroll";
import prepare from "./prepare";
import observe from "./observer";
import { resolveContainer } from "./container";

export interface Options {
  offset: number;
  delay: number;
  easing: string;
  duration: number;
  disable: boolean | "mobile" | "phone" | "tablet" | (() => boolean);
  once: boolean;
  mirror: boolean;
  anchorPlacement: string;
  startEvent: string;
  animatedClassName: string;
  initClassName: string;
  useClassNames: boolean;
  disableMutationObserver: boolean;
  throttleDelay: number;
  debounceDelay: number;
  container: Window | Element | string;
}

export interface ElementNode {
  node: HTMLElement;
  position?: {
    in: number;
    out?: number;
  };
  options?: {
    once: boolean;
    mirror: boolean;
    animatedClassNames: string[];
    id: string;
  };
  animated?: boolean;
}

const defaultOptions: Options = {
  offset: 120,
  delay: 0,
  easing: "ease",
  duration: 400,
  disable: false,
  once: false,
  mirror: false,
  anchorPlacement: "top-bottom",
  startEvent: "DOMContentLoaded",
  animatedClassName: "aos-animate",
  initClassName: "aos-init",
  useClassNames: false,
  disableMutationObserver: false,
  throttleDelay: 99,
  debounceDelay: 50,
  container: window,
};

class Aos {
  elements: ElementNode[] = [];
  initialized = false;
  options = defaultOptions;
  container: Window | Element | null = null;
  observer: MutationObserver | null = null;

  scrollHandler: (...args: any[]) => void | null = null;
  resizeHandler: (...args: any[]) => void | null = null;
  startHandler: {
    handler: (...args: any[]) => void;
    type: "document" | "window";
  } | null = null;

  static getElements(container: Window | Element): ElementNode[] {
    return [
      ...(
        (container === window ? document : container) as HTMLElement
      ).querySelectorAll<HTMLElement>("[data-aos]"),
    ].map((node) => ({
      node,
    }));
  }

  static isDisabled(
    optionDisable: boolean | "mobile" | "phone" | "tablet" | (() => boolean)
  ): boolean {
    return (
      optionDisable === true ||
      (optionDisable === "mobile" && detect.mobile()) ||
      (optionDisable === "phone" && detect.phone()) ||
      (optionDisable === "tablet" && detect.tablet()) ||
      (typeof optionDisable === "function" && optionDisable() === true)
    );
  }

  initializeScroll(): ElementNode[] {
    const { container } = this;
    this.elements = prepare(this.elements, this.options, container);
    handleScroll(this.elements, this.container);

    this.scrollHandler = throttle(() => {
      handleScroll(this.elements, container);
    }, this.options.throttleDelay);

    container.addEventListener("scroll", this.scrollHandler, {
      passive: true,
    });
    return this.elements;
  }

  init(options: Partial<Options> = {}): void {
    this.destroy();
    this.options = { ...defaultOptions, ...options };
    const container = resolveContainer(this.options.container);
    if (!container) {
      throw `AOS - cannot find the container element. The container option must be an HTMLElement or a CSS Selector.`;
    }
    this.elements = Aos.getElements(container);
    this.container = container;

    if (Aos.isDisabled(this.options.disable)) {
      return this.disable();
    }

    if (!this.options.disableMutationObserver) {
      this.observer = observe(this.refreshHard.bind(this));
    }

    document.body.setAttribute("data-aos-easing", this.options.easing);
    document.body.setAttribute(
      "data-aos-duration",
      this.options.duration as any
    );
    document.body.setAttribute("data-aos-delay", this.options.delay as any);

    this.startHandler = {
      handler: this.refresh.bind(this),
      type: "document",
    };

    if (!["DOMContentLoaded", "load"].includes(this.options.startEvent)) {
      document.addEventListener(
        this.options.startEvent,
        this.startHandler.handler
      );
    } else {
      window.addEventListener("load", this.startHandler.handler);
      this.startHandler.type = "window";
    }

    if (
      this.options.startEvent === "DOMContentLoaded" &&
      ["complete", "interactive"].indexOf(document.readyState) > -1
    ) {
      this.refresh(true);
    }

    this.resizeHandler = debounce(
      this.refresh.bind(this),
      this.options.debounceDelay
    );

    window.addEventListener("resize", this.resizeHandler);

    window.addEventListener("orientationchange", this.resizeHandler);
  }

  refresh(initialize = false) {
    if (initialize) {
      this.initialized = true;
    }
    if (this.initialized) {
      this.initializeScroll();
    }
  }

  refreshHard() {
    this.elements = Aos.getElements(this.container);

    if (Aos.isDisabled(this.options.disable)) {
      return this.disable();
    }
    this.refresh();
  }

  disable() {
    this.elements.forEach(({ node }) => {
      node.removeAttribute("data-aos");
      node.removeAttribute("data-aos-easing");
      node.removeAttribute("data-aos-duration");
      node.removeAttribute("data-aos-delay");

      if (this.options.initClassName) {
        node.classList.remove(this.options.initClassName);
      }

      if (this.options.animatedClassName) {
        node.classList.remove(this.options.animatedClassName);
      }
    });
  }

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
    if (this.startHandler) {
      const { handler, type } = this.startHandler;
      if (type === "document") {
        document.removeEventListener(this.options.startEvent, handler);
      } else {
        window.removeEventListener("load", handler);
      }
      this.startHandler = null;
    }
    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      this.scrollHandler = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      window.removeEventListener("orientationchange", this.resizeHandler);
      this.resizeHandler = null;
    }
  }
}

export default new Aos();
