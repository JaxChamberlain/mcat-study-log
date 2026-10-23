// Builds the Vercel version of the tracker: node build.js
// Wraps mcat-tracker.html (the same file the Claude artifact uses) in a full page with
// home-screen app tags, supabase-js, and site/config.js.
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "mcat-tracker.html"), "utf8");
const cut = src.indexOf("</style>") + "</style>".length;
const head = src.slice(0, cut).replace(/<meta name="claude:viewport-fit-sides"[^>]*>\n?/, "");
const body = src.slice(cut).trim();

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0d6b72">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="MCAT">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" type="image/png" href="icon-192.png">
<style>
:root { color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
body { margin: 0; font: 14px/1.4 system-ui, sans-serif; }
img { max-width: 100%; }
[hidden] { display: none !important; }
</style>
${head}
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>
<script src="config.js"></script>
</head>
<body>
${body}
</body>
</html>
`;

fs.mkdirSync(path.join(__dirname, "site"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "site", "index.html"), page);
console.log("Built site/index.html");
