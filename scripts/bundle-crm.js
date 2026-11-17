import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

const crmIndexHtmlPath = path.join(targetCrmDir, 'index.html');

if (fs.existsSync(crmIndexHtmlPath)) {
  console.log('✓ Successfully bundled CRM frontend into dist/client/crm/index.html');

  // Pre-create index.html copies in common CRM route subdirectories so Vercel serves them directly as static files
  const crmRoutes = [
    'login',
    'inquiries',
    'students',
    'admissions',
    'fees',
    'visa',
    'documents',
    'flights',
    'accommodation',
    'staff',
    'settings',
    'reports',
    'activity'
  ];

  const crmHtml = fs.readFileSync(crmIndexHtmlPath, 'utf8');

  for (const r of crmRoutes) {
    const routeDir = path.join(targetCrmDir, r);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), crmHtml, 'utf8');
    // Also write a copy as [route].html for cleanUrls compatibility
    fs.writeFileSync(path.join(targetCrmDir, `${r}.html`), crmHtml, 'utf8');
  }
  console.log(`✓ Pre-generated static SPA fallback files for ${crmRoutes.length} CRM routes`);
} else {
  console.warn('Warning: dist/client/crm/index.html was not found.');
}
