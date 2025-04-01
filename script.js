const $canvas = document.getElementById("canvas");
const context = $canvas.getContext("2d");
const WIDTH = 400;
const HEIGHT = 200;
const dpr = window.devicePixelRatio;

// 이미지 객체 생성
const image = new Image();
image.src = "test.jpg"; // 배경으로 사용할 이미지 파일

const initCanvas = () => {
  $canvas.style.width = `${WIDTH}px`;
  $canvas.style.height = `${HEIGHT}px`;
  $canvas.width = WIDTH * dpr;
  $canvas.height = HEIGHT * dpr;
  context.scale(dpr, dpr);

  // 이미지가 로드되면 캔버스에 그리기
  image.onload = () => {
    context.drawImage(image, 0, 0, WIDTH, HEIGHT);

    // 안내 문구 추가
    context.font = "20px sans-serif";
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("여기를 긁어보세요", WIDTH / 2, HEIGHT / 2);
  };
};

initCanvas();
