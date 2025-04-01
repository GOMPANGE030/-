document.addEventListener("DOMContentLoaded", () => {
  const $canvas = document.getElementById("canvas");
  if (!$canvas) {
    console.error("Error: 'canvas' element not found!");
    return;
  }

  const context = $canvas.getContext("2d");
  const WIDTH = 400;
  const HEIGHT = 200;
  const dpr = window.devicePixelRatio;
  const ERASE_RADIUS = 30; // 지우는 반경
  let isDrawing = false;

  // 🎨 배경 이미지 로드
  const image = new Image();
  image.src = "test.jpg"; // 긁기 후 나타날 이미지

  image.onload = () => {
    // 캔버스 크기 설정
    $canvas.width = WIDTH;
    $canvas.height = HEIGHT;

    // 1️⃣ 배경 이미지 먼저 그림
    context.drawImage(image, 0, 0, WIDTH, HEIGHT);

    // 2️⃣ 덮개 설정 (완전히 불투명한 회색)
    context.fillStyle = "#999";
    context.fillRect(0, 0, WIDTH, HEIGHT);

    // 3️⃣ 안내 문구 추가
    context.font = "20px sans-serif";
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("여기를 긁어보세요", WIDTH / 2, HEIGHT / 2);

    // 4️⃣ 덮개를 지울 수 있도록 globalCompositeOperation 설정
    context.globalCompositeOperation = "destination-out";
  };

  // 🎨 긁기 기능 (덮개 지우기)
  const handleDrawingStart = () => {
    isDrawing = true;
  };

  const handleDrawing = (event) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = event;
    context.beginPath();
    context.arc(offsetX, offsetY, ERASE_RADIUS, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  };

  const handleDrawingEnd = () => {
    isDrawing = false;
  };

  // 🖱️ 이벤트 리스너 등록
  $canvas.addEventListener("mousedown", handleDrawingStart);
  $canvas.addEventListener("mousemove", handleDrawing);
  $canvas.addEventListener("mouseup", handleDrawingEnd);
});
