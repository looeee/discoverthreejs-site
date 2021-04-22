/*!
 * Optiscroll.js v3.2.1
 * https://github.com/albertogasparin/Optiscroll/
 *
 * @copyright 2018 Alberto Gasparin
 * @license Released under MIT LICENSE
 */

/**
 * Optiscroll, use this to create instances
 * ```
 * var scrolltime = new Optiscroll(element);
 * ```
 */
export default function Optiscroll( element, options ) {
  return new Optiscroll.Instance( element, options || {} );
};

const GS = Optiscroll.globalSettings = {
  scrollMinUpdateInterval: 1000 / 40, // 40 FPS
  checkFrequency: 1000,
  pauseCheck: false,
};

Optiscroll.defaults = {
  preventParentScroll: false,
  forceScrollbars: false,
  scrollStopDelay: 300,
  maxTrackSize: 95,
  minTrackSize: 5,
  draggableTracks: true,
  autoUpdate: true,
  classPrefix: 'optiscroll-',
  wrapContent: true,
  rtl: false,
};

Optiscroll.Instance = function( element, options ) {
  // instance variables
  this.element = element;
  this.settings = _extend( _extend( {}, Optiscroll.defaults ), options || {} );
  if ( typeof options.rtl !== 'boolean' ) {
    this.settings.rtl = window.getComputedStyle( element )
      .direction === 'rtl';
  }
  this.cache = {};

  this.init();
};

