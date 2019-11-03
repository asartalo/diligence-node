/* global before after */
/*
 eslint mocha/no-top-level-hooks: "off", mocha/no-hooks-for-single-case: "off"
*/
import setup from './xtesterSetup';

const { start, stop } = setup();

before(start);

after(stop);
