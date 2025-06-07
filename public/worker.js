console.log("High-performance worker initialized");

let wasmModule = null;
let isInitialized = false;

async function initWasm() {
  try {
    console.log("📦 Loading WASM module...");

    const wasm = await import("./pkg/pixelbits.js");

    await wasm.default();

    wasmModule = wasm;
    isInitialized = true;

    console.log("WASM module loaded and initialized");

    postMessage({ type: "WORKER_READY" });
  } catch (err) {
    console.error("WASM initialization failed:", err);
    postMessage({
      type: "WORKER_ERROR",
      error: `Failed to initialize WASM: ${err.message}`,
    });
  }
}

initWasm();

onmessage = async (e) => {
  const { type, imageData, processingType, transferId } = e.data;

  try {
    if (type === "PROCESS_IMAGE") {
      if (!isInitialized) {
        postMessage({
          type: "ERROR",
          error: "Worker not ready yet",
          transferId,
        });
        return;
      }

      console.log(
        `🎨 Processing image: ${processingType}, Size: ${imageData.width}x${imageData.height}`
      );

      const startTime = performance.now();

      const pixels = new Uint8Array(imageData.data);

      switch (processingType) {
        case "mangafy":
          wasmModule.mangafy(imageData.width, imageData.height, pixels);
          break;
        default:
          throw new Error(`Unknown processing type: ${processingType}`);
      }

      const processedImageData = new ImageData(
        new Uint8ClampedArray(pixels),
        imageData.width,
        imageData.height
      );

      const processingTime = performance.now() - startTime;
      console.log(`⚡ Image processed in ${processingTime.toFixed(2)}ms`);

      postMessage(
        {
          type: "IMAGE_PROCESSED",
          imageData: processedImageData,
          processingTime,
          transferId,
        },
        [processedImageData.data.buffer]
      );
    } else if (type === "PING") {
      postMessage({ type: "PONG", ready: isInitialized });
    }
  } catch (err) {
    console.error(" Error in worker:", err);
    postMessage({
      type: "ERROR",
      error: err.message,
      transferId,
    });
  }
};
