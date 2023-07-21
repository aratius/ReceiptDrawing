const ws = require("ws");
const statements = require("./endlessStatements");
const baseStatement = require("./baseStatement");
const config = require("./config");
const print = require("./print");

const server = new ws.Server({ port: 9000 });
let isPrinting = false;

const printer1 = config.printer1;
const printer2 = config.printer2;

const main = async () => {

  // TODO: Wsサーバ立てて、トリガで両方印刷
  server.on("connection", wss => {
    wss.on("message", msg => {
      console.log("message");
      // TODO: プリンタ1持ち帰り用ステートメントの印刷
      // TODO: プリンタ2無限ステートメント
      if (!isPrinting) {
        print(baseStatement, printer1);
        printEndless();
        isPrinting = true;
        setTimeout(() => isPrinting = false, 5000);
      }
    });
  });

  setInterval(printEndless, 10);

};

let index = 0;
let statementsCopied = [...statements];
const printEndless = () => {
  const statement = statementsCopied[index];
  const max = Math.min(21, statement.length);
  const text = statement.slice(0, max);
  statementsCopied[index] = statement.slice(max, statement.length);
  print(text, printer2);
  console.log(text);
  if (statementsCopied[index].length == 0) {
    index++;
    index = index % statements.length;
    statementsCopied = [...statements];
  }
};

main();