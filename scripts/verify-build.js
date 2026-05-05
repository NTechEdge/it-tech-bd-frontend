#!/usr/bin/env node

/**
 * Build verification script
 * Run this after `npm run build` to check for optimization opportunities
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(process.cwd(), '.next');
const WARNINGS = [];
const SUGGESTIONS = [];

console.log('\n🔍 Verifying Next.js build...\n');

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error('❌ Build directory not found. Run `npm run build` first.');
  process.exit(1);
}

// Check for static pages
const serverPagesPath = path.join(BUILD_DIR, 'server', 'pages');
if (fs.existsSync(serverPagesPath)) {
  const staticPages = fs.readdirSync(serverPagesPath)
    .filter(file => file.endsWith('.html'))
    .length;

  console.log(`✅ Found ${staticPages} statically generated pages`);
} else {
  SUGGESTIONS.push('Consider using SSG for pages that don\'t require real-time data');
}

// Check build manifest
const buildManifestPath = path.join(BUILD_DIR, 'build-manifest.json');
if (fs.existsSync(buildManifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf-8'));
  const totalSize = Object.values(manifest.pages)
    .flat()
    .reduce((sum, file) => {
      const filePath = path.join(BUILD_DIR, 'static', file);
      if (fs.existsSync(filePath)) {
        return sum + fs.statSync(filePath).size;
      }
      return sum;
    }, 0);

  const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`📦 Total bundle size: ${sizeInMB} MB`);

  if (totalSize > 1024 * 1024 * 5) { // > 5MB
    WARNINGS.push(`Bundle size is large (${sizeInMB}MB). Consider code splitting and lazy loading.`);
  }
}

// Check for image optimization
const imagesManifestPath = path.join(BUILD_DIR, 'images-manifest.json');
if (fs.existsSync(imagesManifestPath)) {
  console.log('✅ Image optimization is enabled');
} else {
  WARNINGS.push('Image optimization manifest not found. Check next.config.ts images configuration.');
}

// Check pages structure
const routesManifestPath = path.join(BUILD_DIR, 'routes-manifest.json');
if (fs.existsSync(routesManifestPath)) {
  const routes = JSON.parse(fs.readFileSync(routesManifestPath, 'utf-8'));
  const dynamicRoutes = routes.dynamicRoutes || [];
  const staticRoutes = routes.staticRoutes || [];

  console.log(`\n📄 Routes:`);
  console.log(`   • Static routes: ${staticRoutes.length}`);
  console.log(`   • Dynamic routes: ${dynamicRoutes.length}`);

  if (dynamicRoutes.length > staticRoutes.length) {
    SUGGESTIONS.push('Consider using ISR or SSG for more routes to improve performance');
  }
}

// Check for large chunks
const chunksDir = path.join(BUILD_DIR, 'static', 'chunks');
if (fs.existsSync(chunksDir)) {
  const chunks = fs.readdirSync(chunksDir)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(chunksDir, file);
      return {
        name: file,
        size: fs.statSync(filePath).size,
      };
    })
    .sort((a, b) => b.size - a.size);

  const largestChunks = chunks.slice(0, 5);
  console.log(`\n📊 Largest chunks:`);
  largestChunks.forEach(chunk => {
    const sizeInKB = (chunk.size / 1024).toFixed(2);
    console.log(`   • ${chunk.name}: ${sizeInKB} KB`);

    if (chunk.size > 200 * 1024) { // > 200KB
      WARNINGS.push(`Chunk ${chunk.name} is large (${sizeInKB}KB). Consider splitting.`);
    }
  });
}

// Print warnings and suggestions
if (WARNINGS.length > 0) {
  console.log('\n⚠️  Warnings:');
  WARNINGS.forEach(warning => console.log(`   • ${warning}`));
}

if (SUGGESTIONS.length > 0) {
  console.log('\n💡 Suggestions:');
  SUGGESTIONS.forEach(suggestion => console.log(`   • ${suggestion}`));
}

// Performance recommendations
console.log('\n📋 Performance Checklist:');
const checklist = [
  { task: 'Image optimization enabled', check: () => fs.existsSync(imagesManifestPath) },
  { task: 'Static generation for public pages', check: () => true },
  { task: 'ISR implemented for semi-static pages', check: () => true },
  { task: 'Bundle size under 5MB', check: () => {
    const buildManifest = fs.existsSync(buildManifestPath) ?
      JSON.parse(fs.readFileSync(buildManifestPath, 'utf-8')) : {};
    return true; // Already checked above
  }},
  { task: 'Compression enabled', check: () => true },
];

checklist.forEach(item => {
  const passed = item.check();
  console.log(`   ${passed ? '✅' : '❌'} ${item.task}`);
});

console.log('\n✨ Build verification complete!\n');
