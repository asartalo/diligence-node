import { expect } from 'chai';
import setup from './support/xtesterSetup';

const { reset, runIt } = setup();

describe('Diligence smoke test', () => {
  before(reset);

  runIt('is actually loaded', async ({ find }) => {
    const h1 = await find('h1');
    expect(await h1.getText()).to.contain('Diligence');
  });
});
