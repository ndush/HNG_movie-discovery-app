import { useSyncExternalStore } from "react";

const root = document.documentElement;

// Current "light" | "dark" theme, updating when the header toggle flips <html data-theme>.
export function useTheme() {
  return useSyncExternalStore((cb) => {
    const o = new MutationObserver(cb);
    o.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => o.disconnect();
  }, () => root.dataset.theme);
}

// JS-driven animations (WebGL rays, marquee, spinning text) don't see the CSS media query, so check it here.
export const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
