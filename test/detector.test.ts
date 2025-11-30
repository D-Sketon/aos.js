import { describe, it, expect, vi, afterEach } from "vitest";
import detector from "../src/detector";

describe("detector", () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
  });

  const mockUserAgent = (userAgent: string) => {
    Object.defineProperty(navigator, "userAgent", {
      value: userAgent,
      configurable: true,
    });
  };

  it("should detect phone", () => {
    mockUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)");
    expect(detector.phone()).toBe(true);
    expect(detector.mobile()).toBe(true);
    expect(detector.tablet()).toBe(false);
  });

  it("should detect tablet", () => {
    mockUserAgent("Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)");
    expect(detector.phone()).toBe(false);
    expect(detector.mobile()).toBe(true);
    expect(detector.tablet()).toBe(true);
  });

  it("should detect desktop", () => {
    mockUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(detector.phone()).toBe(false);
    expect(detector.mobile()).toBe(false);
    expect(detector.tablet()).toBe(false);
  });
});
