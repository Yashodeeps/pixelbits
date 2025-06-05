// UI Enhancement Script for MangaFy
// This script adds interactive features and works with your existing main.js

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all UI enhancements
  createStars();
  setupDragAndDrop();
  setupUploadHandling();
  setupSocialSharing();
  setupDownloadFunctionality();
});

// Create animated stars background
function createStars() {
  const starsContainer = document.getElementById("stars");
  const numberOfStars = 100;

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 2 + "s";
    starsContainer.appendChild(star);
  }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
  const uploadZone = document.getElementById("uploadZone");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    uploadZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadZone.addEventListener(
      eventName,
      () => {
        uploadZone.classList.add("dragover");
      },
      false
    );
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadZone.addEventListener(
      eventName,
      () => {
        uploadZone.classList.remove("dragover");
      },
      false
    );
  });

  uploadZone.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
      const uploadInput = document.getElementById("upload");
      uploadInput.files = files;
      // Trigger the change event to work with your existing main.js
      uploadInput.dispatchEvent(new Event("change"));
    }
  }
}

// Enhanced upload handling with UI feedback
function setupUploadHandling() {
  const uploadInput = document.getElementById("upload");
  const canvas = document.getElementById("canvas");
  const placeholder = document.getElementById("placeholder");
  const mangafyBtn = document.getElementById("mangafyBtn");

  // Add event listener that works alongside your main.js
  uploadInput.addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      // Show processing state
      placeholder.innerHTML = "Loading image...";

      // Enable mangafy button after a short delay to ensure image is loaded
      setTimeout(() => {
        mangafyBtn.disabled = false;
        placeholder.style.display = "none";
        canvas.classList.add("visible");
      }, 500);
    }
  });
}

// Enhanced processImage function with UI feedback
function enhanceProcessImage() {
  // Store reference to original processImage if it exists
  const originalProcessImage = window.processImage;

  window.processImage = function (type) {
    const processing = document.getElementById("processing");
    const downloadBtn = document.getElementById("downloadBtn");

    // Show processing overlay
    processing.style.display = "flex";

    // Add a small delay to show the processing animation
    setTimeout(() => {
      try {
        // Call your original WASM function if available
        if (
          originalProcessImage &&
          typeof originalProcessImage === "function"
        ) {
          originalProcessImage(type);
        } else {
          // Fallback processing for testing
          console.log("Processing with type:", type);
          fallbackProcessing();
        }

        // Hide processing overlay and show download button
        processing.style.display = "none";
        downloadBtn.style.display = "inline-block";
      } catch (error) {
        console.error("Error processing image:", error);
        processing.style.display = "none";
        alert("Error processing image. Please try again.");
      }
    }, 1000);
  };
}

// Fallback processing function for testing
function fallbackProcessing() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  if (canvas.width && canvas.height) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Simple manga-like effect
    for (let i = 0; i < imageData.data.length; i += 4) {
      const gray =
        (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      const threshold = gray > 128 ? 255 : 0;
      imageData.data[i] = threshold;
      imageData.data[i + 1] = threshold;
      imageData.data[i + 2] = threshold;
    }

    ctx.putImageData(imageData, 0, 0);
  }
}

// Setup download functionality
function setupDownloadFunctionality() {
  window.downloadImage = function () {
    const canvas = document.getElementById("canvas");
    const link = document.createElement("a");
    link.download = "mangafy-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
}

// Setup social sharing functions
function setupSocialSharing() {
  window.shareToTwitter = function () {
    const text = "Check out my manga transformation with MangaFy! 🎨✨";
    const url = encodeURIComponent(window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${url}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  window.shareToFacebook = function () {
    const url = encodeURIComponent(window.location.href);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  window.shareToInstagram = function () {
    // Instagram doesn't have direct sharing API, so we'll prompt user
    downloadImage();
    setTimeout(() => {
      alert("Image downloaded! 📱 Now you can share it on Instagram!");
    }, 500);
  };

  window.shareToTikTok = function () {
    // TikTok doesn't have direct sharing API for images
    downloadImage();
    setTimeout(() => {
      alert(
        "Image downloaded! 🎵 Create an amazing TikTok with your manga art!"
      );
    }, 500);
  };
}

// Initialize enhanced processing when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit for main.js to load, then enhance processImage
  setTimeout(enhanceProcessImage, 1000);
});

// Add some utility functions
function showNotification(message, type = "info") {
  // Simple notification system
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 9999;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
  `;

  if (type === "success") {
    notification.style.background = "linear-gradient(45deg, #4ecdc4, #44a08d)";
  } else if (type === "error") {
    notification.style.background = "linear-gradient(45deg, #ff6b6b, #ee5a52)";
  } else {
    notification.style.background = "linear-gradient(45deg, #667eea, #764ba2)";
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Error handling for WASM loading
window.addEventListener("error", function (e) {
  if (e.message && e.message.includes("wasm")) {
    console.warn("WASM loading issue, falling back to JavaScript processing");
    showNotification("Using fallback processing mode", "info");
  }
});
