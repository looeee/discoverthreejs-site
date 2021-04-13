/*
 Currently not used because it only overrides font size on the body
 and any elements that directly inherit. Works fine for <p> but not much else
*/

export default function fontSizeChanger() {
  const select = document
    .querySelector('.font-size-select')
    .querySelector('select');

  // if ( !select ) {

  //   console.warn( 'Font Size selection menu not found!' );
  //   return;

  // }

  let prevIndex = select.selectedIndex;

  console.log(select[select.selectedIndex].value);

  select.addEventListener('change', e => {
    e.preventDefault();

    const newIndex = select.selectedIndex;

    if (newIndex === prevIndex) return;

    document.body.style.fontSize = select[newIndex].value;

    prevIndex = newIndex;
  });
}
