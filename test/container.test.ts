import { describe, it, expect } from "vitest";
import {
  resolveContainer,
  getElementHeight,
  getElementOffset,
} from "../src/container";

describe("container", () => {
  describe("resolveContainer", () => {
    it("should return the element if passed an element", () => {
      const el = document.createElement("div");
      expect(resolveContainer(el)).toBe(el);
    });

    it("should return window if passed window", () => {
      expect(resolveContainer(window)).toBe(window);
    });

    it("should query selector if passed a string", () => {
      const el = document.createElement("div");
      el.id = "test";
      document.body.appendChild(el);
      expect(resolveContainer("#test")).toBe(el);
      document.body.removeChild(el);
    });

    it("should return null if selector not found", () => {
      expect(resolveContainer("#not-found")).toBeNull();
    });

    it("should return null if invalid input", () => {
      expect(resolveContainer(null as any)).toBeNull();
    });
  });

  describe("getElementHeight", () => {
    it("should return innerHeight for window", () => {
      window.innerHeight = 1000;
      expect(getElementHeight(window)).toBe(1000);
    });

    it("should return clientHeight for element", () => {
      const el = document.createElement("div");
      Object.defineProperty(el, "clientHeight", { value: 500 });
      expect(getElementHeight(el)).toBe(500);
    });
  });

  describe("getElementOffset", () => {
    it("should return pageYOffset for window", () => {
      window.pageYOffset = 200;
      expect(getElementOffset(window)).toBe(200);
    });

    it("should return scrollTop for element", () => {
      const el = document.createElement("div");
      el.scrollTop = 100;
      expect(getElementOffset(el)).toBe(100);
    });
  });
});
