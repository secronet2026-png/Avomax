import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const clientDist = path.join(rootDir, 'dist', 'client');

// The SSR entry location varies by build environment/adapter, so search the known spots.
const serverCandidates = [
  'dist/server/server.js',
  'dist/server/index.js',
  'dist/server/server.mjs',
  'dist/server/index.mjs',
  'dist/ssr/server.js',
  'dist/ssr/index.js',
  '.output/server/index.mjs',
].map((p) => path.join(rootDir, p));

function listTree(dir, depth = 2, prefix = '') {
  if (!fs.existsSync(dir)) return `${prefix}(missing) ${path.relative(rootDir, dir)}\n`;
  let out = '';
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'assets' || entry.name === 'node_modules') continue;
    out += `${prefix}${entry.name}${entry.isDirectory() ? '/' : ''}\n`;
    if (entry.isDirectory() && depth > 1) out += listTree(path.join(dir, entry.name), depth - 1, prefix + '  ');
  }
  return out;
}

function findServerBundle() {
  const found = serverCandidates.find((p) => fs.existsSync(p));
  if (found) return found;
  // Fallback: any top-level .js/.mjs in dist/server or dist/ssr
  for (const dir of ['dist/server', 'dist/ssr'].map((d) => path.join(rootDir, d))) {
    if (!fs.existsSync(dir)) continue;
    const file = fs.readdirSync(dir).find((f) => /\.(m?js)$/.test(f));
    if (file) return path.join(dir, file);
  }
  return null;
}

const routes = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/medical',
  '/study-abroad',
  '/terms',
  '/privacy',
  '/refund',
  '/cookies',
  '/disclaimer'
];

async function prerenderAll() {
  const serverBundlePath = findServerBundle();
  if (!serverBundlePath) {
    console.error('Build output tree:\n' + listTree(path.join(rootDir, 'dist'), 3) + listTree(path.join(rootDir, '.output'), 2));
    throw new Error(`Server bundle not found. Looked in:\n  ${serverCandidates.join('\n  ')}`);
  }
  console.log(`Using server bundle: ${path.relative(rootDir, serverBundlePath)}`);

  console.log('Static prerendering routes via in-memory server entry...');
  const mod = await import(serverBundlePath);
  const server = mod.default?.default || mod.default;

  if (!server || typeof server.fetch !== 'function') {
    throw new Error('Server entry does not export a fetch function');
  }

  for (const route of routes) {
    try {
      const res = await server.fetch(new Request(`http://localhost${route}`));
      if (res.status !== 200) {
        console.warn(`Warning: Route ${route} returned status ${res.status}`);
        continue;
      }

      const html = await res.text();
      const targetDir = route === '/' ? clientDist : path.join(clientDist, route.slice(1));
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
      console.log(`✓ Prerendered ${route} -> ${path.relative(rootDir, path.join(targetDir, 'index.html'))}`);
    } catch (err) {
      console.error(`Error prerendering ${route}:`, err.message);
    }
  }

  console.log('✓ All static routes successfully prerendered into dist/client');
}

prerenderAll().catch((err) => {
  console.error('Prerender script failed:', err);
  process.exit(1);
});

