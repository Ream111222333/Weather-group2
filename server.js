const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Set CORS headers to allow API calls
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Handle different routes
    if (req.url.startsWith('/source/page/')) {
        filePath = path.join(__dirname, req.url);
    } else if (req.url.startsWith('/source/')) {
        filePath = path.join(__dirname, req.url);
    } else if (req.url.startsWith('/assets/')) {
        filePath = path.join(__dirname, req.url);
    }

    const ext = path.extname(filePath);
    let contentType = 'text/html';

    switch (ext) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
        case '.svg':
            contentType = 'image/' + ext.slice(1);
            break;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your forecast page at: http://localhost:${PORT}/source/page/forecast.html`);
});