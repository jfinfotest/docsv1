import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// Compresión gzip
app.use(compression());

// Servir archivos estáticos con cache
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: false,
  setHeaders: (res, path) => {
    // No cache para HTML
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
    // No cache para service worker
    if (path.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Manejar rutas SPA - todas las rutas devuelven index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Sirviendo archivos desde: ${path.join(__dirname, 'dist')}`);
});