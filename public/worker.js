// import init, { mangafy } from "./pkg/pixelbits.js";

console.log("Worker initialized");

onmessage = (e) => {
  //test worker
  console.log("Worker received message:", e.data);
  postMessage({ status: "Worker received message" });
};

// init().then(() => {
//   console.log("WASM module initialized");

//   self.onmessage = (e) => {
//     const { imageData, type } = e.data;

//     if (type === "mangafy") {
//       const pixels = new Uint8Array(imageData.data.buffer);
//       mangafy(imageData.width, imageData.height, pixels);
//       imageData.data.set(pixels);
//     }

//     self.postMessage(imageData);
//   };
// });
