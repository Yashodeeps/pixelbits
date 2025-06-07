import init, { mangafy } from "/pkg/pixelbits.js";

console.log("Worker initialized");

onmessage = async (e) => {
  const { imageData, type } = e.data;

  await init();

  console.log("WASM module initialized");

  if (type === "mangafy") {
    const pixels = new Uint8Array(imageData.data.buffer);
    mangafy(imageData.width, imageData.height, pixels);
    imageData.data.set(pixels);
  }

  postMessage(imageData, [imageData.data.buffer]);
  console.log("Image processed and sent back to main thread");
};
