import { expect } from 'chai';
import XtTester from './support/XtTester';

describe('Diligence smoke test', () => {
  let tester;

  before(() => {
    tester = new XtTester();
    return tester.start();
  });

  after(() => tester.stop());

  it('is actually loaded', () => tester.run(async ({ find }) => {
    const h1 = await find('h1');
    expect(await h1.getText()).to.contain('Diligence');
  }));
});
