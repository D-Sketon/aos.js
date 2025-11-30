import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPositionIn, getPositionOut } from "../src/offsetCalculator";
import * as containerModule from "../src/container";
import getInlineOption from "../src/getInlineOption";

vi.mock("../src/container", () => ({
  getElementHeight: vi.fn(),
}));

vi.mock("../src/getInlineOption", () => ({
  default: vi.fn(),
}));

describe("offsetCalculator", () => {
  let el: HTMLElement;
  let container: Window;

  beforeEach(() => {
    el = document.createElement("div");
    container = window;
    vi.resetAllMocks();
  });

  describe("getPositionIn", () => {
    beforeEach(() => {
      vi.mocked(containerModule.getElementHeight).mockReturnValue(1000);
      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "anchor") return null;
          if (key === "anchor-placement") return null;
          if (key === "offset") return fallback;
          return null;
        }
      );
      Object.defineProperty(el, "offsetTop", {
        value: 500,
        configurable: true,
      });
      Object.defineProperty(el, "offsetLeft", { value: 0, configurable: true });
      Object.defineProperty(el, "scrollTop", { value: 0, configurable: true });
      Object.defineProperty(el, "scrollLeft", { value: 0, configurable: true });
      Object.defineProperty(el, "offsetHeight", {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(el, "offsetParent", {
        value: null,
        configurable: true,
      });
    });

    it("should calculate position correctly with default options", () => {
      const result = getPositionIn(el, 0, "top-bottom", container);
      expect(result).toBe(-500); // 500 - 1000
    });

    it('should handle anchor placement "top-center"', () => {
      const result = getPositionIn(el, 0, "top-center", container);
      expect(result).toBe(0); // -500 + 500
    });

    it('should handle anchor placement "bottom-top"', () => {
      const result = getPositionIn(el, 0, "bottom-top", container);
      expect(result).toBe(600); // -500 + 1000 + 100
    });

    it('should handle anchor placement "center-center"', () => {
      // -500 + 500 + 50 = 50
      const result = getPositionIn(el, 0, "center-center", container);
      expect(result).toBe(50);
    });

    it('should handle anchor placement "bottom-center"', () => {
      // -500 + 500 + 100 = 100
      const result = getPositionIn(el, 0, "bottom-center", container);
      expect(result).toBe(100);
    });

    it('should handle anchor placement "top-top"', () => {
      // -500 + 1000 = 500
      const result = getPositionIn(el, 0, "top-top", container);
      expect(result).toBe(500);
    });

    it('should handle anchor placement "center-top"', () => {
      // -500 + 1000 + 50 = 550
      const result = getPositionIn(el, 0, "center-top", container);
      expect(result).toBe(550);
    });

    it('should handle anchor placement "center-bottom"', () => {
      // -500 + 50 = -450
      const result = getPositionIn(el, 0, "center-bottom", container);
      expect(result).toBe(-450);
    });

    it('should handle anchor placement "bottom-bottom"', () => {
      // -500 + 100 = -400
      const result = getPositionIn(el, 0, "bottom-bottom", container);
      expect(result).toBe(-400);
    });

    it("should handle anchor option", () => {
      const anchorEl = document.createElement("div");
      Object.defineProperty(anchorEl, "offsetTop", {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(anchorEl, "offsetParent", {
        value: null,
        configurable: true,
      });
      Object.defineProperty(anchorEl, "offsetHeight", {
        value: 50,
        configurable: true,
      });

      document.body.appendChild(anchorEl);
      anchorEl.id = "anchor";

      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "anchor") return "#anchor";
          if (key === "offset") return fallback;
          return null;
        }
      );

      // anchor top 200. container height 1000.
      // triggerPoint = 200 - 1000 = -800
      // default placement top-bottom

      const result = getPositionIn(el, 0, "top-bottom", container);
      expect(result).toBe(-800);

      document.body.removeChild(anchorEl);
    });
    it("should handle anchor option but anchor not found", () => {
      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "anchor") return "#not-found";
          if (key === "offset") return fallback;
          return null;
        }
      );

      // Should fallback to el
      // triggerPoint = 500 - 1000 = -500

      const result = getPositionIn(el, 0, "top-bottom", container);
      expect(result).toBe(-500);
    });

    it("should calculate offset with nested elements", () => {
      const parent = document.createElement("div");
      Object.defineProperty(parent, "offsetLeft", {
        value: 10,
        configurable: true,
      });
      Object.defineProperty(parent, "offsetTop", {
        value: 20,
        configurable: true,
      });
      Object.defineProperty(parent, "scrollLeft", {
        value: 5,
        configurable: true,
      });
      Object.defineProperty(parent, "scrollTop", {
        value: 5,
        configurable: true,
      });
      Object.defineProperty(parent, "offsetParent", {
        value: null,
        configurable: true,
      }); // Stop here for simplicity
      Object.defineProperty(parent, "tagName", {
        value: "DIV",
        configurable: true,
      });

      Object.defineProperty(el, "offsetParent", {
        value: parent,
        configurable: true,
      });

      // el offset: 0, 500.
      // parent offset: 10, 20. scroll: 5, 5.

      // Loop 1 (el):
      // left += 0 - 0 = 0
      // top += 500 - 0 = 500
      // el = parent

      // Loop 2 (parent):
      // left += 10 - 5 = 5
      // top += 20 - 5 = 515
      // el = null

      // Result top: 515.
      // triggerPoint = 515 - 1000 = -485

      const result = getPositionIn(el, 0, "top-bottom", container);
      expect(result).toBe(-485);
    });

    it("should handle BODY tag in offset calculation", () => {
      const body = document.createElement("body");
      Object.defineProperty(body, "offsetLeft", {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(body, "offsetTop", {
        value: 0,
        configurable: true,
      });
      Object.defineProperty(body, "scrollLeft", {
        value: 10,
        configurable: true,
      });
      Object.defineProperty(body, "scrollTop", {
        value: 10,
        configurable: true,
      });
      Object.defineProperty(body, "offsetParent", {
        value: null,
        configurable: true,
      });
      Object.defineProperty(body, "tagName", {
        value: "BODY",
        configurable: true,
      });

      Object.defineProperty(el, "offsetParent", {
        value: body,
        configurable: true,
      });

      // Loop 1 (el): top += 500
      // Loop 2 (body): top += 0 - 0 (scroll ignored for BODY)

      const result = getPositionIn(el, 0, "top-bottom", container);
      expect(result).toBe(-500);
    });

    it("should handle container as Element", () => {
      const containerEl = document.createElement("div");
      // Mock getElementHeight to return 1000 for this container
      vi.mocked(containerModule.getElementHeight).mockReturnValue(1000);

      Object.defineProperty(el, "offsetParent", {
        value: containerEl,
        configurable: true,
      });

      // Loop 1 (el): top += 500.
      // el.offsetParent === containerEl. True.
      // el = null.

      const result = getPositionIn(el, 0, "top-bottom", containerEl);
      expect(result).toBe(-500);
    });

    it("should use 0 as default offset if anchor-placement is inline", () => {
      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "anchor-placement") return "top-center";
          if (key === "offset") return fallback;
          return null;
        }
      );

      getPositionIn(el, 100, "top-bottom", container);
      expect(getInlineOption).toHaveBeenCalledWith(
        expect.anything(),
        "offset",
        0
      );
    });

    it("should query anchor in custom container", () => {
      const containerEl = document.createElement("div");
      const anchorEl = document.createElement("div");
      anchorEl.id = "anchor";
      containerEl.appendChild(anchorEl);

      // Mock getElementHeight for containerEl
      vi.mocked(containerModule.getElementHeight).mockReturnValue(1000);

      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "anchor") return "#anchor";
          if (key === "offset") return fallback;
          return null;
        }
      );

      // anchorEl offsetTop is 0 relative to containerEl (since it's first child and no styles)
      // But we need to mock offset properties if we want specific values.
      // Since we are using getOffset which traverses offsetParent, we need to set that up.

      Object.defineProperty(anchorEl, "offsetTop", {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(anchorEl, "offsetParent", {
        value: containerEl,
        configurable: true,
      });
      Object.defineProperty(anchorEl, "offsetHeight", {
        value: 50,
        configurable: true,
      });

      // We need to make sure querySelector works on containerEl
      // jsdom supports querySelector, so appending child should work.

      const result = getPositionIn(el, 0, "top-bottom", containerEl);

      // anchor top 200. container height 1000.
      // triggerPoint = 200 - 1000 = -800
      expect(result).toBe(-800);
    });
  });

  describe("getPositionOut", () => {
    beforeEach(() => {
      Object.defineProperty(el, "offsetTop", {
        value: 500,
        configurable: true,
      });
      Object.defineProperty(el, "offsetLeft", { value: 0, configurable: true });
      Object.defineProperty(el, "scrollTop", { value: 0, configurable: true });
      Object.defineProperty(el, "scrollLeft", { value: 0, configurable: true });
      Object.defineProperty(el, "offsetHeight", {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(el, "offsetParent", {
        value: null,
        configurable: true,
      });
    });

    it("should calculate position out correctly", () => {
      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "offset") return fallback;
          return null;
        }
      );

      Object.defineProperty(el, "offsetTop", {
        value: 500,
        configurable: true,
      });
      Object.defineProperty(el, "offsetHeight", {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(el, "offsetParent", {
        value: null,
        configurable: true,
      });

      // elementOffsetTop = 500
      // return 500 + 100 - 0 = 600

      const result = getPositionOut(el, 0, container);
      expect(result).toBe(600);
    });

    it("should handle anchor option", () => {
      const anchorEl = document.createElement("div");
      Object.defineProperty(anchorEl, "offsetTop", {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(anchorEl, "offsetParent", {
        value: null,
        configurable: true,
      });
      Object.defineProperty(anchorEl, "offsetHeight", {
        value: 50,
        configurable: true,
      });

      document.body.appendChild(anchorEl);
      anchorEl.id = "anchor";

      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "anchor") return "#anchor";
          if (key === "offset") return fallback;
          return null;
        }
      );

      // anchor top 200. anchor height 50.
      // return 200 + 50 - 0 = 250

      const result = getPositionOut(el, 0, container);
      expect(result).toBe(250);

      document.body.removeChild(anchorEl);
    });
    it("should handle anchor option but anchor not found", () => {
      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "anchor") return "#not-found";
          if (key === "offset") return fallback;
          return null;
        }
      );

      // Should fallback to el
      // return 500 + 100 - 0 = 600

      const result = getPositionOut(el, 0, container);
      expect(result).toBe(600);
    });

    it("should query anchor in custom container", () => {
      const containerEl = document.createElement("div");
      const anchorEl = document.createElement("div");
      anchorEl.id = "anchor";
      containerEl.appendChild(anchorEl);

      vi.mocked(getInlineOption).mockImplementation(
        (element, key, fallback) => {
          if (key === "anchor") return "#anchor";
          if (key === "offset") return fallback;
          return null;
        }
      );

      Object.defineProperty(anchorEl, "offsetTop", {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(anchorEl, "offsetParent", {
        value: containerEl,
        configurable: true,
      });
      Object.defineProperty(anchorEl, "offsetHeight", {
        value: 50,
        configurable: true,
      });

      const result = getPositionOut(el, 0, containerEl);

      // anchor top 200. anchor height 50.
      // return 200 + 50 - 0 = 250
      expect(result).toBe(250);
    });
  });
});
