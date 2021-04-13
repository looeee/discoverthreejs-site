// https://github.com/atlemagnussen/es6-tree#readme
// Note: file has been modified
export default class EzTree {
  constructor( parentId, config, data ) {
    this.selectedId = null;
    this.parentId = parentId;
    this.parentEl = document.getElementById( parentId );
    if ( !this.parentEl ) {
      throw new Error( `Can't find element with id ${parentId}` );
    }
    this.parentEl.classList.add( 'es6-tree' );
    this.config = config || {};
    this.data = data;
    this.handleInternalSelect();
    this.append( this.parentEl, this.data );
  }

  append( p, data ) {
    data.forEach( ( n ) => {

      const d = document.createElement( 'details' );
      if ( n.expanded ) {
        d.open = true;
      }
      p.appendChild( d );
      const s = document.createElement( 'summary' );
      const span = document.createElement( 'span' );
      if ( n.id ) {
        s.id = n.id;
        span.id = n.id;
      }
      if ( n.href ) {
        const a = document.createElement( 'a' );
        a.innerText = n.name;
        a.id = n.id;
        a.setAttribute( 'href', n.href );
        span.appendChild( a );
      } else {
        span.innerText = n.name;
      }
      span.classList.add( 'node-text' );
      s.appendChild( span );
      this.handleType( n, span );
      d.appendChild( s );

      if ( n.children && Array.isArray( n.children ) && n.children.length > 0 ) {
        this.append( d, n.children );
        d.classList.add( 'branch' );
      } else {
        d.classList.add( 'leaf' );
      }
    } );
  }

  handleType( node, el ) {

    if ( node.type === 'folder' ) el.classList.add( 'folder' );
    else el.classList.add( 'file' );

    if ( node.type && this.config.classes ) {

      if ( this.config.classes[ node.type ] ) {

        const classes = this.config.classes[ node.type ].split( ' ' );
        el.classList.add( ...classes );

      }

    }

    if ( node.type && this.config.icons ) {

      if ( this.config.icons[ node.type ] ) {

        const icon = document.createElement( 'i' );
        const iconClasses = this.config.icons[ node.type ].split( ' ' );
        icon.classList.add( ...iconClasses );

        el.parentNode.insertBefore( icon, el );

      }

    }

  }

  on( eventName, fn, dontPreventDefault ) {
    switch ( eventName ) {
      case 'select': {
        this.parentEl.addEventListener( 'click', ( cev ) => {
          if ( [ 'SPAN', 'A', 'SUMMARY' ].includes( cev.target.nodeName ) && cev.target.id ) {
            const id = cev.target.id;
            const node = this.findNode( id );
            this.handleOpen( node );
            if ( !dontPreventDefault ) {
              cev.preventDefault();
            } else {
              cev.stopPropagation();
            }
            if ( node && node.id ) {
              fn( node );
            } else {
              fn( {
                id,
              } );
            }
          }
          if ( cev.target.nodeName === 'DETAILS' ) {
            cev.preventDefault();
          }
        } );
        break;
      }
      default:
        console.error( 'Not supported event' );
    }
  }

  select( id ) {
    this.handleSelect( id );
    this.open( id );
  }

  open( id ) {
    let node = document.getElementById( id );
    while ( node.parentNode.nodeName === 'DETAILS' ) {
      node = node.parentNode;
      node.setAttribute( 'open', '' );
    }
  }

  handleOpen( node ) {
    if ( !node.detailsOpenMustBeHandled ) {
      node.detailsOpenMustBeHandled = true;
      if ( node.id && node.children && Array.isArray( node.children ) ) {
        this.toggleOpen( node.id );
      }
    }
  }

  toggleOpen( id ) {
    const p = this.parentEl.querySelector( `summary#${id}` )
      .parentElement;
    if ( p ) p.open = !p.open;
  }

  handleInternalSelect() {
    this.parentEl.addEventListener( 'click', ( cev ) => {
      if ( [ 'SPAN', 'A', 'SUMMARY' ].includes( cev.target.nodeName ) && cev.target.id ) {
        const id = cev.target.id;
        const node = this.findNode( id );
        if ( node && node.id ) {
          this.handleSelect( node.id );
        } else {
          this.handleSelect( {
            id,
          } );
        }
      }
    } );
  }

  handleSelect( id ) {

    if ( !id ) {
      return;
    }

    const node = this.findNode( id );
    if ( node.children && node.detailsOpenMustBeHandled ) {
      this.toggleOpen( id );
    }

    if ( this.selectedId ) {
      if ( this.selectedId === id ) {
        return;
      }
      const currentSelectedEl = this.parentEl.querySelector( `span#${this.selectedId}` );
      if ( currentSelectedEl ) {
        this.unsetSelected( currentSelectedEl );
      }
    }
    this.selectedId = id;
    const selectedEl = this.parentEl.querySelector( `span#${id}` );
    this.setSelected( selectedEl );
  }

  setSelected( el ) {
    if ( el ) {
      el.setAttribute( 'selected', 'true' );
    }
  }

  unsetSelected( el ) {
    el.removeAttribute( 'selected' );
  }

  findNode( id ) {
    const itemPath = this.findPath( {
      children: this.data,
    }, id );

    if ( !itemPath ) {
      return false;
    }
    if ( !Array.isArray( itemPath ) || itemPath.length === 0 ) {
      return false;
    }

    const last = itemPath.pop();
    return last;
  }

  findPath( root, id ) {
    const found = [];

    if ( root.children && Array.isArray( root.children ) && root.children.length > 0 ) {
      const children = root.children;

      for ( let i = 0; i < children.length; i++ ) {
        const child = children[ i ];

        if ( child.id === id ) {
          found.push( child );
          return found;
        }
      }
      for ( let i = 0; i < children.length; i++ ) {
        const child = children[ i ];
        const grandChild = this.findPath( child, id );

        if ( grandChild && Array.isArray( grandChild ) && grandChild.length > 0 ) {
          found.push( child );
          found.push( ...grandChild );
          return found;
        }
      }
    }
    return null;
  }
}
