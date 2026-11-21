import fs from "node:fs";
import path from "node:path";

export interface PublicImageMeta {
  width: number;
  height: number;
  type: "image/jpeg" | "image/png" | "image/webp";
  ratio: number;
}

const cache = new Map<string, PublicImageMeta | null>();

function parsePng(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  if (
    buf[0] !== 0x89 ||
    buf[1] !== 0x50 ||
    buf[2] !== 0x4e ||
    buf[3] !== 0x47
  ) {
    return null;
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function parseWebp(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 30) return null;
  if (
    buf.toString("ascii", 0, 4) !== "RIFF" ||
    buf.toString("ascii", 8, 12) !== "WEBP"
  ) {
    return null;
  }
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    return { width, height };
  }
  if (chunk === "VP8 " && buf[23] === 0x9d && buf[24] === 0x01 && buf[25] === 0x2a) {
    const width = buf.readUInt16LE(26) & 0x3fff;
    const height = buf.readUInt16LE(28) & 0x3fff;
    return { width, height };
  }
  if (chunk === "VP8L" && buf[20] === 0x2f) {
    const bits = buf.readUInt32LE(21);
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  }
  return null;
}

function parseExifOrientation(buf: Buffer, app1Start: number, app1Len: number): number {
  // Expect "Exif\0\0" at app1Start + 4
  if (app1Start + 14 > buf.length || app1Len < 12) return 1;
  if (buf.toString("ascii", app1Start + 4, app1Start + 10) !== "Exif\0\0") return 1;
  const tiff = app1Start + 10;
  const littleEndian = buf.toString("ascii", tiff, tiff + 2) === "II";
  const readU16 = (o: number) => (littleEndian ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
  const readU32 = (o: number) => (littleEndian ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
  if (tiff + 8 > buf.length) return 1;
  const ifd0Offset = readU32(tiff + 4);
  const ifd0 = tiff + ifd0Offset;
  if (ifd0 + 2 > buf.length) return 1;
  const entries = readU16(ifd0);
  for (let i = 0; i < entries; i++) {
    const entry = ifd0 + 2 + i * 12;
    if (entry + 12 > buf.length) break;
    const tag = readU16(entry);
    if (tag === 0x0112) {
      return readU16(entry + 8);
    }
  }
  return 1;
}

function parseJpeg(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  let orientation = 1;
  while (offset + 4 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (offset < buf.length && buf[offset] === 0xff) offset += 1;
    if (offset >= buf.length) break;
    const marker = buf[offset];
    offset += 1;
    if (marker === 0xd9 || marker === 0xda) break; // EOI or SOS
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue; // standalone
    if (offset + 2 > buf.length) break;
    const len = buf.readUInt16BE(offset);
    if (len < 2 || offset + len > buf.length) break;

    if (marker === 0xe1) {
      orientation = parseExifOrientation(buf, offset - 2, len);
    }

    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof && offset + 7 < buf.length) {
      const rawH = buf.readUInt16BE(offset + 3);
      const rawW = buf.readUInt16BE(offset + 5);
      if (orientation >= 5 && orientation <= 8) {
        return { width: rawH, height: rawW };
      }
      return { width: rawW, height: rawH };
    }
    offset += len;
  }
  return null;
}

/**
 * Reads exact pixel dimensions, MIME type, and aspect ratio for an asset inside `public/`.
 * Safe to call in Server Components and `generateMetadata` at build time.
 */
export function getPublicImageMeta(publicSrc: string): PublicImageMeta | null {
  if (!publicSrc || !publicSrc.startsWith("/")) return null;
  if (cache.has(publicSrc)) return cache.get(publicSrc) ?? null;

  const fullPath = path.join(process.cwd(), "public", publicSrc.replace(/^\/+/, ""));
  if (!fs.existsSync(fullPath)) {
    cache.set(publicSrc, null);
    return null;
  }

  try {
    const buf = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    let dims: { width: number; height: number } | null = null;
    let type: PublicImageMeta["type"] | null = null;

    if (ext === ".png") {
      dims = parsePng(buf);
      type = "image/png";
    } else if (ext === ".webp") {
      dims = parseWebp(buf);
      type = "image/webp";
    } else if (ext === ".jpg" || ext === ".jpeg") {
      dims = parseJpeg(buf);
      type = "image/jpeg";
    }

    if (!dims || !type || dims.width <= 0 || dims.height <= 0) {
      cache.set(publicSrc, null);
      return null;
    }

    const meta: PublicImageMeta = {
      width: dims.width,
      height: dims.height,
      type,
      ratio: +(dims.width / dims.height).toFixed(3),
    };
    cache.set(publicSrc, meta);
    return meta;
  } catch {
    cache.set(publicSrc, null);
    return null;
  }
}

export function getPublicImageRatios(srcs: string[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const src of srcs) {
    const meta = getPublicImageMeta(src);
    if (meta) result[src] = meta.ratio;
  }
  return result;
}
