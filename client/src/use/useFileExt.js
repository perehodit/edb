export default function() {
  function getFileExt(path) {
    return /[.]/.exec(path) ? /[^.]+$/.exec(path)[0] : undefined;
  }

  return {
    getFileExt,
  };
}
