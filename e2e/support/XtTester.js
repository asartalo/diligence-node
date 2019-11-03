import path from 'path';
import firefox from './firefox';
import chrome from './chrome';
import { e2eXpi } from '../../src/tools/paths';

class XtTester {
  constructor(server) {
    this.server = server;
    this.extension = path.resolve(e2eXpi);
    this.selenium = 'http://localhost:4444/wd/hub';
    this.browsers = [];
  }

  start() {
    const { selenium, server, extension } = this;
    server.start();
    return Promise.all([firefox, chrome].map(
      browserFn => browserFn({ selenium, server, extension }),
    ))
      .then(browsers => browsers.forEach(
        browser => this.browsers.push(browser),
      ))
      .then(() => console.log('started'));
  }

  stop() {
    this.server.stop();
    return Promise.all(this.browsers.map(browser => browser.stop()))
      .then(() => console.log('stopped'));
  }

  reset() {
    return Promise.all(this.browsers.map(browser => browser.reset()));
  }

  run(fn) {
    return () => Promise.all(this.browsers.map(fn));
  }
}

export default XtTester;
