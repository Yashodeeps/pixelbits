const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

let worker;
try {
  worker = new Worker("worker.js", { type: "module" });
  console.log("Worker started ✅");
} catch (err) {
  console.error("Worker failed ❌", err);
}

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const img = new Image();

  img.onload = () => {
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
  console.log("Worker message received:", e.data);
  const processedData = e.data;
  ctx.putImageData(processedData, 0, 0);
};

window.processImage = function (type) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  worker.postMessage({ imageData, type }, [imageData.data.buffer]);
};
