/*
Auto select hugo cmd to support cross-platform
*/

"use strict";

const { execSync, exec } = require("child_process");
const path = require("path");
const os = require("os");

const platform = os.platform();
const environment = process.env.NODE_ENV;

// Run hugo cmd
function runCmd(prefix = "") {
  let cmdStr =
    environment === "dev"
      ? "hugo serve --templateMetrics --templateMetricsHints --verbose"
      : "hugo --templateMetrics --templateMetricsHints --verbose";
  cmdStr = prefix + cmdStr;
  execSync(cmdStr, { cwd: path.resolve(__dirname, "../"), stdio: "inherit" });
}

exec("hugo version", (error) => {
  if (error) {
    switch (platform) {
      case "win32":
        runCmd(".\\");
        break;
      default:
        runCmd("./");
    }
  } else {
    runCmd();
  }
});
