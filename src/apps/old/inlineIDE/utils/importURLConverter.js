// replace urls that start with ./ or ../ with abs url based on current dir
// leave all other urls unchanged
const importURLConverter = ( url, currentURL ) => {

  if ( url.indexOf( './' ) === 0 ) return url.replace( './', currentURL );

  if ( url.indexOf( '../' ) === 0 ) {

    const currentURLParts = currentURL.split( '/' ).filter( String );

    while ( url.indexOf( '../' ) === 0 ) {

      if ( currentURLParts.length === 0 ) return 'Error! referenced file outside system.';
      url = url.replace( '../', '' );

      currentURLParts.pop();

    }

    return ( currentURLParts.length ) ? currentURLParts.join( '/' ) + '/' + url : url;

  }

  return url;

};

export default importURLConverter;
