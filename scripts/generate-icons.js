import fs from 'node:fs';
import zlib from 'node:zlib';

function createPng(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type 2 (Truecolor, RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with 1 byte filter (0 = None) per scanline
  const scanlineLength = width * 3;
  const rawData = Buffer.alloc(height * (1 + scanlineLength));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      // Draw centered red circle/logo pattern
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < width * 0.35 && dist > width * 0.28) {
        // Red ring
        rawData[offset++] = 239;
        rawData[offset++] = 23;
        rawData[offset++] = 53;
      } else if (dist < width * 0.12) {
        // Center red dot
        rawData[offset++] = 239;
        rawData[offset++] = 23;
        rawData[offset++] = 53;
      } else {
        // Maroon background (#410015)
        rawData[offset++] = r;
        rawData[offset++] = g;
        rawData[offset++] = b;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(len, 0);

  const crcData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, crcData, crcBuf]);
}

// Write PWA icons
const pwa192 = createPng(192, 192, 65, 0, 21);
const pwa512 = createPng(512, 512, 65, 0, 21);
const pwaMaskable = createPng(512, 512, 65, 0, 21);

fs.writeFileSync('./public/pwa-192x192.png', pwa192);
fs.writeFileSync('./public/pwa-512x512.png', pwa512);
fs.writeFileSync('./public/pwa-maskable-512x512.png', pwaMaskable);
fs.writeFileSync('./public/apple-touch-icon.png', pwa192);
fs.writeFileSync('./public/favicon.ico', pwa192);

console.log('PWA PNG icons generated successfully!');
