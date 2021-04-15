import browsersync from "browser-sync";
import fs from "fs";

const bs = browsersync.create();

bs.use({
  plugin: () => {},
  hooks: {
    "client:events": () => {
      return ["scroll"];
    },
    "client:js": fs.readFileSync("./buildTools/bs-plugin/scroll-plugin.js"),
  },
});

bs.init({
  ui: {
    port: 3001,
  },
  // files: [
  //   'static/css/*.css',
  //   'static/js/*.js',
  //   'static/images/**/*.*',
  //   'templates/**/*.html',
  // ],
  // watchEvents: ['change'],
  watch: false,
  // ignore: [],
  single: false,
  watchOptions: {
    ignoreInitial: true,
  },
  server: false,
  proxy: "127.0.0.1:3000",
  port: 8080,
  middleware: false,
  serveStatic: [],
  ghostMode: {
    clicks: false,
    scroll: false,
    location: false,
    forms: {
      submit: false,
      inputs: false,
      toggles: false,
    },
  },
  logLevel: "info",
  logPrefix: "Browsersync",
  logConnections: true,
  logFileChanges: true,
  logSnippet: false,
  rewriteRules: [],
  open: false,
  browser: "default",
  cors: false,
  xip: false,
  hostnameSuffix: false,
  reloadOnRestart: false,
  notify: true,
  reloadDelay: 0,
  reloadDebounce: 0,
  reloadThrottle: 1000,
  injectChanges: true,
  startPath: null,
  minify: true,
  host: null,
  localOnly: false,
  codeSync: true,
  timestamps: true,
  clientEvents: [
    "scroll",
    "scroll:element",
    "input:text",
    "input:toggles",
    "form:submit",
    "form:reset",
    "click",
  ],
  socket: {
    socketIoOptions: {
      log: true,
    },
    socketIoClientConfig: {
      reconnectionAttempts: 50,
    },
    path: "/browser-sync/socket.io",
    clientPath: "/browser-sync",
    namespace: "/browser-sync",
    clients: {
      heartbeatTimeout: 50,
    },
  },
  tagNames: {
    less: "link",
    scss: "link",
    css: "link",
    jpg: "img",
    jpeg: "img",
    png: "img",
    svg: "img",
    gif: "img",
    js: "script",
  },
  injectNotification: true,
});

// bs.watch("public/**/*.html").on("change", bs.reload);

export default function reload(files) {
  bs.reload(files);
}
