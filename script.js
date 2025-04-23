document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scratchContainer");
  const backgroundCanvas = document.getElementById("backgroundCanvas");
  const scratchCanvas = document.getElementById("scratchCanvas");
  const resultImage = document.getElementById("resultImage");
  const panpanImage = document.getElementById("panpanImage");
  const celeImage = document.getElementById("celeImage");
  const coinImage = document.getElementById("coinImage");

  if (!container || !backgroundCanvas || !scratchCanvas 
      || !resultImage || !panpanImage || !celeImage || !coinImage) {
    console.error("Error: Required elements not found!");
    return;
  }

  // coin 슬라이드인
  setTimeout(() => coinImage.classList.add("visible"), 100);

  const bgCtx = backgroundCanvas.getContext("2d");
  const scratchCtx = scratchCanvas.getContext("2d");
  let isDrawing = false;
  let currentWidth, currentHeight;
  const ERASE_RADIUS = 20;
  let resultShown = false;

  // 랜덤 결과 이미지 선택 (r1:40%, r2:40%, r3:20%)
  const resultSources = [
    { src: "r1.png", weight: 0.4 },
    { src: "r2.png", weight: 0.4 },
    { src: "r3.png", weight: 0.2 }
  ];
  const rand = Math.random();
  let cumulative = 0;
  let selectedSrc = resultSources[0].src;
  for (const img of resultSources) {
    cumulative += img.weight;
    if (rand < cumulative) {
      selectedSrc = img.src;
      break;
    }
  }
  const bgImage = new Image();
  bgImage.src = selectedSrc;

  const overlayImage = new Image();
  overlayImage.src = "overlay.png";

  function setCanvasSize() {
    const rect = container.getBoundingClientRect();
    currentWidth = rect.width;
    currentHeight = rect.height;

    backgroundCanvas.width = scratchCanvas.width = currentWidth;
    backgroundCanvas.height = scratchCanvas.height = currentHeight;

    if (bgImage.complete) {
      bgCtx.clearRect(0, 0, currentWidth, currentHeight);
      bgCtx.drawImage(bgImage, 0, 0, currentWidth, currentHeight);
    }
    if (overlayImage.complete) {
      scratchCtx.clearRect(0, 0, currentWidth, currentHeight);
      scratchCtx.drawImage(overlayImage, 0, 0, currentWidth, currentHeight);
    }
  }

  window.addEventListener("resize", setCanvasSize);
  bgImage.onload = setCanvasSize;
  overlayImage.onload = () => {
    scratchCtx.drawImage(overlayImage, 0, 0, currentWidth, currentHeight);
  };

  function getEventPosition(event) {
    const rect = scratchCanvas.getBoundingClientRect();
    if (event.touches) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  }

  function checkScratchCompletion() {
    const imageData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    let totalPixels = imageData.data.length / 4;
    let transparentPixels = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] < 128) {
        transparentPixels++;
      }
    }

    if (transparentPixels / totalPixels > 0.5 && !resultShown) {
      scratchCanvas.classList.add("fade-out");
      resultImage.classList.add("visible");
      panpanImage.classList.add("visible");
      celeImage.classList.add("visible");
      resultShown = true;
    }
  }

  function startDrawing(event) {
    event.preventDefault();
    isDrawing = true;
    draw(event);
  }

  function draw(event) {
    if (!isDrawing) return;
    event.preventDefault();

    const { x, y } = getEventPosition(event);
    scratchCtx.globalCompositeOperation = "destination-out";
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, ERASE_RADIUS, 0, Math.PI * 2);
    scratchCtx.fill();

    checkScratchCompletion();
  }

  function stopDrawing(event) {
    event.preventDefault();
    isDrawing = false;
  }

  scratchCanvas.addEventListener("mousedown", startDrawing);
  scratchCanvas.addEventListener("mousemove", draw);
  scratchCanvas.addEventListener("mouseup", stopDrawing);
  scratchCanvas.addEventListener("mouseleave", stopDrawing);
  scratchCanvas.addEventListener("touchstart", startDrawing, { passive: false });
  scratchCanvas.addEventListener("touchmove", draw, { passive: false });
  scratchCanvas.addEventListener("touchend", stopDrawing);
  window.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
});
