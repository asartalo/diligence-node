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

  let starts = 0;

  return {
    url: `http://localhost:${port}/`,
    start: () => {
      if (starts === 0) {
        console.log(`Server listening to port ${port}`);
        server.listen(port);
      }
      starts += 1;
    },
    stop: () => {
      starts -= 1;
      if (starts === 0) {
        console.log('Server closing...');
        server.close();
      }
    },
  };
}

export default createServer;
