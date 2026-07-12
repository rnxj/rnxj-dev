import { renderToString } from "react-dom/server";
import { App } from "../src/App";

const outputPath = new URL("../dist/index.html", import.meta.url);
const template = await Bun.file(outputPath).text();
const marker = '<div id="root"></div>';

if (!template.includes(marker)) {
  throw new Error("Could not find the Vite root marker in dist/index.html");
}

const rendered = renderToString(<App />);
await Bun.write(outputPath, template.replace(marker, `<div id="root">${rendered}</div>`));
