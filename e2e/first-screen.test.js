import { expect } from 'chai';
import setup from './support/xtesterSetup';

const { reset, runIt } = setup();

describe('First screen', () => {
  before(reset);

  runIt('Shows greeting', async ({ find }) => {
    const h1 = await find('h1');
    expect(await h1.getText()).to.equal('Hello! This is Diligence.');
  });
});
