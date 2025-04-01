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

  // 🎨 1️⃣ 배경 이미지 로드
  const image = new Image();
  image.src = "test.jpg"; // 긁기 후 나타날 이미지

  image.onload = () => {
    // 캔버스 크기 설정
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // 배경 이미지 먼저 그림
    ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);

    // 덮개를 그림 (완전히 불투명한 회색)
    ctx.fillStyle = "#999";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 안내 문구 추가
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("여기를 긁어보세요", WIDTH / 2, HEIGHT / 2);
  };

  // 🎨 긁기 기능 (덮개 지우기)
  function startDrawing() {
    isDrawing = true;
  }

  function draw(event) {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event;

    // 지우기 모드 활성화 (덮개 제거)
    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(offsetX, offset
