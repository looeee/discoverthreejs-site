export default function getMimetype( ext ) {

  ext = ext.replace( '.', '' );
  switch ( ext ) {
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'text/javascript';
    default:
      return 'text/plain';
  }
}
