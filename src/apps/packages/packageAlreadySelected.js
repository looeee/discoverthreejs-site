const packageAlreadySelected = (selectedMessage) => {
  const selectedPackage = selectedMessage.textContent.toLowerCase();
  if (
    selectedPackage.includes('basic') ||
    selectedPackage.includes('full')
  )
    return true;
  return false;
};

export { packageAlreadySelected };
