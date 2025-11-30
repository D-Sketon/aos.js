import { describe, it, expect, vi } from "vitest";
import observe from "../src/observer";

describe("observer", () => {
  it("should call callback when AOS node is added", async () => {
    const fn = vi.fn();
    const observer = observe(fn);

    const el = document.createElement("div");
    el.setAttribute("data-aos", "fade-up");
    document.body.appendChild(el);

    // MutationObserver is async
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fn).toHaveBeenCalled();
    observer.disconnect();
    document.body.removeChild(el);
  });

  it("should call callback when AOS node is removed", async () => {
    const el = document.createElement("div");
    el.setAttribute("data-aos", "fade-up");
    document.body.appendChild(el);

    const fn = vi.fn();
    const observer = observe(fn);

    document.body.removeChild(el);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fn).toHaveBeenCalled();
    observer.disconnect();
  });

  it("should not call callback when non-AOS node is added", async () => {
    const fn = vi.fn();
    const observer = observe(fn);

    const el = document.createElement("div");
    document.body.appendChild(el);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fn).not.toHaveBeenCalled();
    observer.disconnect();
    document.body.removeChild(el);
  });

  it("should detect nested AOS node", async () => {
    const fn = vi.fn();
    const observer = observe(fn);

    const parent = document.createElement("div");
    const child = document.createElement("div");
    child.setAttribute("data-aos", "fade-up");
    parent.appendChild(child);
    document.body.appendChild(parent);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fn).toHaveBeenCalled();
    observer.disconnect();
    document.body.removeChild(parent);
  });
});
