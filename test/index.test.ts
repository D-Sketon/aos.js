import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import aos from "../src/index";
import detect from "../src/detector";
import handleScroll from "../src/handleScroll";
import prepare from "../src/prepare";
import observe from "../src/observer";
import { resolveContainer } from "../src/container";
import { throttle, debounce } from "../src/utils";

vi.mock("../src/detector", () => ({
  default: {
    mobile: vi.fn(),
    phone: vi.fn(),
    tablet: vi.fn(),
  },
}));

vi.mock("../src/handleScroll", () => ({
  default: vi.fn(),
}));

vi.mock("../src/prepare", () => ({
  default: vi.fn(),
}));

vi.mock("../src/observer", () => ({
  default: vi.fn(),
}));

vi.mock("../src/container", () => ({
  resolveContainer: vi.fn(),
}));

vi.mock("../src/utils", () => ({
  throttle: vi.fn((fn) => fn),
  debounce: vi.fn((fn) => fn),
}));

describe("Aos", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    document.body.innerHTML = "";
    vi.mocked(resolveContainer).mockReturnValue(window);
    vi.mocked(prepare).mockImplementation((elements) => elements);
  });

  afterEach(() => {
    aos.destroy();
  });

  it("should initialize correctly", () => {
    const el = document.createElement("div");
    el.setAttribute("data-aos", "fade-up");
    document.body.appendChild(el);

    aos.init();

    expect(resolveContainer).toHaveBeenCalled();
    expect(prepare).toHaveBeenCalled();
    expect(handleScroll).toHaveBeenCalled();
    expect(document.body.getAttribute("data-aos-easing")).toBe("ease");
  });

  it("should handle disable option", () => {
    vi.mocked(detect.mobile).mockReturnValue(true);
    aos.init({ disable: "mobile" });
    // Should be disabled
    // When disabled, it calls disable() which removes attributes
    const el = document.createElement("div");
    el.setAttribute("data-aos", "fade-up");
    document.body.appendChild(el);

    // Wait, init calls getElements before checking disabled.
    // But disable() iterates elements.

    // Let's verify disable logic
    // If disabled, it returns early from init after calling disable()

    expect(handleScroll).not.toHaveBeenCalled();
  });

  it("should remove attributes when disabled", () => {
    const el = document.createElement("div");
    el.setAttribute("data-aos", "fade-up");
    el.setAttribute("data-aos-easing", "ease");
    el.setAttribute("data-aos-duration", "400");
    el.setAttribute("data-aos-delay", "0");
    el.classList.add("aos-init");
    el.classList.add("aos-animate");
    document.body.appendChild(el);

    vi.mocked(detect.mobile).mockReturnValue(true);
    aos.init({ disable: "mobile" });

    expect(el.hasAttribute("data-aos")).toBe(false);
    expect(el.hasAttribute("data-aos-easing")).toBe(false);
    expect(el.hasAttribute("data-aos-duration")).toBe(false);
    expect(el.hasAttribute("data-aos-delay")).toBe(false);
    expect(el.classList.contains("aos-init")).toBe(false);
    expect(el.classList.contains("aos-animate")).toBe(false);
  });

  it("should handle disable function", () => {
    aos.init({ disable: () => true });
    expect(handleScroll).not.toHaveBeenCalled();
  });

  it("should handle disable: true", () => {
    aos.init({ disable: true });
    expect(handleScroll).not.toHaveBeenCalled();
  });

  it("should handle disable: phone", () => {
    vi.mocked(detect.phone).mockReturnValue(true);
    aos.init({ disable: "phone" });
    expect(handleScroll).not.toHaveBeenCalled();
  });

  it("should handle custom container", () => {
    const container = document.createElement("div");
    vi.mocked(resolveContainer).mockReturnValue(container);

    aos.init({ container: container });

    expect(resolveContainer).toHaveBeenCalledWith(container);
  });

  it("should throw if container not found", () => {
    vi.mocked(resolveContainer).mockReturnValue(null);
    expect(() => aos.init({ container: "invalid" })).toThrow();
  });

  it("should refresh", () => {
    aos.init();
    vi.clearAllMocks();

    aos.refresh();

    expect(prepare).toHaveBeenCalled();
    expect(handleScroll).toHaveBeenCalled();
  });

  it("should refreshHard", () => {
    aos.init();
    vi.clearAllMocks();

    aos.refreshHard();

    expect(prepare).toHaveBeenCalled();
    expect(handleScroll).toHaveBeenCalled();
  });

  it("should refreshHard and disable if condition met", () => {
    aos.init();
    vi.clearAllMocks();

    vi.mocked(detect.mobile).mockReturnValue(true);
    aos.options.disable = "mobile";

    const el = document.createElement("div");
    el.setAttribute("data-aos", "fade-up");
    document.body.appendChild(el);

    aos.refreshHard();

    expect(el.hasAttribute("data-aos")).toBe(false);
  });

  it("should observe mutations", () => {
    const observeMock = vi.mocked(observe);
    observeMock.mockReturnValue({ disconnect: vi.fn() } as any);

    aos.init({ disableMutationObserver: false });

    expect(observe).toHaveBeenCalled();
  });

  it("should not observe mutations if disabled", () => {
    aos.init({ disableMutationObserver: true });
    expect(observe).not.toHaveBeenCalled();
  });

  it("should handle startEvent", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");
    aos.init({ startEvent: "customEvent" });
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "customEvent",
      expect.any(Function)
    );
  });

  it("should handle window load event", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    aos.init({ startEvent: "load" });
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "load",
      expect.any(Function)
    );
  });

  it("should initialize immediately if readyState is complete", () => {
    Object.defineProperty(document, "readyState", {
      value: "complete",
      configurable: true,
    });
    const refreshSpy = vi.spyOn(aos, "refresh");
    aos.init();
    expect(refreshSpy).toHaveBeenCalledWith(true);
  });

  it("should initialize immediately if readyState is interactive", () => {
    Object.defineProperty(document, "readyState", {
      value: "interactive",
      configurable: true,
    });
    const refreshSpy = vi.spyOn(aos, "refresh");
    aos.init();
    expect(refreshSpy).toHaveBeenCalledWith(true);
  });

  it("should not initialize immediately if startEvent is not DOMContentLoaded", () => {
    Object.defineProperty(document, "readyState", {
      value: "complete",
      configurable: true,
    });
    const refreshSpy = vi.spyOn(aos, "refresh");
    aos.init({ startEvent: "load" });
    expect(refreshSpy).not.toHaveBeenCalledWith(true);
  });
});
