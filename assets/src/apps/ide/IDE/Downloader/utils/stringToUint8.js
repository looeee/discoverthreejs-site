function stringToUint8(string) {
  const uint = new Uint8Array(string.length);
  for (let i = 0, j = string.length; i < j; ++i) {
    uint[i] = string.charCodeAt(i);
  }

  return uint;
}

export { stringToUint8 };
