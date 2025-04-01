document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("scratchContainer");
  const backgroundCanvas = document.getElementById("backgroundCanvas");
  const scratchCanvas = document.getElementById("scratchCanvas");
  if (!backgroundCanvas || !scratchCanvas || !container) {
    console.error("Error: Canvas elements not found!");
    return;
  }

  const bgCtx = backgroundCanvas.getContext("2d");
  const scratchCtx = scratchCanvas.getContext("2d");
  const WIDTH = 400;
  const HEIGHT = 200;
  const ERASE_RADIUS = 20;
  let isDrawing = false;

  // 배경 이미지 로드
  const bgImage = new Image();
  bgImage.src = "test.jpg";

  // 오버레이(덮개) 이미지 로드 - 여러분이 제작한 이미지
  const overlayImage = new Image();
  overlayImage.src = "overlay.png"; // 여러분이 만든 이미지 파일명으로 변경

  // 배경 이미지가 로드되면 캔버스 크기 설정 및 배경 그리기
  bgImage.onload = () => {
    backgroundCanvas.width = scratchCanvas.width = WIDTH;
    backgroundCanvas.height = scratchCanvas.height = HEIGHT;
    
    // 배경 이미지 그리기
    bgCtx.drawImage(bgImage, 0, 0, WIDTH, HEIGHT);

    // 오버레이 이미지가 로드되면 scratchCanvas에 그리기
    overlayImage.onload = () => {
      scratchCtx.drawImage(overlayImage, 0, 0, WIDTH, HEIGHT);
    };
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

  // 긁기 시작
  function startDrawing(event) {
    event.preventDefault(); // 터치 기본 동작 방지
    isDrawing = true;
    draw(event); // 첫 터치에서도 효과 적용
  }

  // 긁기 진행
  function draw(event) {
    if (!isDrawing) return;
    event.preventDefault(); // 터치 이동 시 스크롤 방지
    
    const { x, y } = getEventPosition(event);
    
    // destination-out 모드로 그리면, 해당 영역이 지워져 배경이 보임
    scratchCtx.globalCompositeOperation = "destination-out";
    
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, ERASE_RADIUS, 0, Math.PI * 2);
    scratchCtx.fill();
  }

  // 긁기 종료
  function stopDrawing(event) {
    event.preventDefault();
    isDrawing = false;
  }

  // 이벤트 리스너 등록 (마우스)
  scratchCanvas.addEventListener("mousedown", startDrawing);
  scratchCanvas.addEventListener("mousemove", draw);
  scratchCanvas.addEventListener("mouseup", stopDrawing);
  scratchCanvas.addEventListener("mouseleave", stopDrawing);

  // 이벤트 리스너 등록 (터치)
  scratchCanvas.addEventListener("touchstart", startDrawing, { passive: false });
  scratchCanvas.addEventListener("touchmove", draw, { passive: false });
  scratchCanvas.addEventListener("touchend", stopDrawing);

  // 모바일 터치 스크롤 완전 차단
  window.addEventListener("touchmove", (event) => {
    event.preventDefault();
  }, { passive: false });
});
