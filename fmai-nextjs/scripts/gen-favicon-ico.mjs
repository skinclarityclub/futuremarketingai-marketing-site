// Regenerate src/app/favicon.ico from src/app/icon.svg so the .ico matches the
// 4-node logo mark (the SVG and the .ico are two separate favicon sources Next
// emits; both must match the brand logo). Dependency-free: sharp renders PNGs,
// we hand-assemble a multi-size PNG-in-ICO container.
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'

const SVG = 'src/app/icon.svg'
const OUT = 'src/app/favicon.ico'
const SIZES = [16, 32, 48]

const svg = readFileSync(SVG)

const pngs = await Promise.all(
  SIZES.map((size) =>
    sharp(svg, { density: 384 }).resize(size, size).png().toBuffer(),
  ),
)

// ICONDIR header (6 bytes) + N * ICONDIRENTRY (16 bytes each) + image data.
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type 1 = icon
header.writeUInt16LE(SIZES.length, 4) // image count

const entries = []
let offset = 6 + SIZES.length * 16
SIZES.forEach((size, i) => {
  const png = pngs[i]
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size >= 256 ? 0 : size, 0) // width (0 = 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
  entry.writeUInt8(0, 2) // palette count
  entry.writeUInt8(0, 3) // reserved
  entry.writeUInt16LE(1, 4) // color planes
  entry.writeUInt16LE(32, 6) // bits per pixel
  entry.writeUInt32LE(png.length, 8) // size of image data
  entry.writeUInt32LE(offset, 12) // offset to image data
  offset += png.length
  entries.push(entry)
})

const ico = Buffer.concat([header, ...entries, ...pngs])
writeFileSync(OUT, ico)
console.log(`wrote ${OUT} (${ico.length} bytes, sizes ${SIZES.join('/')})`)
