import { Builder, By } from 'selenium-webdriver';
import firefoxSn from 'selenium-webdriver/firefox';
import { Command } from 'selenium-webdriver/lib/command';
import getBaseUrl from './getBaseUrl';

async function installWebExt(driver, extension) {
  const session = await driver.session_; // eslint-disable-line no-underscore-dangle
  const cmd = new Command('moz-install-web-ext')
    .setParameter('path', extension)
    .setParameter('sessionId', session.getId())
    .setParameter('temporary', true);

  const executor = driver.getExecutor();
  executor.defineCommand(cmd.getName(), 'POST', '/session/:sessionId/moz/addon/install');
  return executor.execute(cmd);
}

const options = new firefoxSn.Options()
  .setPreference('extensions.firebug.showChromeErrors', true);

async function firefox({ selenium, server, extension }) {
  const driver = await new Builder()
    .forBrowser('firefox')
    .usingServer(selenium)
    .setFirefoxOptions(options)
    .build();
  await installWebExt(driver, extension);
  const baseUrl = await getBaseUrl(driver, server.url);
  const homeUrl = `${baseUrl}index.html`;
  await driver.get(homeUrl);

  return {
    baseUrl,
    homeUrl,
    driver,
    find: selector => driver.findElement(By.css(selector)),
    reset: () => driver.get(homeUrl),
    stop: (() => driver.quit()),
  };
}

export default firefox;