Optiscroll.Instance.prototype = {

  init() {
    const element = this.element;
    let settings = this.settings;
    let shouldCreateScrollbars = false;

    const scrollEl = this.scrollEl = settings.wrapContent ?
      Utils.createWrapper( element ) :
      element.firstElementChild;

    toggleClass( scrollEl, settings.classPrefix + 'content', true );
    toggleClass( element, 'is-enabled' + ( settings.rtl ? ' is-rtl' : '' ), true );

    // initialize scrollbars
    this.scrollbars = {
      v: Scrollbar( 'v', this ),
      h: Scrollbar( 'h', this ),
    };

    // create DOM scrollbars only if they have size or if it's forced
    if ( G.scrollbarSpec.width || settings.forceScrollbars ) {
      shouldCreateScrollbars = Utils.hideNativeScrollbars( scrollEl, settings.rtl );
    }

    if ( shouldCreateScrollbars ) {
      _invoke( this.scrollbars, 'create' );
    }

    if ( G.isTouch && settings.preventParentScroll ) {
      toggleClass( element, settings.classPrefix + 'prevent', true );
    }

    // calculate scrollbars
    this.update();

    // bind container events
    this.bind();

    // add instance to global array for timed check
    if ( settings.autoUpdate ) {
      G.instances.push( this );
    }

    // start the timed check if it is not already running
    if ( settings.autoUpdate && !G.checkTimer ) {
      Utils.checkLoop();
    }

  },

  bind() {
    const listeners = this.listeners = {};
    let scrollEl = this.scrollEl;

    // scroll event binding
    listeners.scroll = _throttle( Events.scroll.bind( this ), GS.scrollMinUpdateInterval );

    if ( G.isTouch ) {
      listeners.touchstart = Events.touchstart.bind( this );
      listeners.touchend = Events.touchend.bind( this );
    }

    // Safari does not support wheel event
    listeners.mousewheel = listeners.wheel = Events.wheel.bind( this );

    for ( const ev in listeners ) {
      scrollEl.addEventListener( ev, listeners[ ev ], G.passiveEvent );
    }

  },

  update() {
    const scrollEl = this.scrollEl;
    let cache = this.cache;
    let oldcH = cache.clientH;
    let sH = scrollEl.scrollHeight;
    let cH = scrollEl.clientHeight;
    let sW = scrollEl.scrollWidth;
    let cW = scrollEl.clientWidth;

    if ( sH !== cache.scrollH || cH !== cache.clientH ||
      sW !== cache.scrollW || cW !== cache.clientW ) {

      cache.scrollH = sH;
      cache.clientH = cH;
      cache.scrollW = sW;
      cache.clientW = cW;

      // only fire if cache was defined
      if ( oldcH !== undefined ) {

        // if the element is no more in the DOM
        if ( sH === 0 && cH === 0 && !document.body.contains( this.element ) ) {
          this.destroy();
          return false;
        }

        this.fireCustomEvent( 'sizechange' );
      }

      // this will update the scrollbar
      // and check if bottom is reached
      _invoke( this.scrollbars, 'update' );
    }
  },

  /**
   * Animate scrollTo
   */
  scrollTo( destX, destY, duration ) {
    const cache = this.cache;
    let startX;
    let startY;
    let endX;
    let endY;

    G.pauseCheck = true;
    // force update
    this.update();

    startX = this.scrollEl.scrollLeft;
    startY = this.scrollEl.scrollTop;

    endX = +destX;
    if ( destX === 'left' ) {
      endX = 0;
    }
    if ( destX === 'right' ) {
      endX = cache.scrollW - cache.clientW;
    }
    if ( destX === false ) {
      endX = startX;
    }

    endY = +destY;
    if ( destY === 'top' ) {
      endY = 0;
    }
    if ( destY === 'bottom' ) {
      endY = cache.scrollH - cache.clientH;
    }
    if ( destY === false ) {
      endY = startY;
    }

    // animate
    this.animateScroll( startX, endX, startY, endY, +duration );

  },

  scrollIntoView( elem, duration, delta ) {
    const scrollEl = this.scrollEl;
    let eDim;
    let sDim;
    let leftEdge;
    let topEdge;
    let rightEdge;
    let bottomEdge;
    let offsetX;
    let offsetY;
    let startX;
    let startY;
    let endX;
    let endY;

    G.pauseCheck = true;
    // force update
    this.update();

    if ( typeof elem === 'string' ) { // selector
      elem = scrollEl.querySelector( elem );
    } else if ( elem.length && elem.jquery ) { // jquery element
      elem = elem[ 0 ];
    }

    if ( typeof delta === 'number' ) { // same delta for all
      delta = {
        top: delta,
        right: delta,
        bottom: delta,
        left: delta,
      };
    }

    delta = delta || {};
    eDim = elem.getBoundingClientRect();
    sDim = scrollEl.getBoundingClientRect();

    startX = endX = scrollEl.scrollLeft;
    startY = endY = scrollEl.scrollTop;
    offsetX = startX + eDim.left - sDim.left;
    offsetY = startY + eDim.top - sDim.top;

    leftEdge = offsetX - ( delta.left || 0 );
    topEdge = offsetY - ( delta.top || 0 );
    rightEdge = offsetX + eDim.width - this.cache.clientW + ( delta.right || 0 );
    bottomEdge = offsetY + eDim.height - this.cache.clientH + ( delta.bottom || 0 );

    if ( leftEdge < startX ) {
      endX = leftEdge;
    }
    if ( rightEdge > startX ) {
      endX = rightEdge;
    }

    if ( topEdge < startY ) {
      endY = topEdge;
    }
    if ( bottomEdge > startY ) {
      endY = bottomEdge;
    }

    // animate
    this.animateScroll( startX, endX, startY, endY, +duration );
  },

  animateScroll( startX, endX, startY, endY, duration ) {
    const self = this;
    let scrollEl = this.scrollEl;
    let startTime = Date.now();

    if ( endX === startX && endY === startY ) {
      return;
    }

    if ( duration === 0 ) {
      scrollEl.scrollLeft = endX;
      scrollEl.scrollTop = endY;
      return;
    }

    if ( isNaN( duration ) ) { // undefined or auto
      // 500px in 430ms, 1000px in 625ms, 2000px in 910ms
      duration = Math.pow( Math.max( Math.abs( endX - startX ), Math.abs( endY - startY ) ), 0.54 ) * 15;
    }

    ( function animate() {
      const time = Math.min( 1, ( ( Date.now() - startTime ) / duration ) );
      let easedTime = Utils.easingFunction( time );

      if ( endY !== startY ) {
        scrollEl.scrollTop = ~~( easedTime * ( endY - startY ) ) + startY;
      }
      if ( endX !== startX ) {
        scrollEl.scrollLeft = ~~( easedTime * ( endX - startX ) ) + startX;
      }

      self.scrollAnimation = time < 1 ? window.requestAnimationFrame( animate ) : null;
    }() );
  },

  destroy() {
    const self = this;
    let element = this.element;
    let scrollEl = this.scrollEl;
    let listeners = this.listeners;
    let child;

    if ( !this.scrollEl ) {
      return;
    }

    // unbind events
    for ( const ev in listeners ) {
      scrollEl.removeEventListener( ev, listeners[ ev ] );
    }

    // remove scrollbars elements
    _invoke( this.scrollbars, 'remove' );

    // unwrap content
    if ( this.settings.wrapContent ) {
      while ( child = scrollEl.childNodes[ 0 ] ) {
        element.insertBefore( child, scrollEl );
      }
      element.removeChild( scrollEl );
      this.scrollEl = null;
    }

    // remove classes
    toggleClass( element, this.settings.classPrefix + 'prevent', false );
    toggleClass( element, 'is-enabled', false );

    // defer instance removal from global array
    // to not affect checkLoop _invoke
    window.requestAnimationFrame( () => {
      let index = G.instances.indexOf( self );
      if ( index > -1 ) {
        G.instances.splice( index, 1 );
      }
    } );
  },

  fireCustomEvent( eventName ) {
    const cache = this.cache;
    let sH = cache.scrollH;
    let sW = cache.scrollW;
    let eventData;

    eventData = {
      // scrollbars data
      scrollbarV: _extend( {}, cache.v ),
      scrollbarH: _extend( {}, cache.h ),

      // scroll position
      scrollTop: cache.v.position * sH,
      scrollLeft: cache.h.position * sW,
      scrollBottom: ( 1 - cache.v.position - cache.v.size ) * sH,
      scrollRight: ( 1 - cache.h.position - cache.h.size ) * sW,

      // element size
      scrollWidth: sW,
      scrollHeight: sH,
      clientWidth: cache.clientW,
      clientHeight: cache.clientH,
    };

    let event;
    if ( typeof CustomEvent === 'function' ) {
      event = new CustomEvent( eventName, {
        detail: eventData
      } );
    } else { // IE does not support CustomEvent
      event = document.createEvent( 'CustomEvent' );
      event.initCustomEvent( eventName, false, false, eventData );
    }
    this.element.dispatchEvent( event );
  },

};

