'use strict';

/**
 * Copies SVG icon sprites next to the consuming app so `lz-icon` works after
 * `npm install` without a manual `angular.json` assets entry.
 * Never fails the install.
 */
const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function resolveDest(cwd) {
  const publicDir = path.join(cwd, 'public');
  const srcDir = path.join(cwd, 'src');
  const srcAssets = path.join(srcDir, 'assets');

  if (fs.existsSync(publicDir)) {
    return path.join(publicDir, 'assets', 'icons');
  }
  if (fs.existsSync(srcAssets) || fs.existsSync(srcDir)) {
    return path.join(srcAssets, 'icons');
  }
  return null;
}

try {
  const pkgRoot = path.resolve(__dirname, '..');
  const sprites = path.join(pkgRoot, 'assets', 'icons');
  if (!fs.existsSync(sprites)) {
    process.exit(0);
  }

  const cwd = path.resolve(process.env.INIT_CWD || process.cwd());
  if (cwd === pkgRoot) {
    process.exit(0);
  }

  // Skip the library workspace itself.
  const cwdPkg = path.join(cwd, 'package.json');
  if (fs.existsSync(cwdPkg)) {
    const name = JSON.parse(fs.readFileSync(cwdPkg, 'utf8')).name;
    if (name === '@laziar/components') {
      process.exit(0);
    }
  }

  const dest = resolveDest(cwd);
  if (!dest) {
    process.exit(0);
  }

  copyDir(sprites, dest);
} catch (err) {
  const message = err && err.message ? err.message : String(err);
  console.warn('@laziar/components: could not copy icon assets:', message);
}
