if (typeof inspector === "undefined") {
  process._debugProcess(process.pid);
}

import path from "node:path";
import fs from 'fs/promises';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from "module";
const require = createRequire(import.meta.url);

//const { spawn } = require("child_process");
//const originalSpawn = spawn;

//require("child_process").spawn = function (...args) {
//  console.error("spawn called with:", args);
//  const err = new Error("Spawn intercepted");
//  console.error(err.stack);
//  throw new Error("spawn(node) not allowed in mobile");
//};

console.log("Hello World!");
console.log(process.versions);

const config = require("./package.json");

const http = require("http");
const server = http.createServer(async (req, res) => {
  // 允许跨域（方便前端调试）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.url === '/versions' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(process.versions));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});
server.listen(config.port, '0.0.0.0', () => {
  console.log(` Server running at http://localhost:${config.port}`);
  console.log(`   - GET /versions → Node.js versions`);
});