import http from 'http';

export function createServer(port) {
  const server = http.createServer(function (req, res) {
    const body = '<html><body><p>This page is just used to obtain root path</p></body></html>';
    const content_length = body.length;
    res.writeHead(
      200,
      {
        'Content-Length': content_length,
        'Content-Type': 'text/html'
      }
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

