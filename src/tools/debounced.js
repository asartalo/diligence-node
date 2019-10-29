export default function debounced(fn, wait) {
  let debounceId;
  return (...args) => {
    clearTimeout(debounceId);
    return new Promise(resolve => {
      debounceId = setTimeout(() => {
        resolve(fn.apply(fn, args));
      }, wait);
    });
  };
}
