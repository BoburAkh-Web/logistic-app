import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

/** Used by scripts/prerender.mjs to bake the page into dist/index.html. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
