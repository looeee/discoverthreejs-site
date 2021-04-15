import esbuild from "esbuild";
import glslify from "esbuild-glslify";

export default async function buildJS(path) {
  const fileName = path.split("/").pop();

  console.time(`Built ${fileName} in: `);

  await esbuild.build({
    plugins: [glslify()],
    entryPoints: [path],
    bundle: true,
    outdir: "public/static/js",
    minify: true,
    format: "esm",
    sourcemap: true,
  });

  console.timeEnd(`Built ${fileName} in: `);

  return fileName;
}
