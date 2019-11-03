import { Builder, By } from 'selenium-webdriver';
import chromeSn from 'selenium-webdriver/chrome';
import { readFileSync } from 'fs';
import getBaseUrl from './getBaseUrl';

const encodeExt = file => {
  const stream = readFileSync(file);
  return Buffer.from(stream).toString('base64');
};

async function chrome({ selenium, server, extension }) {
  const options = new chromeSn.Options();

  options.addExtensions(encodeExt(extension));
  const driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(selenium)
    .setChromeOptions(options)
    .build();

  const baseUrl = await getBaseUrl(driver, server.url);
  const homeUrl = `${baseUrl}index.html`;
  await driver.get(homeUrl);

  return {
    baseUrl,
    homeUrl,
    driver,
    find: selector => driver.findElement(By.css(selector)),
    reset: () => driver.get(homeUrl),
    stop: () => driver.quit(),
  };
}

export default chrome;
