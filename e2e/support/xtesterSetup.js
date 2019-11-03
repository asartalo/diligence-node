/* eslint consistent-return: "off" */
import { it } from 'mocha';
import XtTester from './XtTester';
import createServer from './createServer';

function setup() {
  if (!global.server) {
    global.server = createServer(3939);
  }

  if (!global.xtester) {
    global.xtester = new XtTester(global.server);
  }
  const { xtester } = global;

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

  function reset() {
    this.timeout(10000);
    xtester.reset();
  }

  function runIt(statement, fn) {
    return it(statement, xtester.run(fn));
  }

  return {
    reset,
    runIt,
    start,
    stop,
  };
}

export default setup;
