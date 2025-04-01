document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  if (!canvas) {
    console.error("Error: 'canvas' element not found!");
    return;
  }

  const ctx = canvas.getContext("2d");
  const WIDTH = 400;
  const HEIGHT = 200;
  const ERASE_RADIUS = 30; // 지우는 반경
  let isDrawing = false;

  // 배경 이미지 로드
  const image = new Image();
  image.src = "test.jpg"; // 긁기 후 나타날 이미지

  image.onload = () => {
    // 캔버스 크기 설정
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // 배경 이미지 그리기
    ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);

    // 덮개 그리기 (회색)
    ctx.fillStyle = "#999";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 텍스트 추가
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("여기를 긁어보세요", WIDTH / 2, HEIGHT / 2);
  };

  // 긁기 시작
  function startDrawing() {
    isDrawing = true;
  }

  // 긁는 동작
  function draw(event) {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event;

    // 긁기 모드 활성화
    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(offsetX, offsetY, ERASE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  // 긁기 종료
  function stopDrawing() {
    isDrawing = false;
  }

  // 마우스 이벤트 리스너 등록
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);

  // 터치 이벤트 등록 (모바일 대응)
  canvas.addEventListener("touchstart", (event) => {
    isDrawing = true;
  });

  canvas.addEventListener("touchmove", (event) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(offsetX, offsetY, ERASE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  });

  canvas.addEventListener("touchend", () => {
    isDrawing = false;
  });
});
