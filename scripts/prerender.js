import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const clientDist = path.join(rootDir, 'dist', 'client');
const serverBundlePath = path.join(rootDir, 'dist', 'server', 'server.js');

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
  if (!fs.existsSync(serverBundlePath)) {
    throw new Error(`Server bundle not found at ${serverBundlePath}`);
  }

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
