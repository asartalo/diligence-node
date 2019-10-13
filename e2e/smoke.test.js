import { expect } from 'chai';
import XtTester from './support/XtTester';

describe('Diligence smoke test', function() {
  this.timeout(10000); // 10 Second timeout

  let tester;
  
  before(() => {
    tester = new XtTester();
    return tester.start();
  });

  after(() => tester.stop());

  it('is actually loaded', () =>  {
    console.log("Running test");
    return tester.run(async ({ find }) => {
      const h1 = await find('h1');
      expect(await h1.getText()).to.contain('Diligence');
      console.log("Test is done");
    });
  });
});
