# aos.js

![NPM License](https://img.shields.io/npm/l/%40reimujs%2Faos) ![NPM Version](https://img.shields.io/npm/v/%40reimujs%2Faos) ![npm bundle size](https://img.shields.io/bundlephobia/min/%40reimujs%2Faos)

Animate on scroll library.

Rewrite [aos](https://github.com/michalsnik/aos) using typescript.

## Installation

```bash
npm install @reimujs/aos --save
```

or

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@reimujs/aos/dist/aos.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@reimujs/aos/dist/aos.umd.js"></script>
```

## Usage

Just same as aos@next. For more information, please visit [aos-how-to-use-it](https://github.com/michalsnik/aos?tab=readme-ov-file#-how-to-use-it).

```typescript
import AOS from "@reimujs/aos";
import "@reimujs/aos/dist/aos.css";

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

### Nuxt

```html
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

### Augular

```typescript
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import '@reimujs/aos/dist/aos.css';

@Component({})
export class AppComponent {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      import("@reimujs/aos").then(({ default: AOS }) => {
        AOS.init();
      });
    }
  }
}
```

### Astro

```html
---
import "@reimujs/aos/dist/aos.css";
---
<script>
  import AOS from "@reimujs/aos";
  AOS.init();
</script>
```

## Difference

So what's the difference between aos and @reimujs/aos?

- Typescript friendly
- Smaller package size (from 14.7KB + 26.1KB to 6.9KB + 25.2KB)
- Only support modern browsers
- Support additional settings
- Support additional API

### Additional settings

#### container

merge from [aos#223](https://github.com/michalsnik/aos/issues/223), you can set the container of AOS, accepts CSS Selector (e.g. ".my-awesome-container") or HTMLElement.

```typescript
container: window, // AOS Container, accepts CSS Selector (e.g. ".my-awesome-container") or HTMLElement
```

### Additional API

#### AOS.destroy()

```typescript
function destroy(): void;
```

Remove all event listeners and disconnect MutationObserver.

## License

MIT
