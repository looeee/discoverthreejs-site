import exec from "child_process";

export default function buildStatic() {
  return new Promise((resolve) => {
    const process = exec.execFile(
      ".\\hugo",
      ["--templateMetrics", "--templateMetricsHints", "--verbose"],
      (error, stdout, stderr) => {
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
