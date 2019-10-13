function e2eHelper() {
  const path = chrome.runtime.getURL('');
  const body = document.querySelector('body');
  const container = document.createElement('div');

  container.id = 'diligenceRootPath';
  container.setAttribute('style', 'display:none');
  container.textContent = path;
  body.appendChild(container);
}

e2eHelper();
