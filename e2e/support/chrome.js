import { Builder, By } from 'selenium-webdriver';
import chromeSn from 'selenium-webdriver/chrome';
import { Command } from 'selenium-webdriver/lib/command';
import getBaseUrl from './getBaseUrl';
import { readFileSync } from 'fs';

const encodeExt = file => {
  const stream = readFileSync(file);
  return Buffer.from(stream).toString('base64');
}

async function chrome({ selenium, server, extension }, fn) {
  const options = new chromeSn.Options();
  let driver;

  options.addExtensions(encodeExt(extension));
  driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(selenium)
    .setChromeOptions(options)
    .build();

  const baseUrl = await getBaseUrl(driver, server.url);
  const homeUrl = baseUrl + 'index.html';
  await driver.get(homeUrl);
  
  return {
    baseUrl,
    homeUrl,
    driver,
    find: selector => driver.findElement(By.css(selector)),
    stop: (async () => driver.quit()),
  }
};

export default chrome;

