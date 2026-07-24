const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('public/osmanCV.pdf');
const contentStr = buf.toString('latin1');

// Find all streams
const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
let match;
let streams = [];

while ((match = streamRegex.exec(contentStr)) !== null) {
  try {
    const decompressed = zlib.inflateSync(Buffer.from(match[1], 'latin1'));
    streams.push(decompressed.toString('utf8'));
  } catch (e) {
    // raw stream or different encoding
    streams.push(match[1]);
  }
}

// Map CID tables if any
const cmaps = {};
// Let's decode character mappings from CMap streams
const cmapRegex = /beginbfchar([\s\S]*?)endbfchar/g;
const cmapRangeRegex = /beginbfrange([\s\S]*?)endbfrange/g;

// Simple text extraction from PDF stream operators
let text = '';
for (const s of streams) {
  const tjRegex = /\[(.*?)\]\s*TJ|\((.*?)\)\s*Tj/g;
  let m;
  while ((m = tjRegex.exec(s)) !== null) {
    text += (m[1] || m[2]) + ' ';
  }
}

console.log("Extracted text elements:", streams.length);

// Let's also print character sequences found
const allStrings = [];
const strRegex = /\(([\s\S]*?)\)/g;
for (const s of streams) {
  let sm;
  while ((sm = strRegex.exec(s)) !== null) {
    allStrings.push(sm[1]);
  }
}

fs.writeFileSync('scratch/pdf_text.txt', text + '\n---\n' + allStrings.join('\n'));
console.log("Saved to scratch/pdf_text.txt");
