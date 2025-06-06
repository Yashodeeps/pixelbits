document.addEventListener("DOMContentLoaded", function () {
  createStars();
  setupDragAndDrop();
  setupUploadHandling();
  setupSocialSharing();
  setupDownloadFunctionality();
});

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
      uploadInput.dispatchEvent(new Event("change"));
    }
  }
}

function setupUploadHandling() {
  const uploadInput = document.getElementById("upload");
  const canvas = document.getElementById("canvas");
  const placeholder = document.getElementById("placeholder");
  const mangafyBtn = document.getElementById("mangafyBtn");

  uploadInput.addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) {
      placeholder.innerHTML = "Loading image...";

      setTimeout(() => {
        mangafyBtn.disabled = false;
        placeholder.style.display = "none";
        canvas.classList.add("visible");
      }, 100);
    }
  });
}

function setupDownloadFunctionality() {
  window.downloadImage = function () {
    const canvas = document.getElementById("canvas");
    const link = document.createElement("a");
    link.download = "mangafy-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
}

function setupSocialSharing() {
  window.shareToTwitter = function () {
    const text = "Check out my manga transformation with MangaFy! 🎨✨";
    const url = encodeURIComponent(window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${url}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };
}

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

  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  }, 100);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

window.addEventListener("error", function (e) {
  if (e.message && e.message.includes("wasm")) {
    console.warn("WASM loading issue, falling back to JavaScript processing");
    showNotification("Using fallback processing mode", "info");
  }
});
