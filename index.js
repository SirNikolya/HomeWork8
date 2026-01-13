const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const publicDir = path.join(__dirname, 'public');

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".mp4": "video/mp4",
};

async function sendFile(res, filePath, statusCode = 200) {
  try {
    const fullPath = path.join(publicDir, filePath);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    
    if (['.png', '.jpg', '.mp4'].includes(ext)) {

      const data = await fs.promises.readFile(fullPath);
      res.statusCode = statusCode;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');  
      res.end(data);
    } else {

      const data = await fs.promises.readFile(fullPath, 'utf8');
      res.statusCode = statusCode;
      res.setHeader('Content-Type', `${contentType}; charset=utf-8`);
      res.end(data);
    }
  } catch (error) {
    const file404 = '404.html';
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET') {
    return sendFile(res, '404.html', 405);
  }

  let filePath = '404.html';
  let statusCode = 404;

  if (req.url === '/') {
    filePath = 'index.html';
    statusCode = 200;
  } else if (req.url === '/rules') {
    filePath = 'rules.html';
    statusCode = 200;
  } else if (req.url === '/style.css') {
    filePath = 'style.css';
    statusCode = 200;
  } else if (req.url === '/video.mp4') {
    filePath = 'video.mp4';
    statusCode = 200;
  }

  await sendFile(res, filePath, statusCode);
});

server.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});