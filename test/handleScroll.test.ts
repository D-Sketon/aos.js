import { describe, it, expect, vi, beforeEach } from "vitest";
import handleScroll from "../src/handleScroll";
import * as containerModule from "../src/container";

vi.mock("../src/container", () => ({
  getElementOffset: vi.fn(),
}));

describe("handleScroll", () => {
  let elements: any[];
  let container: Window;
  let dispatchEventSpy: any;

  beforeEach(() => {
    elements = [
      {
        node: document.createElement("div"),
        position: { in: 100, out: 200 },
        options: {
          mirror: true,
          once: false,
          animatedClassNames: ["aos-animate"],
          id: "test-id",
        },
        animated: false,
      },
    ];
    container = window;
    dispatchEventSpy = vi.spyOn(document, "dispatchEvent");
    vi.resetAllMocks();
  });

  it("should animate in when scrolled past trigger point", () => {
    vi.mocked(containerModule.getElementOffset).mockReturnValue(150);

    handleScroll(elements, container);

    expect(elements[0].node.classList.contains("aos-animate")).toBe(true);
    expect(elements[0].animated).toBe(true);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    // Check event details if possible
    const eventCalls = dispatchEventSpy.mock.calls;
    const aosInEvent = eventCalls.find(
      (call: any) => call[0] instanceof CustomEvent && call[0].type === "aos:in"
    )[0];
    expect(aosInEvent.detail).toBe(elements[0].node);
  });

  it("should animate out when scrolled past out point and mirror is true", () => {
    elements[0].animated = true;
    elements[0].node.classList.add("aos-animate");
    vi.mocked(containerModule.getElementOffset).mockReturnValue(250);

    handleScroll(elements, container);

    expect(elements[0].node.classList.contains("aos-animate")).toBe(false);
    expect(elements[0].animated).toBe(false);
  });

  it("should not animate out if once is true", () => {
    elements[0].options.once = true;
    elements[0].animated = true;
    elements[0].node.classList.add("aos-animate");
    vi.mocked(containerModule.getElementOffset).mockReturnValue(50); // Before in

    handleScroll(elements, container);

    expect(elements[0].node.classList.contains("aos-animate")).toBe(true);
  });

  it("should animate out if scrolled back up and not once", () => {
    elements[0].animated = true;
    elements[0].node.classList.add("aos-animate");
    vi.mocked(containerModule.getElementOffset).mockReturnValue(50);

    handleScroll(elements, container);

    expect(elements[0].node.classList.contains("aos-animate")).toBe(false);
  });

  it("should return early if already in correct state", () => {
    vi.mocked(containerModule.getElementOffset).mockReturnValue(150);
    handleScroll(elements, container);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(2); // aos:in and aos:in:test-id

    dispatchEventSpy.mockClear();
    handleScroll(elements, container);
    expect(dispatchEventSpy).not.toHaveBeenCalled();
  });

  it("should not fire id event if id is missing", () => {
    elements[0].options.id = undefined;
    vi.mocked(containerModule.getElementOffset).mockReturnValue(150);
    handleScroll(elements, container);
    expect(dispatchEventSpy).toHaveBeenCalledTimes(1); // only aos:in
  });
});
