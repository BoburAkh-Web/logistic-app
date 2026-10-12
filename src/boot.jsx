// Loaded by main.jsx after the first paint. Imports are staged so evaluating React and
// the app happen in separate main-thread tasks rather than one long block.
const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));

export async function boot() {
  const [{ StrictMode, createElement }, client] = await Promise.all([
    import("react"),
    import("react-dom/client"),
  ]);
  await yieldToMain();
  const { default: App } = await import("./App");
  await yieldToMain();

  const container = document.getElementById("root");
  const app = createElement(StrictMode, null, createElement(App));

  // Production HTML is prerendered at build time (scripts/prerender.mjs) — hydrate it.
  // In dev the root is empty, so render from scratch.
  if (container.hasChildNodes()) client.hydrateRoot(container, app);
  else client.createRoot(container).render(app);
}
