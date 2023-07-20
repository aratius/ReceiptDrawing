const http = require("http");
const texts = require("./text.json");

const range = [40, 50];  // 0 - 4
const CAPITAL_INTERVAL = 10 * 1000;  // 書き換える

const main = async () => {
  console.log(`exec from ${range[0]} to ${Math.min(range[1], texts.length)}`);

  for (let i = range[0]; i < Math.min(range[1], texts.length); i++) {
    print(`${i}\n\n\n`);
    await sleep(1000);
    print(texts[i].replace('\\"', '"'));
    await sleep(CAPITAL_INTERVAL);
    print("\n\n\n=");
    await sleep(1000);
  }
};

const sleep = async (t) => {
  return new Promise(r => setTimeout(r, t));
};

const print = (text) => {
  const req = http.request(
    {
      host: "192.168.0.15",
      port: "8080",
      path: "/tm_series1",
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    }
  );
  const body = {
    text,
    time: Date.now() + 500
  };
  req.write(JSON.stringify(body));
  req.end();
};

main();