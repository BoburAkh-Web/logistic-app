// Bakes the rendered page into dist/index.html so the first paint doesn't wait for
// JavaScript, and preloads the fonts the hero needs. Runs after both Vite builds.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const htmlPath = path.join(dist, "index.html");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

let html = fs.readFileSync(htmlPath, "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error("prerender: #root placeholder not found in dist/index.html");
html = html.replace(marker, `<div id="root">${await render()}</div>`);

// Latin subsets of the display + body fonts are on the critical path for the hero.
const fonts = fs
  .readdirSync(path.join(dist, "assets"))
  .filter((f) => /^(bricolage-grotesque|inter)-latin-wght-normal-.+\.woff2$/.test(f));
const preloads = fonts
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join("\n    ");
html = html.replace("</head>", `    ${preloads}\n  </head>`);

fs.writeFileSync(htmlPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: wrote ${path.relative(root, htmlPath)} (${(html.length / 1024).toFixed(1)} KB), preloaded ${fonts.length} fonts`);
