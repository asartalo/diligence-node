/* eslint no-await-in-loop: "off" */
import path from 'path';
import createServer from './createServer';
import firefox from './firefox';
import chrome from './chrome';
import { e2eXpi } from '../../src/tools/paths';

class XtTester {
  constructor() {
    this.server = createServer(3939);
    this.extension = path.resolve(e2eXpi);
    this.selenium = 'http://localhost:4444/wd/hub';
    this.browsers = [];
  }

  async start() {
    console.log('Starting x');
    this.server.start();
    const { selenium, server, extension } = this;
    await Promise.all([firefox, chrome].map(
      browserFn => browserFn({ selenium, server, extension }),
    ))
      .then(browsers => browsers.forEach(
        browser => this.browsers.push(browser),
      ));
    return 'DONE';
  }

  async stop() {
    console.log('Stopping everything');
    this.server.stop();
    return Promise.all(this.browsers.map(browser => browser.stop()));
  }

  static wrap(fn) {
    if (fn.length > 0) {
      return function (done) {
        this.timeout(10000);
        return fn(done);
      };
    }
    return function () {
      this.timeout(10000);
      return fn();
    };
  }

  run(fn) {
    return Promise.all(this.browsers.map(fn));
  }
}

export default XtTester;
