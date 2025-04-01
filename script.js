const image = new Image(); // 이미지를 불러올 객체 생성
image.src = "test.jpg"; // 🔹 원하는 이미지 파일 경로 입력

image.onload = () => {
  const initCanvas = () => {
    $canvas.style.width = `${WIDTH}px`;
    $canvas.style.height = `${HEIGHT}px`;
    $canvas.width = WIDTH * dpr;
    $canvas.height = HEIGHT * dpr;
    context.scale(dpr, dpr);

    // 1️⃣ 🔹 배경을 내가 만든 이미지로 설정
    context.drawImage(image, 0, 0, WIDTH, HEIGHT);

    // 2️⃣ 🔹 그 위를 회색으로 덮어서 긁으면 보이게 함
    context.fillStyle = "#999";
    context.fillRect(0, 0, WIDTH, HEIGHT);

    // 안내 문구 추가
    context.font = "20px sans-serif";
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("여기를 긁어보세요", WIDTH / 2, HEIGHT / 2);
  };

  initCanvas();
};
