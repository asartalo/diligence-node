async function doUntil(fn, waitTimeout = 5000, intervailTime = 100) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    let intervalId = setInterval(async () => {
      try {
        const timeFromStart = Date.now() - start;
        const result = fn();
        if (result && result.then && typeof result.then === "function") {
          result.then(trueResult => {
            if (timeFromStart > waitTimeout || trueResult) {
              clearInterval(intervalId);
              resolve(trueResult);
            }
          }).catch(e => {
            clearInterval(intervalId); 
            reject(e);
          });
        } else if (timeFromStart > waitTimeout || result) {
          clearInterval(intervalId);
          resolve(result);
        }

      } catch (e) {
        clearInterval(intervalId);
        reject(e);
      }
    }, 100);
  });
}

export default doUntil