var Events = {

  scroll( ev ) {

    if ( !G.pauseCheck ) {
      this.fireCustomEvent( 'scrollstart' );
    }
    G.pauseCheck = true;

    this.scrollbars.v.update();
    this.scrollbars.h.update();

    this.fireCustomEvent( 'scroll' );

    clearTimeout( this.cache.timerStop );
    this.cache.timerStop = setTimeout( Events.scrollStop.bind( this ), this.settings.scrollStopDelay );
  },

  touchstart( ev ) {
    G.pauseCheck = false;
    this.scrollbars.v.update();
    this.scrollbars.h.update();

    Events.wheel.call( this, ev );
  },

  touchend( ev ) {
    // prevents touchmove generate scroll event to call
    // scrollstop  while the page is still momentum scrolling
    clearTimeout( this.cache.timerStop );
  },

  scrollStop() {
    this.fireCustomEvent( 'scrollstop' );
    G.pauseCheck = false;
  },

  wheel( ev ) {
    const cache = this.cache;
    let cacheV = cache.v;
    let cacheH = cache.h;
    let preventScroll = this.settings.preventParentScroll && G.isTouch;

    window.cancelAnimationFrame( this.scrollAnimation );

    if ( preventScroll && cacheV.enabled && cacheV.percent % 100 === 0 ) {
      this.scrollEl.scrollTop = cacheV.percent ? ( cache.scrollH - cache.clientH - 1 ) : 1;
    }
    if ( preventScroll && cacheH.enabled && cacheH.percent % 100 === 0 ) {
      this.scrollEl.scrollLeft = cacheH.percent ? ( cache.scrollW - cache.clientW - 1 ) : 1;
    }
  },

};

