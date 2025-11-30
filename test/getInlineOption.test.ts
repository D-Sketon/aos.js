import { describe, it, expect } from "vitest";
import getInlineOption from "../src/getInlineOption";

describe("getInlineOption", () => {
  it('should return true if attribute is "true"', () => {
    const el = document.createElement("div");
    el.setAttribute("data-aos-test", "true");
    expect(getInlineOption(el, "test")).toBe(true);
  });

  it('should return false if attribute is "false"', () => {
    const el = document.createElement("div");
    el.setAttribute("data-aos-test", "false");
    expect(getInlineOption(el, "test")).toBe(false);
  });

  it("should return attribute value if present", () => {
    const el = document.createElement("div");
    el.setAttribute("data-aos-test", "some-value");
    expect(getInlineOption(el, "test")).toBe("some-value");
  });

  it("should return fallback if attribute is missing", () => {
    const el = document.createElement("div");
    expect(getInlineOption(el, "test", "fallback")).toBe("fallback");
  });

  it("should return undefined if attribute is missing and no fallback", () => {
    const el = document.createElement("div");
    expect(getInlineOption(el, "test")).toBeUndefined();
  });
});
