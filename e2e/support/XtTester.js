import path from 'path';
import createServer from './createServer';
import firefox from './firefox';
import chrome from './chrome';

class XtTester {
  constructor() {
    this.server = createServer(3939);
    this.extension = path.resolve('/Users/wayne/Projects/Diligence/src/diligence/build/diligence.xpi');
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

  stop() {
    this.server.stop();
    return Promise.all(this.browsers.map(browser => browser.stop()));
  }

  run(fn) {
    return Promise.all(this.browsers.map(browser => fn(browser)));
  }
}

export default XtTester;
