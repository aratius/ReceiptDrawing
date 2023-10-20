const http = require("http");
const texts = require("./text.json");

const range = [0, 1];  // 0 - 4
const CAPITAL_INTERVAL = 120 * 1000;  // 書き換える

const main = async () => {
  console.log(`exec from ${range[0]} to ${Math.min(range[1], texts.length)}`);
  print(`=`);
  await sleep(1000);
  for (let i = range[0]; i < Math.min(range[1], texts.length); i++) {
    print(`${i}\n-\n\n`);
    await sleep(1000);
    const res = texts[i].replace('\\"', '"');
    const resSplit = res.split("\n");
    const step = 100;
    for (let j = 0; j < resSplit.length; j += step) {
      print(resSplit.slice(j, j + step).join(""));
      await sleep(10 * 1000);
    }
    // await sleep(CAPITAL_INTERVAL);
    print("\n\n\n=");
    await sleep(1000);
  }
};

const sleep = async (t) => {
  return new Promise(r => setTimeout(r, t));
};

const print = (text) => {
  console.log(text);
  const req = http.request(
    {
      host: "127.0.0.1",
      port: "8081",
      path: "/tm_series1",
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    }
  );
  req.write(text);
  req.end();
};

main();