document.addEventListener("DOMContentLoaded", () => {
  const container     = document.getElementById("scratchContainer");
  const bgCanvas      = document.getElementById("backgroundCanvas");
  const scratchCanvas = document.getElementById("scratchCanvas");
  const resultImage   = document.getElementById("resultImage");
  const panpanImage   = document.getElementById("panpanImage");
  const failImage     = document.getElementById("failImage");
  const celeImage     = document.getElementById("celeImage");
  const coinImage     = document.getElementById("coinImage");

  if (![container, bgCanvas, scratchCanvas, resultImage,
        panpanImage, failImage, celeImage, coinImage].every(el => el)) {
    console.error("Required elements missing");
    return;
  }

  // coin 등장
  setTimeout(() => coinImage.classList.add("visible"), 100);

  const bgCtx      = bgCanvas.getContext("2d");
  const scratchCtx = scratchCanvas.getContext("2d");
  let isDrawing    = false;
  let resultShown  = false;
  const ERASE_R    = 20;
  let cw, ch;

  // 랜덤 결과 선택
  const sources = [
    { src: "r1.png", weight: 0.4, result: "result.png",  fail: false },
    { src: "r2.png", weight: 0.4, result: "result2.png", fail: false },
    { src: "r3.png", weight: 0.2, result: "result3.png", fail: true  }
  ];
  const rnd = Math.random();
  let cum = 0, sel = sources[0];
  for (const s of sources) {
    cum += s.weight;
    if (rnd < cum) { sel = s; break; }
  }
  const bgImage      = new Image(); bgImage.src = sel.src;
  const overlayImage = new Image(); overlayImage.src = "overlay.png";

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    cw = rect.width; ch = rect.height;
    bgCanvas.width = scratchCanvas.width = cw;
    bgCanvas.height = scratchCanvas.height = ch;

    if (bgImage.complete) {
      bgCtx.clearRect(0, 0, cw, ch);
      bgCtx.drawImage(bgImage, 0, 0, cw, ch);
    }
    if (overlayImage.complete) {
      scratchCtx.clearRect(0, 0, cw, ch);
      scratchCtx.drawImage(overlayImage, 0, 0, cw, ch);
    }
  }
  window.addEventListener("resize", resizeCanvas);
  bgImage.onload      = resizeCanvas;
  overlayImage.onload = () => scratchCtx.drawImage(overlayImage, 0, 0, cw, ch);

  function getPos(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    if (e.touches) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function checkComplete() {
    const imgd = scratchCtx.getImageData(0, 0, cw, ch).data;
    const total = imgd.length / 4;
    let trans = 0;
    for (let i = 3; i < imgd.length; i += 4) {
      if (imgd[i] < 128) trans++;
    }
    if (trans / total > 0.5 && !resultShown) {
      scratchCanvas.classList.add("fade-out");

      // 결과 이미지 교체 및 표시
      resultImage.src = sel.result;
      resultImage.classList.add("visible");

      // 성공/실패 이펙트
      if (sel.fail) {
        failImage.classList.add("visible");
      } else {
        panpanImage.classList.add("visible");
      }

      // celebration
      celeImage.classList.add("visible");
      resultShown = true;
    }
  }

  function startDraw(e) { e.preventDefault(); isDrawing = true; draw(e); }
  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    scratchCtx.globalCompositeOperation = "destination-out";
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, ERASE_R, 0, Math.PI * 2);
    scratchCtx.fill();
    checkComplete();
  }
  function stopDraw(e) { e.preventDefault(); isDrawing = false; }

  scratchCanvas.addEventListener("mousedown", startDraw);
  scratchCanvas.addEventListener("mousemove", draw);
  scratchCanvas.addEventListener("mouseup", stopDraw);
  scratchCanvas.addEventListener("mouseleave", stopDraw);
  scratchCanvas.addEventListener("touchstart", startDraw, { passive: false });
  scratchCanvas.addEventListener("touchmove", draw, { passive: false });
  scratchCanvas.addEventListener("touchend", stopDraw);
  window.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
});
