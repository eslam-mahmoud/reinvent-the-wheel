// Renders PNG icons from public/favicon.svg (run once after changing the logo).
import sharp from "sharp";
const svg = await (await import("node:fs/promises")).readFile(new URL("../public/favicon.svg", import.meta.url));
for (const [name, size] of [["favicon-32.png", 32], ["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512], ["images/avatar-512.png", 512]]) {
  await sharp(svg, { density: Math.ceil((size / 32) * 72 * 2) }).resize(size, size).png().toFile(new URL(`../public/${name}`, import.meta.url).pathname);
  console.log("wrote", name);
}
