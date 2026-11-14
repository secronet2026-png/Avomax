import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const crmDistDir = path.resolve(__dirname, '../edu_crm/frontend/dist');
const targetCrmDir = path.resolve(__dirname, '../dist/client/crm');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory does not exist: ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Packaging CRM frontend into website dist/client/crm ...');
copyDirRecursive(crmDistDir, targetCrmDir);

// Verify index.html exists
if (fs.existsSync(path.join(targetCrmDir, 'index.html'))) {
  console.log('✓ Successfully bundled CRM frontend into dist/client/crm/index.html');
} else {
  console.warn('Warning: dist/client/crm/index.html was not found.');
}
