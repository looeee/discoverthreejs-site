// Possible imports:

// import { Camera } from 'three';
// import { Camera } from '../../../vendor/three/build/three.module.js'; // Hard! How many  ../../?
// import { Camera } from 'https://cdn.skypack.dev/three@0.116.0';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from '../../../vendor/three/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.116.0/examples/jsm/controls/OrbitControls.js';

import { REVISION } from "three/src/constants.js";

function convertImportsInText(text, oldStyle, newStyle) {
  if (!text) return;
  let convertedText = text;

  const npmBuildImport = "from 'three'";
  const npmExampleImport = "from 'three/examples";

  // const relativeBuildImport =
  //   "from '../../../vendor/three/build/three.module.js'";
  // const relativeExampleImport =
  //   "from '../../../vendor/three/examples";

  const cdnBuildImport = `from 'https://cdn.skypack.dev/three@0.${REVISION}.2'`;
  const cdnExampleImport = `from 'https://cdn.skypack.dev/three@0.${REVISION}.2/examples`;

  let newBuildURl = npmBuildImport;
  let newExampleURl = npmExampleImport;

  if (newStyle === "cdn") {
    newBuildURl = cdnBuildImport;
    newExampleURl = cdnExampleImport;
  }
  // else if (newStyle === 'relative') {
  //   newBuildURl = relativeBuildImport;
  //   newExampleURl = relativeExampleImport; // TODO proper number of ../../
  // }

  switch (oldStyle) {
    case "npm":
      convertedText = convertedText.replace(
        new RegExp(npmBuildImport, "g"),
        newBuildURl
      );
      convertedText = convertedText.replace(
        new RegExp(npmExampleImport, "g"),
        newExampleURl
      );
      break;
    // case 'relative':
    //   convertedText = convertedText.replace(
    //     new RegExp(relativeBuildImport, 'g'),
    //     newBuildURl,
    //   );
    //   convertedText = convertedText.replace(
    //     new RegExp(relativeExampleImport, 'g'),
    //     newExampleURl,
    //   );
    //   break;
    case "cdn":
      convertedText = convertedText.replace(
        new RegExp(cdnBuildImport, "g"),
        newBuildURl
      );
      convertedText = convertedText.replace(
        new RegExp(cdnExampleImport, "g"),
        newExampleURl
      );
      break;
    default:
      break;
  }

  return convertedText;
}

export { convertImportsInText };
