import InlineIDE from './InlineIDE.js';

async function setupIDEs() {

  const elements = document.querySelectorAll( '.inline-ide' );

  for ( const elem of elements ) {

    const ide = new InlineIDE( elem );
    await ide.init();

  }

}

setupIDEs();
