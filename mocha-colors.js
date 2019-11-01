const { colors } = require('mocha/lib/reporters/base');

const overrides = {
  pass: 36,
  fast: 32,
  medium: 33,
  slow: 31,
  green: 32,
};

Object.entries(overrides).forEach(([key, color]) => {
  colors[key] = color;
});