var Scrollbar = function( which, instance ) {

  const isVertical = ( which === 'v' );
  const parentEl = instance.element;
  const scrollEl = instance.scrollEl;
  const settings = instance.settings;
  const cache = instance.cache;
  let scrollbarCache = cache[ which ] = {};

  const sizeProp = isVertical ? 'H' : 'W';
  const clientSize = 'client' + sizeProp;
  const scrollSize = 'scroll' + sizeProp;
  const scrollProp = isVertical ? 'scrollTop' : 'scrollLeft';
  const evSuffixes = isVertical ? [ 'top', 'bottom' ] : [ 'left', 'right' ];
  const evTypesMatcher = /^(mouse|touch|pointer)/;

  const rtlMode = G.scrollbarSpec.rtl;
  let enabled = false;
  let scrollbarEl = null;
  let trackEl = null;

  var events = {
    dragData: null,

    dragStart( ev ) {
      ev.preventDefault();
      const evData = ev.touches ? ev.touches[ 0 ] : ev;
      events.dragData = {
        x: evData.pageX,
        y: evData.pageY,
        scroll: scrollEl[ scrollProp ]
      };
      events.bind( true, ev.type.match( evTypesMatcher )[ 1 ] );
    },

    dragMove( ev ) {
      const evData = ev.touches ? ev.touches[ 0 ] : ev;
      let dragMode = settings.rtl && rtlMode === 1 && !isVertical ? -1 : 1;
      let delta;
      let deltaRatio;

      ev.preventDefault();
      delta = isVertical ? evData.pageY - events.dragData.y : evData.pageX - events.dragData.x;
      deltaRatio = delta / cache[ clientSize ];

      scrollEl[ scrollProp ] = events.dragData.scroll + deltaRatio * cache[ scrollSize ] * dragMode;
    },

    dragEnd( ev ) {
      events.dragData = null;
      events.bind( false, ev.type.match( evTypesMatcher )[ 1 ] );
    },

    bind( on, type ) {
      const method = ( on ? 'add' : 'remove' ) + 'EventListener';
      let moveEv = type + 'move';
      let upEv = type + ( type === 'touch' ? 'end' : 'up' );

      document[ method ]( moveEv, events.dragMove );
      document[ method ]( upEv, events.dragEnd );
      document[ method ]( type + 'cancel', events.dragEnd );
    },

  };

  return {

    toggle( bool ) {
      enabled = bool;

      if ( trackEl ) {
        toggleClass( parentEl, 'has-' + which + 'track', enabled );
      }

      // expose enabled
      scrollbarCache.enabled = enabled;
    },

    create() {
      scrollbarEl = document.createElement( 'div' );
      trackEl = document.createElement( 'b' );

      scrollbarEl.className = settings.classPrefix + which;
      trackEl.className = settings.classPrefix + which + 'track';
      scrollbarEl.appendChild( trackEl );
      parentEl.appendChild( scrollbarEl );

      if ( settings.draggableTracks ) {
        const evTypes = window.PointerEvent ? [ 'pointerdown' ] : [ 'touchstart', 'mousedown' ];
        evTypes.forEach( ( evType ) => {
          trackEl.addEventListener( evType, events.dragStart );
        } );
      }
    },

    update() {
      let newSize;
      let oldSize;
      let newDim;
      let newRelPos;
      let deltaPos;

      // if scrollbar is disabled and no scroll
      if ( !enabled && cache[ clientSize ] === cache[ scrollSize ] ) {
        return;
      }

      newDim = this.calc();
      newSize = newDim.size;
      oldSize = scrollbarCache.size;
      newRelPos = ( 1 / newSize ) * newDim.position * 100;
      deltaPos = Math.abs( newDim.position - ( scrollbarCache.position || 0 ) ) * cache[ clientSize ];

      if ( newSize === 1 && enabled ) {
        this.toggle( false );
      }

      if ( newSize < 1 && !enabled ) {
        this.toggle( true );
      }

      if ( trackEl && enabled ) {
        this.style( newRelPos, deltaPos, newSize, oldSize );
      }

      // update cache values
      scrollbarCache = _extend( scrollbarCache, newDim );

      if ( enabled ) {
        this.fireEdgeEv();
      }

    },

    style( newRelPos, deltaPos, newSize, oldSize ) {
      if ( newSize !== oldSize ) {
        trackEl.style[ isVertical ? 'height' : 'width' ] = newSize * 100 + '%';
        if ( settings.rtl && !isVertical ) {
          trackEl.style.marginRight = ( 1 - newSize ) * 100 + '%';
        }
      }
      trackEl.style[ G.cssTransform ] = 'translate(' +
        ( isVertical ? '0%,' + newRelPos + '%' : newRelPos + '%' + ',0%' ) +
        ')';
    },

    calc() {
      let position = scrollEl[ scrollProp ];
      let viewS = cache[ clientSize ];
      let scrollS = cache[ scrollSize ];
      let sizeRatio = viewS / scrollS;
      let sizeDiff = scrollS - viewS;
      let positionRatio;
      let percent;

      if ( sizeRatio >= 1 || !scrollS ) { // no scrollbars needed
        return {
          position: 0,
          size: 1,
          percent: 0
        };
      }
      if ( !isVertical && settings.rtl && rtlMode ) {
        position = sizeDiff - position * rtlMode;
      }

      percent = 100 * position / sizeDiff;

      // prevent overscroll effetcs (negative percent)
      // and keep 1px tolerance near the edges
      if ( position <= 1 ) {
        percent = 0;
      }
      if ( position >= sizeDiff - 1 ) {
        percent = 100;
      }

      // Capped size based on min/max track percentage
      sizeRatio = Math.max( sizeRatio, settings.minTrackSize / 100 );
      sizeRatio = Math.min( sizeRatio, settings.maxTrackSize / 100 );

      positionRatio = ( 1 - sizeRatio ) * ( percent / 100 );

      return {
        position: positionRatio,
        size: sizeRatio,
        percent
      };
    },

    fireEdgeEv() {
      const percent = scrollbarCache.percent;

      if ( scrollbarCache.was !== percent && percent % 100 === 0 ) {
        instance.fireCustomEvent( 'scrollreachedge' );
        instance.fireCustomEvent( 'scrollreach' + evSuffixes[ percent / 100 ] );
      }

      scrollbarCache.was = percent;
    },

    remove() {
      // remove parent custom classes
      this.toggle( false );
      // remove elements
      if ( scrollbarEl ) {
        scrollbarEl.parentNode.removeChild( scrollbarEl );
        scrollbarEl = null;
      }
    },

  };

};

