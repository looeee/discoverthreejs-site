import exec from "child_process";

export default function buildStatic() {
  return new Promise((resolve) => {
    const process = exec.execFile(
      ".\\hugo.exe",
      [
        "--templateMetrics",
        "--templateMetricsHints",
        "--verbose",
        // Moving the layout dir breaks shortcodes
        // "--layoutDir",
        // ".\\markdown\\layout",
        "--contentDir",
        ".\\markdown\\content",
      ],
      (error, stdout, stderr) => {
        // looks like this not not needed
        // process.kill();

        if (error) {
          console.log(error);
          resolve(false);
        } else if (stderr) {
          console.log(stderr);
          resolve(false);
        } else if (stdout) {
          console.log(stdout);
          resolve(true);
        }
      }
    );
  });
}
