import { By } from 'selenium-webdriver';

async function getBaseUrl(driver, sampleServerUrl) {
  await driver.get(sampleServerUrl);
  const pathElement = await driver.findElement(By.id('diligenceRootPath'));
  return pathElement.getAttribute('innerHTML');
}

export default getBaseUrl;
