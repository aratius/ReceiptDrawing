const http = require("http");
const ws = require("ws");
const statements = require("./endlessStatements");
const baseStatement = require("./baseStatement");

const server = new ws.Server({ port: 9000 });
let isPrinting = false;

const printer1 = {
  host: "127.0.0.1",
  port: "8080",
  path: "/tm_series1",
  method: "POST",
  headers: {
    "Content-Type": "text/plain; charset=utf-8"
  }
};

const printer2 = {
  host: "127.0.0.1",
  port: "8081",
  path: "/tm_series1",
  method: "POST",
  headers: {
    "Content-Type": "text/plain; charset=utf-8"
  }
};

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

};

const printEndless = () => {

};

const print = (text, config) => {
  const req = http.request(config);
  const body = {
    text,
    time: Date.now() + 500
  };
  req.write(JSON.stringify(body));
  req.end();
};

main();