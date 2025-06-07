console.log("Worker initialized");

let wasmInit;

try {
  wasmInit = import("/pkg/pixelbits.js");
  console.log("WASM import started");
} catch (err) {
  console.error("WASM import failed:", err);
}

onmessage = async (e) => {
  const { imageData, type } = e.data;

  try {
    const wasm = await wasmInit;
    await wasm.default();
    console.log("WASM module initialized");

    if (type === "mangafy") {
      const pixels = new Uint8Array(imageData.data.buffer);
      wasm.mangafy(imageData.width, imageData.height, pixels);
      imageData.data.set(pixels);
    }

    postMessage(imageData, [imageData.data.buffer]);
    console.log("Image processed and sent back to main thread");
  } catch (err) {
    console.error("Error processing image:", err);
    postMessage({ error: err.message });
  }
};
