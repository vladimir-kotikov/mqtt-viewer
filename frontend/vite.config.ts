import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, type Plugin } from "vite";

// Patch @wailsio/runtime hardcoded absolute /wails/* paths so they respect
// the configured base URL. This makes the app work when served under a sub-path
// (e.g. https://example.com/mqtt-viewer/).
const wailsBasePathPlugin = (): Plugin => ({
  name: "wails-base-path",
  transform(code, id) {
    if (!id.includes("@wailsio/runtime")) return;
    const base = (process.env.VITE_BASE ?? "/").replace(/\/?$/, "/");
    return code
      .replace(
        'window.location.origin + "/wails/runtime"',
        `window.location.origin + ${JSON.stringify(base + "wails/runtime")}`
      )
      .replace(
        "loadOptionalScript('/wails/custom.js')",
        `loadOptionalScript(${JSON.stringify(base + "wails/custom.js")})`
      );
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [svelte(), wailsBasePathPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      wailsjs: fileURLToPath(new URL("./wailsjs", import.meta.url)),
      bindings: fileURLToPath(
        new URL("./bindings/mqtt-viewer", import.meta.url)
      ),
    },
  },
  optimizeDeps: {
    exclude: [
      "codemirror",
      "@codemirror",
      "@codemirror/commands",
      "@codemirror/lang-json",
      "@codemirror/lang-xml",
      "@codemirror/language",
      "@codemirror/lint",
      "@codemirror/merge",
      "@codemirror/state",
      "@codemirror/view",
      "@lezer/highlight",
      "@lezer/json",
      "vis-timeline",
      "vis-data",
    ],
  },
});
