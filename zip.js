// Minimal dependency-free ZIP writer using the widely supported "stored" method.

const encoder = new TextEncoder();
const CRC_TABLE = new Uint32Array(256);

for (let index = 0; index < CRC_TABLE.length; index++) {
  let value = index;
  for (let bit = 0; bit < 8; bit++) {
    value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
  }
  CRC_TABLE[index] = value >>> 0;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function normalizedName(value) {
  const parts = String(value || '')
    .replace(/\\/g, '/')
    .replace(/\0/g, '')
    .split('/')
    .filter((part) => part && part !== '.' && part !== '..');
  return parts.join('/') || 'file';
}

function dosTimestamp(value) {
  const date = value instanceof Date && !Number.isNaN(value.getTime()) ? value : new Date();
  const year = Math.max(1980, Math.min(2107, date.getFullYear()));
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

function concat(parts, totalLength = parts.reduce((sum, part) => sum + part.length, 0)) {
  const output = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function set16(view, offset, value) {
  view.setUint16(offset, value, true);
}

function set32(view, offset, value) {
  view.setUint32(offset, value >>> 0, true);
}

export function buildStoredZip(entries, modifiedAt = new Date()) {
  if (!Array.isArray(entries) || entries.length > 0xffff) throw new Error('ZIP entry count is invalid.');

  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(normalizedName(entry?.name));
    const data = entry?.data instanceof Uint8Array
      ? entry.data
      : new Uint8Array(entry?.data || 0);
    if (nameBytes.length > 0xffff || data.length > 0xffffffff) throw new Error('ZIP entry is too large.');

    const crc = crc32(data);
    const stamp = dosTimestamp(entry?.modifiedAt || modifiedAt);
    const localHeader = new Uint8Array(30);
    const localView = new DataView(localHeader.buffer);
    set32(localView, 0, 0x04034b50);
    set16(localView, 4, 20);
    set16(localView, 6, 0x0800);
    set16(localView, 8, 0);
    set16(localView, 10, stamp.time);
    set16(localView, 12, stamp.date);
    set32(localView, 14, crc);
    set32(localView, 18, data.length);
    set32(localView, 22, data.length);
    set16(localView, 26, nameBytes.length);
    set16(localView, 28, 0);
    const localRecord = concat([localHeader, nameBytes, data]);
    localParts.push(localRecord);

    const centralHeader = new Uint8Array(46);
    const centralView = new DataView(centralHeader.buffer);
    set32(centralView, 0, 0x02014b50);
    set16(centralView, 4, 20);
    set16(centralView, 6, 20);
    set16(centralView, 8, 0x0800);
    set16(centralView, 10, 0);
    set16(centralView, 12, stamp.time);
    set16(centralView, 14, stamp.date);
    set32(centralView, 16, crc);
    set32(centralView, 20, data.length);
    set32(centralView, 24, data.length);
    set16(centralView, 28, nameBytes.length);
    set16(centralView, 30, 0);
    set16(centralView, 32, 0);
    set16(centralView, 34, 0);
    set16(centralView, 36, 0);
    set32(centralView, 38, 0);
    set32(centralView, 42, localOffset);
    centralParts.push(concat([centralHeader, nameBytes]));
    localOffset += localRecord.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  set32(endView, 0, 0x06054b50);
  set16(endView, 4, 0);
  set16(endView, 6, 0);
  set16(endView, 8, entries.length);
  set16(endView, 10, entries.length);
  set32(endView, 12, centralSize);
  set32(endView, 16, localOffset);
  set16(endView, 20, 0);

  return concat([...localParts, ...centralParts, end], localOffset + centralSize + end.length);
}