var Utils = {

  hideNativeScrollbars( scrollEl, isRtl ) {
    let size = G.scrollbarSpec.width;
    var scrollElStyle = scrollEl.style;
    if ( size === 0 ) {
      // hide Webkit/touch scrollbars
      let time = Date.now();
      scrollEl.setAttribute( 'data-scroll', time );
      return Utils.addCssRule( '[data-scroll="' + time + '"]::-webkit-scrollbar', 'display:none;width:0;height:0;' );
    }
    scrollElStyle[ isRtl ? 'left' : 'right' ] = -size + 'px';
    scrollElStyle.bottom = -size + 'px';
    return true;

  },

  addCssRule( selector, rules ) {
    let styleSheet = document.getElementById( 'scroll-sheet' );
    if ( !styleSheet ) {
      styleSheet = document.createElement( 'style' );
      styleSheet.id = 'scroll-sheet';
      styleSheet.appendChild( document.createTextNode( '' ) ); // WebKit hack
      document.head.appendChild( styleSheet );
    }
    try {
      styleSheet.sheet.insertRule( selector + ' {' + rules + '}', 0 );
      return true;
    } catch ( e ) {}
  },

  createWrapper( element, className ) {
    const wrapper = document.createElement( 'div' );
    let child;
    while ( child = element.childNodes[ 0 ] ) {
      wrapper.appendChild( child );
    }
    return element.appendChild( wrapper );
  },

  // Global height checker
  // looped to listen element changes
  checkLoop() {

    if ( !G.instances.length ) {
      G.checkTimer = null;
      return;
    }

    if ( !G.pauseCheck ) { // check size only if not scrolling
      _invoke( G.instances, 'update' );
    }

    if ( GS.checkFrequency ) {
      G.checkTimer = setTimeout( () => {
        Utils.checkLoop();
      }, GS.checkFrequency );
    }
  },

  // easeOutCubic function
  easingFunction( t ) {
    return ( --t ) * t * t + 1;
  },

};

