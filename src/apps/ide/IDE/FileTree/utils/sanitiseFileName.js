import { validateFileName } from './validateFileName.js';

function sanitiseFileName(name) {
  const sanitisedName = name
    .replace(/[^a-z0-9_.\/]/gi, '')
    .replace(/\/$/, '');

  if (!validateFileName(sanitisedName)) {
    return null;
  }
  return sanitisedName;
}

export { sanitiseFileName };
