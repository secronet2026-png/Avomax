import app from '../edu_crm/backend/src/app.js';

export default function handler(req, res) {
  // If invoked via Vercel catch-all [...path]
  if (req.query && req.query.path) {
    const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    const urlParts = (req.url || '').split('?');
    const queryPart = urlParts[1] ? `?${urlParts[1]}` : '';
    req.url = `/api/${subpath.replace(/^\//, '')}${queryPart}`;
  } else if (!req.url || !req.url.startsWith('/api')) {
    // Ensure req.url starts with /api for Express router matching
    req.url = '/api' + (req.url?.startsWith('/') ? req.url : `/${req.url || ''}`);
  }

  return app(req, res);
}
