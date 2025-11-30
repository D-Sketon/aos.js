import { describe, it, expect, vi, beforeEach } from "vitest";
import prepare from "../src/prepare";
import * as offsetCalculator from "../src/offsetCalculator";
import getInlineOption from "../src/getInlineOption";

vi.mock("../src/offsetCalculator", () => ({
  getPositionIn: vi.fn(),
  getPositionOut: vi.fn(),
}));

vi.mock("../src/getInlineOption", () => ({
  default: vi.fn(),
}));

describe("prepare", () => {
  let elements: any[];
  let options: any;
  let container: Window;

  beforeEach(() => {
    elements = [{ node: document.createElement("div") }];
    options = {
      mirror: false,
      once: false,
      offset: 120,
      anchorPlacement: "top-bottom",
      animatedClassName: "aos-animate",
      initClassName: "aos-init",
      useClassNames: false,
    };
    container = window;
    vi.resetAllMocks();
  });

  it("should calculate positions and options for elements", () => {
    vi.mocked(getInlineOption).mockImplementation(
      (node, key, fallback) => fallback
    );
    vi.mocked(offsetCalculator.getPositionIn).mockReturnValue(100);
    vi.mocked(offsetCalculator.getPositionOut).mockReturnValue(200);

    const result = prepare(elements, options, container);

    expect(result[0].position!.in).toBe(100);
    expect(result[0].position!.out).toBe(false); // mirror is false
    expect(result[0].options!.once).toBe(false);
    expect(result[0].options!.mirror).toBe(false);
    expect(result[0].node.classList.contains("aos-init")).toBe(true);
  });

  it("should handle mirror option", () => {
    options.mirror = true;
    vi.mocked(getInlineOption).mockImplementation((node, key, fallback) => {
      if (key === "mirror") return true;
      return fallback;
    });
    vi.mocked(offsetCalculator.getPositionIn).mockReturnValue(100);
    vi.mocked(offsetCalculator.getPositionOut).mockReturnValue(200);

    const result = prepare(elements, options, container);

    expect(result[0].position!.out).toBe(200);
  });

  it("should handle custom class names", () => {
    options.useClassNames = true;
    elements[0].node.setAttribute("data-aos", "fade-up custom-class");

    vi.mocked(getInlineOption).mockImplementation(
      (node, key, fallback) => fallback
    );

    const result = prepare(elements, options, container);

    expect(result[0].options!.animatedClassNames).toContain("aos-animate");
    expect(result[0].options!.animatedClassNames).toContain("fade-up");
    expect(result[0].options!.animatedClassNames).toContain("custom-class");
  });

  it("should handle useClassNames with missing data-aos attribute", () => {
    options.useClassNames = true;
    vi.mocked(getInlineOption).mockImplementation(
      (node, key, fallback) => fallback
    );

    const result = prepare(elements, options, container);

    expect(result[0].options!.animatedClassNames).toEqual(["aos-animate"]);
  });

  it("should not add initClassName if option is null", () => {
    options.initClassName = null;
    const result = prepare(elements, options, container);
    expect(result[0].node.classList.contains("aos-init")).toBe(false);
  });
});
