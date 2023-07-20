// Node.js script in Max/MSP
const http = require('http');
const path = require('path');
const Max = require('max-api');

const options1 = {
  hostname: '172.20.10.6',
  port: 8080,
  path: '/tm_series1',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
  }
};

const options2 = {
  hostname: '172.20.10.6',
  port: 8081,
  path: '/tm_series2',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
  }
};

const printer1 = {
	options: options1,
	standby: true
}

const printer2 = {
	options: options2,
	standby: true
}

let targetPrinter = printer1

// Use the 'addHandler' function to register a function for a particular message
Max.addHandler("number", (v) => {
  // If a request is already pending, ignore the bang
  targetPrinter = targetPrinter.options.port == printer1.options.port ? printer2 : printer1;

  if (!targetPrinter.standby) {
    Max.post("Ignoring bang because a request is pending.");
    return;
  }

  const p = targetPrinter
  p.standby = false

  Max.post(`data:${v}`);

  const req = http.request(targetPrinter.options, res => {
    res.on('data', d => {
      Max.outlet(d.toString());
    });

    res.on('end', () => {
      p.standby = true;
    });
  });

  req.on('error', error => {
    console.error(error);
    p.standby = true;
  });

const body = {
  text:`\n{code:random number${Math.floor(Math.random() * 100) / 100}; option:code128,1,${v},nohri}`,
  time:Date.now()+550
}

  req.write(JSON.stringify(body));
  req.end();
});