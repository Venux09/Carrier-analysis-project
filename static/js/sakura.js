// Falling sakura petals — runs on a full-page canvas behind content.
// Attaches itself to #sakura-canvas, which must exist in base.html.

(function () {
  const canvas = document.getElementById("sakura-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let petals = [];

  const PETAL_COLOR = "#c75d6e";
  const PETAL_COUNT = 26;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makePetal() {
    return {
      x: randomBetween(0, width),
      y: randomBetween(-height, 0),
      size: randomBetween(8, 16),
      speedY: randomBetween(0.4, 1.1),
      drift: randomBetween(-0.6, 0.6),
      rotation: randomBetween(0, Math.PI * 2),
      rotationSpeed: randomBetween(-0.02, 0.02),
      sway: randomBetween(0, Math.PI * 2),
      swaySpeed: randomBetween(0.01, 0.025),
      opacity: randomBetween(0.4, 0.75),
    };
  }

  function initPetals() {
    petals = Array.from({ length: PETAL_COUNT }, makePetal);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = PETAL_COLOR;

    // simple 5-curve petal shape
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 0.6, p.size * 0.3, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.3, -p.size * 0.6, -p.size * 0.6, 0, -p.size);
    ctx.fill();

    ctx.restore();
  }

  function update() {
    for (const p of petals) {
      p.sway += p.swaySpeed;
      p.y += p.speedY;
      p.x += p.drift + Math.sin(p.sway) * 0.5;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        Object.assign(p, makePetal());
        p.y = -20;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (const p of petals) drawPetal(p);
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  resize();
  initPetals();
  loop();
})();