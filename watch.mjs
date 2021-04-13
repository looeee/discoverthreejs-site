import esbuild from "esbuild";

import glslify from "esbuild-glslify";

esbuild
  .build({
    plugins: [glslify()],
    entryPoints: ["src/main.js"],
    bundle: true,
    outdir: "dist",
    // minify: true,
    format: "esm",
    sourcemap: "inline",
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
