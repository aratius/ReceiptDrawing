let img;
let brightnessMatrix = [];

const AA_TEXTS = "MWN$@#&B89EGA6mK5HRkbYT43V0JL7gpaseyxznocvjIftr1li*:;,.";
const SEVENELEVEN_TEXTS = "ARS";
const COLUMN_FILL = 42;
const PAPER_WIDTH = 80;
const LINE_HEIGHT = 4;
const PHYSICAL_WIDTH = 720;
const aspect = 500 / 876;
const PHYSICAL_HEIGHT = 720 / aspect;
const imgPath = "imgs/thai.jpg";
let width, height;
let cnt = 0;

function rowToPhysicalHeight(row) {
  return row * LINE_HEIGHT;
};

function physicalheightToRow(h) {
  return h / LINE_HEIGHT;
};

function columnToPhysicalWidth(column) {
  return column / COLUMN_FILL * PAPER_WIDTH;
}

function physicalWidthToColumn(w) {
  return Math.floor((w / PAPER_WIDTH * COLUMN_FILL) / COLUMN_FILL) * COLUMN_FILL;
}

function preload() {
  img = loadImage(imgPath); // あなたの画像へのパスを設定
}

function setup() {
  width = physicalWidthToColumn(PHYSICAL_WIDTH);
  height = physicalheightToRow(PHYSICAL_HEIGHT);
  console.log(`img:w ${width}, img:h ${height}, physical:w ${columnToPhysicalWidth(width)}, physical:h ${rowToPhysicalHeight(height)}`);
  createCanvas(width, height);
  img.resize(width, height); // 画像を420x420ピクセルにリサイズ
  img.loadPixels(); // 画像のピクセルデータをロード

  for (let x = 0; x < img.width; x++) {
    brightnessMatrix[x] = []; // 新しい行を作成
    for (let y = 0; y < img.height; y++) {
      let index = 4 * (y * img.width + x); // ピクセル配列のインデックスを取得
      let r = img.pixels[index]; // 赤チャネルの値を取得
      let g = img.pixels[index + 1]; // 緑チャネルの値を取得
      let b = img.pixels[index + 2]; // 青チャネルの値を取得
      let brightness = (r + g + b) / 3 / 255; // RGB値を平均化して輝度を計算し、0-1に正規化
      brightness = (brightness - .5) * 1.2 + .5;  // コントラスト強化
      brightness = Math.max(Math.min(brightness, 1), 0);
      brightnessMatrix[x][y] = brightness; // 輝度を2次元配列に格納
    }
  }
}

function draw() {
  background(220);
  image(img, 0, 0); // 画像を描画
  noLoop(); // draw関数の繰り返しを停止
  logFormatted();
}

function logFormatted() {
  console.log("printImg");
  let texts = [];  // シートごとのテキスト
  const w = brightnessMatrix.length;
  for (let x = 0; x < w; x += COLUMN_FILL) {
    let brightnessArr = [];  // シートの輝度配列を印刷する順に並べ替える
    const h = brightnessMatrix[x].length;
    for (let y = 0; y < h; y++) {
      for (let i = 0; i < COLUMN_FILL; i++) {
        brightnessArr.push(brightnessMatrix[x + i][y]);
      }
    }
    // 輝度配列をAA文字列に変換
    texts.push(getAAText(brightnessArr));
  }
  console.log(JSON.stringify(texts));
}

// 輝度配列からAAのテキスト配列に変換, ついでに左寄せと改行フォーマット
function getAAText(brightnessArr) {
  console.log("getAAText");
  let text = "";
  for (let i = 0; i < brightnessArr.length; i += COLUMN_FILL) {
    let line = "";
    for (let j = 0; j < COLUMN_FILL; j++) {
      const aaPickupIndex = Math.floor(brightnessArr[i + j] * (AA_TEXTS.length - 1));
      if (aaPickupIndex < 8) line += SEVENELEVEN_TEXTS[cnt++ % SEVENELEVEN_TEXTS.length];
      else line += AA_TEXTS[aaPickupIndex];
    }
    text += `|"${line} |\n`;  // 左寄せで太字フォーマット
  }
  return text;
}