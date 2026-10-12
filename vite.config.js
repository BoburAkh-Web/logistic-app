import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Inline the (single, ~14 KB gzip) stylesheet into index.html. A separate CSS file is
 * render-blocking: on slow mobile networks it costs an extra round trip before first paint.
 */
function inlineCss() {
  let inlined = false;
  return {
    name: "inline-css",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      const html = bundle["index.html"];
      if (!html || typeof html.source !== "string") return;
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (!fileName.endsWith(".css") || chunk.type !== "asset") continue;
        const link = new RegExp(`<link rel="stylesheet"[^>]*href="/${fileName.replace(/[.]/g, "\\.")}"[^>]*>`);
        if (!link.test(html.source)) continue;
        html.source = html.source.replace(link, () => `<style>${chunk.source}</style>`);
        delete bundle[fileName];
        inlined = true;
      }
    },
    // Lazy chunks list the entry's stylesheet as a dependency, and Vite's preloader would
    // request it as a file — which no longer exists (404 → the import rejects and the app
    // never hydrates). Vite writes that dependency map after generateBundle, so patch the
    // emitted files: drop .css entries from each chunk's map.
    writeBundle(options, bundle) {
      if (!inlined) return;
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk") continue;
        const file = path.join(options.dir, chunk.fileName);
        const code = fs.readFileSync(file, "utf8");
        if (!code.includes("__vite__mapDeps")) continue;
        const patched = code.replace(
          "=>i.map(i=>d[i])",
          '=>i.map(i=>d[i]).filter(f=>!f.endsWith(".css"))'
        );
        if (patched === code) this.error(`inline-css: could not patch dependency map in ${chunk.fileName}`);
        fs.writeFileSync(file, patched);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCss()],
  build: {
    chunkSizeWarningLimit: 1200,
    // boot.jsx fetches its chunks in parallel itself; no preload polyfill/links needed.
    modulePreload: false,
  },
});
