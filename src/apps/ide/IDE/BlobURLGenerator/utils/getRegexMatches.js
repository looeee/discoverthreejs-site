function getRegexMatches(string, regex, index = 1) {
  const matches = [];
  let match;

  while ((match = regex.exec(string))) {
    matches.push(match[index]);
  }

  return matches;
}

export { getRegexMatches };
