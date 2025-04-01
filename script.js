document.addEventListener("DOMContentLoaded", () => {
  const backgroundCanvas = document.getElementById("backgroundCanvas");
  const scratchCanvas = document.getElementById("scratchCanvas");
  if (!backgroundCanvas || !scratchCanvas) {
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

    // 덮개 캔버스 설정 (회색 배경 + 텍스트 표시)
    scratchCtx.fillStyle = "#999";
    scratchCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
    scratchCtx.font = "20px sans-serif";
    scratchCtx.fillStyle = "#000";
    scratchCtx.textAlign = "center";
    scratchCtx.textBaseline = "middle";
    scratchCtx.fillText("여기를 긁어보세요", WIDTH / 2, HEIGHT / 2);
  };

  // 긁기 기능
  function startDrawing() {
    isDrawing = true;
  }

  function draw(event) {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event;
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
});
