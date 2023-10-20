let img;
let brightnessMatrix = [];

const AA_TEXTS = "MWN$@#&B89EGA6mK5HRkbYT43V0JL7gpaseyxznocvjIftr1li*:;,.";
const SEVENELEVEN_TEXTS = "ARS";
const COLUMN_FILL = 42;
const PAPER_WIDTH = 80;
const LINE_HEIGHT = 4;
const PHYSICAL_WIDTH = 1440;  //
const aspect = 623 / 1652;
const PHYSICAL_HEIGHT = PHYSICAL_WIDTH / aspect;
const imgPath = "imgs/711_2.jpg";
let column, row;
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
  column = physicalWidthToColumn(PHYSICAL_WIDTH);
  row = physicalheightToRow(PHYSICAL_HEIGHT);
  console.log(PHYSICAL_HEIGHT, row);
  console.log(`img:w ${column}, img:h ${row}, physical:w ${columnToPhysicalWidth(column)}, physical:h ${rowToPhysicalHeight(row)}`);
  createCanvas(column, row);
  img.resize(column, row); // 画像を420x420ピクセルにリサイズ
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
    let blightnessArr = [];  // シートの輝度配列を印刷する順に並べ替える
    const h = brightnessMatrix[x].length;
    for (let y = 0; y < h; y++) {
      for (let i = 0; i < COLUMN_FILL; i++) {
        blightnessArr.push(brightnessMatrix[x + i][y]);
      }
    }
    // 輝度配列をAA文字列に変換
    texts.push(getAAText(blightnessArr));
  }
  console.log(JSON.stringify(texts));
}

// 輝度配列からAAのテキスト配列に変換, ついでに左寄せと改行フォーマット
function getAAText(blightnessArr) {
  console.log("getAAText");
  let text = "";
  for (let i = 0; i < blightnessArr.length; i += COLUMN_FILL) {
    let line = "";
    let black = false;
    for (let j = 0; j < COLUMN_FILL; j++) {
      const blightness = blightnessArr[i + j];
      const isBlack = blightness < .5;
      if (isBlack != black) {
        black = isBlack;
        line += "`";
      }
      if (black) {
        line += "~";
      } else {
        line += blightness > .9 ? "~" : "@";
      }
    }
    text += `|"${line} |\n`;  // 左寄せで太字フォーマット
  }
  return text;
}