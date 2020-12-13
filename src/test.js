function getCommonDirectoryPath(pathes) {
  const sortedArray = pathes.sort();
  const first = sortedArray[0];
  const last = sortedArray.pop();
  let pattern = '';

  for (let i = 0; i < last.length; i += 1) {
    if (first[i] === last[i]) {
      pattern += first[i];
    } else {
      break;
    }
  }
  const indexCut = pattern.lastIndexOf('/') + 1;

  return pattern.slice(0, indexCut);
}

getCommonDirectoryPath(['/web/images/image1.png', '/web/images/image2.png']);
