const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('public/osmanCV.pdf');

// Parse PDF CMaps and font streams
// CMap 25 0 R maps hex CIDs to Unicode characters
// <0001> <003C> [<0053> <004F> <0046> <0054> <0057> <0041> <0052> <0045> ...]
// CMap 31 0 R maps hex CIDs to Unicode characters
// <0001> <002A> [<0043> <004F> <004E> <0054> <0041> <0045> <0048> ...]

// Let's build full CID to unicode map from CMap streams in PDF
const cmap1 = [
  'S','O','F','T','W','A','R','E','\t','N','G','I','U','D','/','L','C','K','B','-','M','V','P','e','n','i','o','r','Y','a','·','g','s','t','c','h','l','y','J','u','2','0','6','p','m','b','x','.','j','w','d','v','H','Q','+','9','5','3','8','1'
];
const cmap2 = [
  'C','O','N','T','A','E','H','I','L','\t','S','K','F','G','U','o','l','g','a','s','m','n','y','P','R','D','t','e','r','M','d','i','v','X','W','b','p','&','f','w','ç','u'
];

// Let's decode hex strings in stream
const contentStr = buf.toString('latin1');
const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
let match;
let streams = [];

while ((match = streamRegex.exec(contentStr)) !== null) {
  try {
    const decompressed = zlib.inflateSync(Buffer.from(match[1], 'latin1'));
    streams.push(decompressed.toString('latin1'));
  } catch (e) {
    streams.push(match[1]);
  }
}

// Extract hex Tj/TJ arrays
let result = "";
for (const s of streams) {
  const tjRegex = /<([0-9A-Fa-f\s]+)>\s*Tj|\[\s*(<[0-9A-Fa-f\s]+>.*?)\s*\]\s*TJ/g;
  let m;
  while ((m = tjRegex.exec(s)) !== null) {
    const blob = m[1] || m[2];
    const hexes = blob.match(/<([0-9A-Fa-f]+)>/g) || [];
    for (const h of hexes) {
      const code = parseInt(h.replace(/[<>]/g, ''), 16);
      if (code >= 1 && code <= cmap1.length) {
        result += cmap1[code - 1];
      } else {
        result += `[${code.toString(16)}]`;
      }
    }
    result += " ";
  }
  result += "\n";
}

console.log("Decoded text:\n", result);
fs.writeFileSync('scratch/decoded_cv.txt', result);
