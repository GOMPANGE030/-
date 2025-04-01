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
  const ERASE_RADIUS = 30;
  let isDrawing = false;

  // 배경 이미지 로드
  const image = new Image();
  image.src = "test.jpg";

  image.onload = () => {
    backgroundCanvas.width = scratchCanvas.width = WIDTH;
    backgroundCanvas.height = scratchCanvas.height = HEIGHT;
    
    // 배경 이미지 그리기
    bgCtx.drawImage(image, 0, 0, WIDTH, HEIGHT);
    
    // scratchCanvas를 완전 투명한 캔버스로 설정
    scratchCtx.fillStyle = "#999";
    scratchCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
    scratchCtx.font = "20px sans-serif";
    scratchCtx.fillStyle = "#000";
    scratchCtx.textAlign = "center";
    scratchCtx.textBaseline = "middle";
    scratchCtx.fillText("여기를 긁어보세요", WIDTH / 2, HEIGHT / 2);
  };

  // 긁기 기능
  function startDrawing(event) {
    isDrawing = true;
    draw(event); // 첫 터치에도 바로 효과 적용
  }

  function draw(event) {
    if (!isDrawing) return;
    
    const rect = scratchCanvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    
    scratchCtx.globalCompositeOperation = "destination-out";
    
    scratchCtx.beginPath();
    scratchCtx.arc(offsetX, offsetY, ERASE_RADIUS, 0, Math.PI * 2);
    scratchCtx.fill();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  // 이벤트 리스너 등록
  scratchCanvas.addEventListener("mousedown", startDrawing);
  scratchCanvas.addEventListener("mousemove", draw);
  scratchCanvas.addEventListener("mouseup", stopDrawing);
  scratchCanvas.addEventListener("mouseleave", stopDrawing);

  // 모바일 터치 지원
  scratchCanvas.addEventListener("touchstart", (event) => startDrawing(event.touches[0]));
  scratchCanvas.addEventListener("touchmove", (event) => draw(event.touches[0]));
  scratchCanvas.addEventListener("touchend", stopDrawing);
});
