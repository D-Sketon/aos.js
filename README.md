# aos.js

![NPM License](https://img.shields.io/npm/l/%40reimujs%2Faos) ![NPM Version](https://img.shields.io/npm/v/%40reimujs%2Faos) ![npm bundle size](https://img.shields.io/bundlephobia/min/%40reimujs%2Faos) [![Coverage Status](https://coveralls.io/repos/github/D-Sketon/aos.js/badge.svg?branch=main)](https://coveralls.io/github/D-Sketon/aos.js?branch=main)

Animate on scroll library. A modern TypeScript rewrite of [michalsnik/aos](https://github.com/michalsnik/aos).

## Features

- Full TypeScript support with type definitions
- Smaller bundle size: 5.7KB + 23.3KB (vs 14.7KB + 26.1KB)
- Modern browser optimizations
- Custom scrollable container support
- Enhanced API with `destroy()` method
- Compatible with React, Vue, Angular, Astro, and more

## Installation

```bash
npm install @reimujs/aos
```

CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@reimujs/aos/dist/aos.css" />
<script src="https://cdn.jsdelivr.net/npm/@reimujs/aos/dist/aos.umd.js"></script>
```

## Usage

```typescript
import AOS from "@reimujs/aos";
import "@reimujs/aos/dist/aos.css";

AOS.init();
```

```html
<div data-aos="fade-up">Animate on scroll</div>
```

## Configuration

```typescript
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
  initClassName: "aos-init", // class applied after initialization
  animatedClassName: "aos-animate", // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: "ease", // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: "top-bottom", // defines which position of the element regarding to window/container should trigger the animation

  // Additional setting:
  container: window, // AOS Container, accepts CSS Selector (e.g. ".my-awesome-container") or HTMLElement
});
```

## Animations

Available animation types:
- **Fade**: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-up-right`, `fade-up-left`, `fade-down-right`, `fade-down-left`
- **Flip**: `flip-up`, `flip-down`, `flip-left`, `flip-right`
- **Slide**: `slide-up`, `slide-down`, `slide-left`, `slide-right`
- **Zoom**: `zoom-in`, `zoom-in-up`, `zoom-in-down`, `zoom-in-left`, `zoom-in-right`, `zoom-out`, `zoom-out-up`, `zoom-out-down`, `zoom-out-left`, `zoom-out-right`

Available easing functions:
- `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`
- `ease-in-back`, `ease-out-back`, `ease-in-out-back`
- `ease-in-sine`, `ease-out-sine`, `ease-in-out-sine`
- `ease-in-quad`, `ease-out-quad`, `ease-in-out-quad`
- `ease-in-cubic`, `ease-out-cubic`, `ease-in-out-cubic`
- `ease-in-quart`, `ease-out-quart`, `ease-in-out-quart`

## API

### `AOS.init(options?)`
Initialize AOS with optional configuration.

### `AOS.refresh()`
Recalculate element positions after dynamic content changes.

### `AOS.refreshHard()`
Force complete reinitialization.

### `AOS.destroy()`
Remove all event listeners and observers.

## Framework Examples

### Next.js

```typescript
"use client";
import { useEffect } from "react";
import "@reimujs/aos/dist/aos.css";

export default function Page() {
  useEffect(() => {
    import("@reimujs/aos").then(({ default: AOS }) => {
      AOS.init();
    });
  }, []);
}
```

### Vue / Nuxt

```vue
<script lang="ts" setup>
import { onMounted } from "vue";
import "@reimujs/aos/dist/aos.css";

onMounted(() => {
  import("@reimujs/aos").then(({ default: AOS }) => {
    AOS.init();
  });
});
</script>
```

### Angular

```typescript
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import '@reimujs/aos/dist/aos.css';

@Component({})
export class AppComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      import("@reimujs/aos").then(({ default: AOS }) => {
        AOS.init();
      });
    }
  }
}
```

### Astro

```astro
---
import "@reimujs/aos/dist/aos.css";
---

<script>
  import AOS from "@reimujs/aos";
  AOS.init();
</script>
```

## License
 
MIT
