import { existsSync, mkdirSync, promises as fs } from "fs";
import sass from "sass";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import CleanCSS from "clean-css";

const cleaner = new CleanCSS({
  level: 2,
});

function minifyCSS(file, input) {
  const output = cleaner.minify(input);

  if (output.errors.length) {
    console.log("Errors: ");
    console.log(output.errors, file);
  }
  if (output.warnings.length) {
    console.log("Warnings: ");
    console.log(output.warnings, file);
  }

  const oldSize = output.stats.originalSize / 1000;
  const newSize = output.stats.minifiedSize / 1000;
  console.log(`Minifying CSS. Reduced from ${oldSize}kb to ${newSize}kb.`);

  return output.styles;
}

async function compileSCSS(inputFile, outputFile) {
  const result = sass.renderSync({
    file: inputFile,
    // outputStyle: 'compressed', // cleanCSS does a better job
  });

  const processed = await postcss([autoprefixer]).process(result.css, {
    from: undefined,
    to: outputFile,
  });

  if (!existsSync("public/css")) {
    mkdirSync("public/css");
  }
  await fs.writeFile(outputFile, processed.css);

  const minified = minifyCSS(outputFile, processed.css);
  await fs.writeFile(outputFile.replace(".css", ".min.css"), minified);
}

function getAppName(path) {
  if (!path || !path.includes("scss\\apps\\")) {
    return null;
  }
  const folders = path.split("\\");
  const appName = folders[2];
  if (!appName) {
    return null;
  }
  return appName;
}

export default async function buildCSS(path) {
  const appName = getAppName(path);
  const inputFile = `scss\\apps\\${appName}\\main.scss`;
  const outputFile = `public\\css\\${appName}.css`;

  console.log(`Building ${outputFile}`);
  try {
    await compileSCSS(inputFile, outputFile);
    return appName;
  } catch (err) {
    console.error(`Error building ${appName}.js`);
    console.error(`In file: ${err.file}`);
    console.error(`Line: ${err.line}, column: ${err.column}`);
    // console.error(err.formatted);
    console.error(`Details: ${err.formatted}`);
    return null;
  }
}
