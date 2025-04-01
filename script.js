document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scratchContainer");
  const backgroundCanvas = document.getElementById("backgroundCanvas");
  const scratchCanvas = document.getElementById("scratchCanvas");
  const resultImage = document.getElementById("resultImage");
  
  if (!container || !backgroundCanvas || !scratchCanvas || !resultImage) {
    console.error("Error: Required elements not found!");
    return;
  }
  
  const bgCtx = backgroundCanvas.getContext("2d");
  const scratchCtx = scratchCanvas.getContext("2d");
  let isDrawing = false;
  let currentWidth, currentHeight;
  const ERASE_RADIUS = 20;
  let resultShown = false; // 결과 이미지가 한 번만 표시되도록
  
  // 배경 이미지와 오버레이 이미지 로드
  const bgImage = new Image();
  bgImage.src = "test.jpg";  // 스크래치 카드 배경 이미지
  
  const overlayImage = new Image();
  overlayImage.src = "overlay.png";  // 오버레이(덮개) 이미지
  
  // 컨테이너의 크기에 맞게 캔버스 사이즈 재설정
  function setCanvasSize() {
    const rect = container.getBoundingClientRect();
    currentWidth = rect.width;
    currentHeight = rect.height;
    
    backgroundCanvas.width = scratchCanvas.width = currentWidth;
    backgroundCanvas.height = scratchCanvas.height = currentHeight;
    
    // 배경 이미지 재그리기 (이미 로드되어 있다면)
    if (bgImage.complete) {
      bgCtx.drawImage(bgImage, 0, 0, currentWidth, currentHeight);
    }
    // 오버레이 이미지 재그리기 (이미 로드되어 있다면)
    if (overlayImage.complete) {
      scratchCtx.drawImage(overlayImage, 0, 0, currentWidth, currentHeight);
    }
  }
  
  // 창 크기 변경 시 캔버스 크기 업데이트
  window.addEventListener("resize", setCanvasSize);
  
  // 배경 이미지 로드 완료 시 캔버스 사이즈 설정
  bgImage.onload = () => {
    setCanvasSize();
  };
  
  // 오버레이 이미지 로드 완료 시 그리기 (캔버스 사이즈가 정해진 후)
  overlayImage.onload = () => {
    scratchCtx.drawImage(overlayImage, 0, 0, currentWidth, currentHeight);
  };
  
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
  
  // 스크래치 진행 후 일정 비율 이상 지워지면 결과 이미지를 표시하는 함수
  function checkScratchCompletion() {
    const imageData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    let totalPixels = imageData.data.length / 4;
    let transparentPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) {
        transparentPixels++;
      }
    }
    if (transparentPixels / totalPixels > 0.5 && !resultShown) {  // 50% threshold
      resultImage.style.display = "block";
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
    
    // destination-out 모드로 그리면 오버레이 이미지의 해당 영역이 지워져 배경이 나타납니다.
    scratchCtx.globalCompositeOperation = "destination-out";
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, ERASE_RADIUS, 0, Math.PI * 2);
    scratchCtx.fill();
    
    // 스크래치 완료 여부 체크
    checkScratchCompletion();
  }
  
  // 긁기 종료
  function stopDrawing(event) {
    event.preventDefault();
    isDrawing = false;
  }
  
  // 마우스 이벤트 리스너 등록
  scratchCanvas.addEventListener("mousedown", startDrawing);
  scratchCanvas.addEventListener("mousemove", draw);
  scratchCanvas.addEventListener("mouseup", stopDrawing);
  scratchCanvas.addEventListener("mouseleave", stopDrawing);
  
  // 터치 이벤트 리스너 등록
  scratchCanvas.addEventListener("touchstart", startDrawing, { passive: false });
  scratchCanvas.addEventListener("touchmove", draw, { passive: false });
  scratchCanvas.addEventListener("touchend", stopDrawing);
  
  // 모바일 터치 스크롤 방지
  window.addEventListener("touchmove", (event) => {
    event.preventDefault();
  }, { passive: false });
});
