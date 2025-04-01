document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scratchContainer");
  const backgroundCanvas = document.getElementById("backgroundCanvas");
  const scratchCanvas = document.getElementById("scratchCanvas");
  const resultImage = document.getElementById("resultImage");
  const panpanImage = document.getElementById("panpanImage");

  if (!container || !backgroundCanvas || !scratchCanvas || !resultImage || !panpanImage) {
    console.error("Error: Required elements not found!");
    return;
  }
  
  const bgCtx = backgroundCanvas.getContext("2d");
  const scratchCtx = scratchCanvas.getContext("2d");
  let isDrawing = false;
  let currentWidth, currentHeight;
  const ERASE_RADIUS = 20;
  let resultShown = false; // 페이드인/아웃 효과가 한 번만 실행되도록
  
  // 배경 이미지와 오버레이 이미지 로드
  const bgImage = new Image();
  bgImage.src = "pic.png"; // 변경: 스크래치 카드 배경 이미지 (이전 test.jpg -> pic.png)
  
  const overlayImage = new Image();
  overlayImage.src = "overlay.png"; // 오버레이(덮개) 이미지
  
  // 컨테이너 크기에 맞게 캔버스 사이즈 재설정
  function setCanvasSize() {
    const rect = container.getBoundingClientRect();
    currentWidth = rect.width;
    currentHeight = rect.height;
    
    backgroundCanvas.width = scratchCanvas.width = currentWidth;
    backgroundCanvas.height = scratchCanvas.height = currentHeight;
    
    // 배경 이미지 그리기
    if (bgImage.complete) {
      bgCtx.drawImage(bgImage, 0, 0, currentWidth, currentHeight);
    }
    // 오버레이 이미지 그리기
    if (overlayImage.complete) {
      scratchCtx.drawImage(overlayImage, 0, 0, currentWidth, currentHeight);
    }
  }
  
  window.addEventListener("resize", setCanvasSize);
  bgImage.onload = () => { setCanvasSize(); };
  overlayImage.onload = () => { scratchCtx.drawImage(overlayImage, 0, 0, currentWidth, currentHeight); };
  
  // 터치 및 마우스 좌표 계산 함수
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
  
  // 스크래치 진행률 체크 함수 (50% 이상이면)
  function checkScratchCompletion() {
    const imageData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    let totalPixels = imageData.data.length / 4;
    let transparentPixels = 0;
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      // 알파값이 128 미만이면 투명하다고 간주
      if (imageData.data[i + 3] < 128) {
        transparentPixels++;
      }
    }
    
    if (transparentPixels / totalPixels > 0.5 && !resultShown) {
      // overlay(스크래치 덮개)를 페이드아웃 시켜 배경(pic.png)이 보이도록 함
      scratchCanvas.classList.add("fade-out");
      // 결과 이미지(result.png)를 페이드인
      resultImage.classList.add("visible");
      // panpan.png를 레이아웃 최상단에 페이드인
      panpanImage.classList.add("visible");
      
      resultShown = true;
    }
  }
  
  // 긁기 시작
  function startDrawing(event) {
    event.preventDefault();
    isDrawing = true;
    draw(event);
  }
  
  // 긁기 진행
  function draw(event) {
    if (!isDrawing) return;
    event.preventDefault();
    
    const { x, y } = getEventPosition(event);
    // destination-out 모드: overlay의 해당 영역을 지워 배경(pic.png)이 보이게 함
    scratchCtx.globalCompositeOperation = "destination-out";
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, ERASE_RADIUS, 0, Math.PI * 2);
    scratchCtx.fill();
    
    checkScratchCompletion();
  }
  
  // 긁기 종료
  function stopDrawing(event) {
    event.preventDefault();
    isDrawing = false;
  }
  
  // 이벤트 리스너 등록 (마우스 및 터치)
  scratchCanvas.addEventListener("mousedown", startDrawing);
  scratchCanvas.addEventListener("mousemove", draw);
  scratchCanvas.addEventListener("mouseup", stopDrawing);
  scratchCanvas.addEventListener("mouseleave", stopDrawing);
  scratchCanvas.addEventListener("touchstart", startDrawing, { passive: false });
  scratchCanvas.addEventListener("touchmove", draw, { passive: false });
  scratchCanvas.addEventListener("touchend", stopDrawing);
  window.addEventListener("touchmove", (event) => { event.preventDefault(); }, { passive: false });
});
