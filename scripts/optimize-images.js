#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * Automatically optimizes images in the assets directory:
 * - Converts to WebP and AVIF
 * - Generates responsive sizes
 * - Compresses while maintaining quality
 * 
 * Usage:
 *   npm run optimize:images
 *   npm run optimize:images -- --input=path/to/image.jpg
 */

import { readdir, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, basename, extname, dirname } from 'path'
import sharp from 'sharp'

// Configuration
const CONFIG = {
  inputDir: 'public/assets/images/original',
  outputDir: 'public/assets/images/optimized',
  sizes: [400, 800, 1200, 1600],
  formats: ['webp', 'avif', 'jpeg'],
  quality: {
    webp: 85,
    avif: 80,
    jpeg: 85,
  },
  maxFileSize: 200 * 1024, // 200KB warning threshold
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
    log(`📁 Created directory: ${dir}`, colors.blue)
  }
}

async function getFileSize(path) {
  const stats = await sharp(path).stats()
  return stats.size
}

async function optimizeImage(inputPath) {
  const filename = basename(inputPath, extname(inputPath))
  const outputDir = join(CONFIG.outputDir, filename)
  
  await ensureDir(outputDir)
  
  log(`\n🖼️  Processing: ${basename(inputPath)}`, colors.bright)
  
  // Get original image metadata
  const metadata = await sharp(inputPath).metadata()
  log(`   Original: ${metadata.width}x${metadata.height}, ${(metadata.size / 1024).toFixed(0)}KB`)
  
  const results = []
  
  // Generate responsive sizes for each format
  for (const format of CONFIG.formats) {
    for (const size of CONFIG.sizes) {
      // Skip if size is larger than original
      if (size > metadata.width) continue
      
      const outputPath = join(outputDir, `${filename}-${size}w.${format}`)
      
      try {
        await sharp(inputPath)
          .resize(size, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          [format]({ quality: CONFIG.quality[format] })
          .toFile(outputPath)
        
        const stats = await sharp(outputPath).metadata()
        const fileSize = stats.size
        const compression = ((1 - fileSize / metadata.size) * 100).toFixed(0)
        
        // Warn if file is too large
        const sizeWarning = fileSize > CONFIG.maxFileSize ? ' ⚠️ ' : ''
        
        results.push({
          format,
          size,
          fileSize,
          compression,
          path: outputPath,
        })
        
        log(
          `   ✓ ${format.toUpperCase()} ${size}w: ${(fileSize / 1024).toFixed(0)}KB (${compression}% smaller)${sizeWarning}`,
          fileSize > CONFIG.maxFileSize ? colors.yellow : colors.green
        )
      } catch (error) {
        log(`   ✗ Failed to generate ${format} ${size}w: ${error.message}`, colors.red)
      }
    }
  }
  
  // Summary
  const totalOriginal = metadata.size * results.length
  const totalOptimized = results.reduce((sum, r) => sum + r.fileSize, 0)
  const totalSaved = totalOriginal - totalOptimized
  const totalSavedPercent = ((totalSaved / totalOriginal) * 100).toFixed(0)
  
  log(`\n📊 Summary:`, colors.bright)
  log(`   Generated: ${results.length} files`)
  log(`   Total saved: ${(totalSaved / 1024).toFixed(0)}KB (${totalSavedPercent}%)`, colors.green)
  
  // Generate usage example
  log(`\n📝 Usage example:`, colors.blue)
  console.log(`
<picture>
  <source
    type="image/avif"
    srcSet="${results
      .filter((r) => r.format === 'avif')
      .map((r) => `${r.path} ${r.size}w`)
      .join(',\n      ')}"
    sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
  />
  <source
    type="image/webp"
    srcSet="${results
      .filter((r) => r.format === 'webp')
      .map((r) => `${r.path} ${r.size}w`)
      .join(',\n      ')}"
    sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
  />
  <img
    src="${results.find((r) => r.format === 'jpeg' && r.size === 800)?.path}"
    srcSet="${results
      .filter((r) => r.format === 'jpeg')
      .map((r) => `${r.path} ${r.size}w`)
      .join(',\n      ')}"
    alt="Description"
    loading="lazy"
    width="${metadata.width}"
    height="${metadata.height}"
  />
</picture>
  `)
}

async function processAllImages() {
  log('\n🚀 Starting image optimization...', colors.bright)
  
  // Ensure directories exist
  await ensureDir(CONFIG.inputDir)
  await ensureDir(CONFIG.outputDir)
  
  // Get all images from input directory
  const files = await readdir(CONFIG.inputDir)
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png)$/i.test(file)
  )
  
  if (imageFiles.length === 0) {
    log(`\n❌ No images found in ${CONFIG.inputDir}`, colors.red)
    log(`\n💡 Add images to ${CONFIG.inputDir} and run again`, colors.blue)
    return
  }
  
  log(`\nFound ${imageFiles.length} image(s) to process\n`)
  
  for (const file of imageFiles) {
    await optimizeImage(join(CONFIG.inputDir, file))
  }
  
  log(`\n✨ All images optimized!`, colors.green)
}

// Parse command line arguments
const args = process.argv.slice(2)
const inputArg = args.find((arg) => arg.startsWith('--input='))
const inputPath = inputArg?.split('=')[1]

if (inputPath) {
  // Optimize single image
  optimizeImage(inputPath).catch((error) => {
    log(`\n❌ Error: ${error.message}`, colors.red)
    process.exit(1)
  })
} else {
  // Optimize all images in directory
  processAllImages().catch((error) => {
    log(`\n❌ Error: ${error.message}`, colors.red)
    process.exit(1)
  })
}

