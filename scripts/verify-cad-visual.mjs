import { chromium } from "@playwright/test";
import { inflateSync } from "node:zlib";

const baseUrl = process.env.CAD_VISUAL_BASE_URL ?? "http://127.0.0.1:3000";

function parsePng(buffer) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    offset += 4;
    const type = buffer.toString("ascii", offset, offset + 4);
    offset += 4;
    const data = buffer.subarray(offset, offset + length);
    offset += length + 4;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    }
    if (type === "IDAT") idat.push(data);
    if (type === "IEND") break;
  }

  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG format: bitDepth=${bitDepth}, colorType=${colorType}`);
  }

  const raw = inflateSync(Buffer.concat(idat));
  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const stride = width * bytesPerPixel;
  const pixels = Buffer.alloc(height * stride);
  let src = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[src++];
    const rowStart = y * stride;
    const previousRowStart = (y - 1) * stride;
    for (let x = 0; x < stride; x += 1) {
      const left = x >= bytesPerPixel ? pixels[rowStart + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[previousRowStart + x] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel ? pixels[previousRowStart + x - bytesPerPixel] : 0;
      let value = raw[src++];
      if (filter === 1) value = (value + left) & 255;
      if (filter === 2) value = (value + up) & 255;
      if (filter === 3) value = (value + Math.floor((left + up) / 2)) & 255;
      if (filter === 4) {
        const predictorBase = left + up - upLeft;
        const leftDistance = Math.abs(predictorBase - left);
        const upDistance = Math.abs(predictorBase - up);
        const upLeftDistance = Math.abs(predictorBase - upLeft);
        const predictor =
          leftDistance <= upDistance && leftDistance <= upLeftDistance
            ? left
            : upDistance <= upLeftDistance
              ? up
              : upLeft;
        value = (value + predictor) & 255;
      }
      pixels[rowStart + x] = value;
    }
  }

  const samples = new Set();
  let nonBackgroundSamples = 0;
  const stepBase = Math.max(bytesPerPixel, Math.floor(pixels.length / 700));
  const step = stepBase - (stepBase % bytesPerPixel) || bytesPerPixel;
  for (let i = 0; i < pixels.length; i += step) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    samples.add(`${r},${g},${b}`);
    if (!(r > 210 && g > 218 && b > 214)) nonBackgroundSamples += 1;
  }

  return { width, height, sampleColors: samples.size, nonBackgroundSamples };
}

async function checkViewport(browser, viewport) {
  console.log(`Checking /cad/editor at ${viewport.width}x${viewport.height}`);
  const page = await browser.newPage({ viewport });
  await page.goto(`${baseUrl}/cad/editor`, { waitUntil: "load" });
  const canvas = page.locator("canvas").first();
  await canvas.waitFor({ state: "attached", timeout: 20_000 });
  await canvas.scrollIntoViewIfNeeded();
  await canvas.waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(750);
  const box = await canvas.boundingBox();
  if (!box || box.width < 240 || box.height < 140) {
    throw new Error(`Canvas too small at ${viewport.width}x${viewport.height}: ${JSON.stringify(box)}`);
  }
  const pixels = parsePng(await canvas.screenshot());
  if (pixels.sampleColors < 8 || pixels.nonBackgroundSamples < 20) {
    throw new Error(`Canvas appears blank at ${viewport.width}x${viewport.height}: ${JSON.stringify(pixels)}`);
  }
  await page.close();
  return { viewport, box, pixels };
}

const browser = await chromium.launch({ headless: true });
try {
  const results = [
    await checkViewport(browser, { width: 1280, height: 720 }),
    await checkViewport(browser, { width: 390, height: 844 })
  ];
  console.log(JSON.stringify({ status: "READY", route: "/cad/editor", results }, null, 2));
} finally {
  await browser.close();
}
