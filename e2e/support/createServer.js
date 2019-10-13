import http from 'http';

function createServer(port) {
  const server = http.createServer((req, res) => {
    const body = '<html><body><p>This page is just used to obtain root path</p></body></html>';
    const contentLength = body.length;
    res.writeHead(
      200,
      {
        'Content-Length': contentLength,
        'Content-Type': 'text/html',
      },
    );
    res.end(body);
  });

  return {
    url: `http://localhost:${port}/`,
    start: () => {
      console.log(`Server listening to port ${port}`);
      server.listen(port);
    },
    stop: () => {
      console.log('Server closing...');
      server.close();
    },
  };
}

export default createServer;
