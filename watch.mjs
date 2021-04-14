import esbuild from "esbuild";

import glslify from "esbuild-glslify";

esbuild
  .build({
    plugins: [glslify()],
    entryPoints: ["src/apps/ide/ide.js"],
    bundle: true,
    outdir: "public/static/js_new",
    // minify: true,
    format: "esm",
    sourcemap: true,
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.error("watch build succeeded:", result);
      },
    },
  })
  .then((result) => {
    // Call "stop" on the result when you're done
    // result.stop();
  })
  .catch((error) => {
    console.error(error);
    // process.exit(1)
  });
