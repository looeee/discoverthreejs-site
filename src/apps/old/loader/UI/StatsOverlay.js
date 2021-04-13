export default class StatsOverlay {
  constructor(app) {
    if (typeof Stats !== 'function') return;

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    app.onUpdate = () => {
      stats.update();
    };
  }
}
