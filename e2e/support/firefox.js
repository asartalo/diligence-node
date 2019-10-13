import { Builder, By, Key } from 'selenium-webdriver';
import firefoxSn from 'selenium-webdriver/firefox';
import { Command } from 'selenium-webdriver/lib/command';
import getBaseUrl from './getBaseUrl';

async function installWebExt(driver, extension) {
  let session = await driver.session_;
  let cmd = new Command('moz-install-web-ext')
    .setParameter('path', extension)
    .setParameter('sessionId', session.getId())
    .setParameter('temporary', true);

  let executor = driver.getExecutor();
  executor.defineCommand(cmd.getName(), 'POST', '/session/:sessionId/moz/addon/install');
  return executor.execute(cmd);
}

const options = new firefoxSn.Options()
  .setPreference('extensions.firebug.showChromeErrors', true);

async function firefox({ selenium, server, extension }) {
  let driver;

  driver = await new Builder()
    .forBrowser('firefox')
    .usingServer(selenium)
    .setFirefoxOptions(options)
    .build();
  await installWebExt(driver, extension);
  const baseUrl = await getBaseUrl(driver, server.url);
  const homeUrl = baseUrl + 'index.html';
  await driver.get(homeUrl);

  return {
    baseUrl,
    homeUrl,
    driver,
    find: selector => driver.findElement(By.css(selector)),
    stop: (async () => driver.quit()),
  };
};

export default firefox;
