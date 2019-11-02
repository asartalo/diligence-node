import { expect } from 'chai';
import setup from './support/xtesterSetup';

const { start, stop, runIt } = setup();

describe('First screen', () => {
  before(start);

  after(stop);

  runIt('Shows greeting', async ({ find }) => {
    const h1 = await find('h1');
    expect(await h1.getText()).to.equal('Hello! This is Diligence.');
  });
});
