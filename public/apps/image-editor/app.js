/**
 * 画像編集アプリ（サンプル）— クライアントサイドのみ
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("file-input");
const brightnessInput = document.getElementById("brightness");
const brightnessValue = document.getElementById("brightness-value");
const grayscaleInput = document.getElementById("grayscale");
const rotateBtn = document.getElementById("rotate-btn");
const resetBtn = document.getElementById("reset-btn");
const downloadBtn = document.getElementById("download-btn");
const placeholder = document.getElementById("placeholder");

let sourceImage = null;
let rotation = 0;

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch("/api/apps/image-editor/access", {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href = "/login/?next=" + encodeURIComponent("/apps/image-editor/");
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  document.getElementById("app-main").hidden = false;
  return true;
}

/** フィルタ文字列を生成 */
function buildFilter() {
  const parts = [];
  const brightness = Number(brightnessInput.value) / 100;
  parts.push(`brightness(${brightness})`);
  if (grayscaleInput.checked) parts.push("grayscale(1)");
  return parts.join(" ");
}

/** キャンバスを再描画 */
function renderCanvas() {
  if (!sourceImage) return;

  const radians = (rotation * Math.PI) / 180;
  const swap = rotation % 180 !== 0;
  const drawWidth = swap ? sourceImage.height : sourceImage.width;
  const drawHeight = swap ? sourceImage.width : sourceImage.height;

  canvas.width = drawWidth;
  canvas.height = drawHeight;
  ctx.clearRect(0, 0, drawWidth, drawHeight);
  ctx.filter = buildFilter();
  ctx.save();
  ctx.translate(drawWidth / 2, drawHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(sourceImage, -sourceImage.width / 2, -sourceImage.height / 2);
  ctx.restore();
  ctx.filter = "none";

  placeholder.hidden = true;
  downloadBtn.disabled = false;
}

/** 画像ファイルを読み込む */
function loadImageFile(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      sourceImage = img;
      rotation = 0;
      brightnessInput.value = "100";
      brightnessValue.textContent = "100";
      grayscaleInput.checked = false;
      renderCanvas();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

/** 状態をリセット */
function resetEditor() {
  sourceImage = null;
  rotation = 0;
  brightnessInput.value = "100";
  brightnessValue.textContent = "100";
  grayscaleInput.checked = false;
  fileInput.value = "";
  downloadBtn.disabled = true;
  placeholder.hidden = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) loadImageFile(file);
});

brightnessInput.addEventListener("input", () => {
  brightnessValue.textContent = brightnessInput.value;
  renderCanvas();
});

grayscaleInput.addEventListener("change", renderCanvas);

rotateBtn.addEventListener("click", () => {
  rotation = (rotation + 90) % 360;
  renderCanvas();
});

resetBtn.addEventListener("click", resetEditor);

downloadBtn.addEventListener("click", () => {
  if (!sourceImage) return;
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

const allowed = await checkAccess();
if (allowed) {
  resetEditor();
}
