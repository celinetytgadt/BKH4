// server.js — de app lokaal bekijken, zonder GitHub Pages.
//
//   node hulpmiddelen/server.js        en open dan http://localhost:8080
//
// Een gewone dubbelklik op index.html werkt ook, maar dan blokkeert de
// browser soms het ophalen van gegevens. Met dit kleine servertje niet.

"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const POORT = Number(process.env.PORT) || 8080;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".svg": "image/svg+xml" };

http.createServer((req, res) => {
  const pad = decodeURIComponent(req.url.split("?")[0]);
  const bestand = path.normalize(path.join(ROOT, pad === "/" ? "index.html" : pad));
  if (!bestand.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  fs.readFile(bestand, (err, data) => {
    if (err) { res.writeHead(404); res.end("Niet gevonden"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(bestand).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}).listen(POORT, () => console.log("De app draait op http://localhost:" + POORT));
