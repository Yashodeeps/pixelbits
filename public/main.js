const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

try {
  const worker = new Worker("worker.js", { type: "module" });
  console.log("Worker started ✅");
} catch (err) {
  console.error("Worker failed ❌", err);
}

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

  img.onerror = (err) => {
    console.error("Error loading image:", err);
  };

  img.src = URL.createObjectURL(file);
});

worker.onmessage = (e) => {
  const processedData = e.data;
  ctx.putImageData(processedData, 0, 0);
};

window.processImage = function (type) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log("Processing image with type:", type);
  worker.postMessage({ imageData, type });
};