// Global variables
var G = Optiscroll.G = {
  isTouch: 'ontouchstart' in window,
  cssTransition: cssTest( 'transition' ),
  cssTransform: cssTest( 'transform' ),
  scrollbarSpec: getScrollbarSpec(),
  passiveEvent: getPassiveSupport(),

  instances: [],
  checkTimer: null,
  pauseCheck: false,
};

// Get scrollbars width, thanks Google Closure Library
function getScrollbarSpec() {
  const htmlEl = document.documentElement;
  let outerEl;
  let innerEl;
  let width = 0;
  let rtl = 1; // IE is reverse

  outerEl = document.createElement( 'div' );
  outerEl.style.cssText = 'overflow:scroll;width:50px;height:50px;position:absolute;left:-100px;direction:rtl';

  innerEl = document.createElement( 'div' );
  innerEl.style.cssText = 'width:100px;height:100px';

  outerEl.appendChild( innerEl );
  htmlEl.appendChild( outerEl );
  width = outerEl.offsetWidth - outerEl.clientWidth;
  if ( outerEl.scrollLeft > 0 ) {
    rtl = 0; // webkit is default
  } else {
    outerEl.scrollLeft = 1;
    if ( outerEl.scrollLeft === 0 ) {
      rtl = -1; // firefox is negative
    }
  }
  htmlEl.removeChild( outerEl );

  return {
    width,
    rtl
  };
}

function getPassiveSupport() {
  let passive = false;
  const options = Object.defineProperty( {}, 'passive', {
    get() {
      passive = true;
    },
  } );
  window.addEventListener( 'test', null, options );
  return passive ? {
    capture: false,
    passive: true
  } : false;
}

// Detect css3 support, thanks Modernizr
function cssTest( prop ) {
  const ucProp = prop.charAt( 0 )
    .toUpperCase() + prop.slice( 1 );
  const el = document.createElement( 'test' );
  const props = [ prop, 'Webkit' + ucProp ];

  for ( const i in props ) {
    if ( el.style[ props[ i ] ] !== undefined ) {
      return props[ i ];
    }
  }
  return '';
}

function toggleClass( el, value, bool ) {
  const classes = el.className.split( /\s+/ );
  const index = classes.indexOf( value );

  if ( bool ) {
    ~index || classes.push( value );
  } else {
    ~index && classes.splice( index, 1 );
  }

  el.className = classes.join( ' ' );
}

function _extend( dest, src, merge ) {
  for ( const key in src ) {
    if ( !src.hasOwnProperty( key ) || dest[ key ] !== undefined && merge ) {
      continue;
    }
    dest[ key ] = src[ key ];
  }
  return dest;
}

function _invoke( collection, fn, args ) {
  let i;
  let j;
  if ( collection.length ) {
    for ( i = 0, j = collection.length; i < j; i++ ) {
      collection[ i ][ fn ].apply( collection[ i ], args );
    }
  } else {
    for ( i in collection ) {
      collection[ i ][ fn ].apply( collection[ i ], args );
    }
  }
}

function _throttle( fn, threshhold ) {
  let last;
  let deferTimer;
  return function() {
    const context = this;
    const now = Date.now();
    const args = arguments;
    if ( last && now < last + threshhold ) {
      // hold on to it
      clearTimeout( deferTimer );
      deferTimer = setTimeout( () => {
        last = now;
        fn.apply( context, args );
      }, threshhold );
    } else {
      last = now;
      fn.apply( context, args );
    }
  };
}
