// Tiny entry: styles are linked from index.html (and inlined at build), and the app is
// loaded only after the browser has painted the prerendered page, so first paint never
// waits for JavaScript to download, evaluate or hydrate.
const start = () => import("./boot").then((m) => m.boot());

// rAF fires just before the next paint; the timeout inside it runs right after it.
requestAnimationFrame(() => setTimeout(start, 0));
