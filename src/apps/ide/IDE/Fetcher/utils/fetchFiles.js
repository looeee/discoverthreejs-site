async function fetchFiles(urls, as = 'text', serverDirectory) {
  const filePromises = [];

  for (const url of urls) {
    const serverURL = url.replace(/assets\//g, serverDirectory);

    filePromises.push(fetch(serverURL));
  }

  const responses = await Promise.all(filePromises);
  return await Promise.all(
    responses.map((response) => {
      switch (as) {
        case 'text':
          return response.text();
        case 'blob':
          return response.blob();
      }
    }),
  );
}

export { fetchFiles };
