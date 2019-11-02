/* eslint consistent-return: "off" */
import { it } from 'mocha';
import XtTester from './XtTester';
import createServer from './createServer';


function setup() {
  if (!global.server) {
    global.server = createServer(3939);
  }
  const xtester = new XtTester(global.server);

  function start() {
    this.timeout(10000);
    const promise = xtester.start();
    return promise;
  }

  function stop() {
    this.timeout(10000);
    const stopPromise = xtester.stop();
    return stopPromise;
  }

  function runIt(statement, fn) {
    return it(statement, xtester.run(fn));
  }

  return {
    start,
    stop,
    runIt,
  };
}

export default setup;
