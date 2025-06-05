import init, { mangafy } from "./pkg/pixelbits.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

await init();

upload.addEventListener("change", (e) => {
  console.log("File selected:", e.target.files[0]);
  const file = e.target.files[0];
  const img = new Image();

  img.onload = () => {
    console.log("Image loaded, dimensions:", img.width, "x", img.height);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };

  console.log(img);

  img.onerror = (err) => {
    console.error("Error loading image:", err);
  };

  img.src = URL.createObjectURL(file);
});

function processWithWASM(imageData, type) {
  if (type === "mangafy") {
    const pixels = new Uint8Array(imageData.data.buffer);
    mangafy(imageData.width, imageData.height, pixels);
    imageData.data.set(pixels);
  }
  return imageData;
}

window.processImage = function (type) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const processedData = processWithWASM(imageData, type);
  ctx.putImageData(processedData, 0, 0);
};
