import { describe, it, expect, vi } from "vitest";
import { debounce, throttle } from "../src/utils";

describe("utils", () => {
  describe("debounce", () => {
    it("should debounce function calls", () => {
      vi.useFakeTimers();
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it("should pass arguments to the debounced function", () => {
      vi.useFakeTimers();
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc("arg1", "arg2");

      vi.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith("arg1", "arg2");
      vi.useRealTimers();
    });
  });

  describe("throttle", () => {
    it("should throttle function calls", () => {
      vi.useFakeTimers();
      const func = vi.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc();
      expect(func).toHaveBeenCalledTimes(1);

      throttledFunc();
      throttledFunc();
      expect(func).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });

    it("should pass arguments to the throttled function", () => {
      vi.useFakeTimers();
      const func = vi.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc("arg1");
      expect(func).toHaveBeenCalledWith("arg1");

      throttledFunc("arg2");
      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledWith("arg2");
      vi.useRealTimers();
    });
  });
});
