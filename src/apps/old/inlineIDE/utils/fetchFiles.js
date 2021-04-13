export default async function fetchFiles( dataset ) {

  const serverDirectory = dataset.serverDirectory;
  const fileURLS = dataset.files
    .replace( /\s+/g, '' )
    .split( ',' );

  const results = [];
  for ( const url of fileURLS ) {

    // allow for a little leeway on slashes added to the start or end of server dir
    const serverURL = ( '/' + serverDirectory + '/' + url ).replace( /\/\//g, '/' );
    results.push( fetch( serverURL ) );

  }

  const fetchedFiles = await Promise.all( results );

  const files = [];
  for ( const file of fetchedFiles ) files.push( file.text() );

  const filesText = await Promise.all( files );

  const processedFiles = {};

  for ( const [i, file] of fetchedFiles.entries() ) {

    const data = {

      url: fileURLS[i],
      type: fileURLS[i].split( '.' ).pop(),
      status: file.status,

    };

    if ( file.status === 200 ) {

      data.success = true;
      data.text = filesText[i];

    } else {

      data.success = false;
      data.text = `Failed to load file: ${fileURLS[i]}`;

    }

    processedFiles[ fileURLS[i] ] = data;

  }

  return processedFiles;

}
