function normalize(path) {
  if (path === '') {
    return '';
  }
  if (path.substr(-1) !== '/') {
    path += '/';
  }
  return path;
}

module.exports = { normalize };
