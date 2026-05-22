// THEME
const html = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
let isDark = true;
toggleBtn.addEventListener('click', () => {
  isDark = !isDark;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
});

// CURSOR
const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px' });
(function animRing() {
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  ring.style.left = Math.round(rx) + 'px'; ring.style.top = Math.round(ry) + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,.btn,.proj-card,.svc-card,.blog-card,.skill,.theme-toggle').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width = '6px'; cur.style.height = '6px'; ring.style.width = '52px'; ring.style.height = '52px' });
  el.addEventListener('mouseleave', () => { cur.style.width = '12px'; cur.style.height = '12px'; ring.style.width = '36px'; ring.style.height = '36px' });
});

// SCROLL
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
  prog.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  document.querySelector('.orb1').style.transform = `translateY(${window.scrollY * .08}px)`;
  document.querySelector('.orb2').style.transform = `translateY(${window.scrollY * .05}px)`;
});

// REVEAL
const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible') }), { threshold: .15 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));

// COUNTERS
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    let n = 0; const step = target / 50;
    const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = Math.floor(n) + (target > 5 ? '+' : ''); if (n >= target) clearInterval(t) }, 30);
    cObs.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(c => cObs.observe(c));

// =============================================
// SKY / LIGHTNING ENGINE
// =============================================
const canvas = document.getElementById('sky'), ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
resize(); window.addEventListener('resize', resize);

// --- CLOUDS (light mode) ---
class Cloud {
  constructor(startOffscreen) { this.reset(startOffscreen) }
  reset(offscreen) {
    this.y = Math.random() * H * .5 + 20;
    this.x = offscreen ? -400 : Math.random() * W;
    this.speed = .15 + Math.random() * .15;
    this.scale = .5 + Math.random() * .85;
    this.alpha = .55 + Math.random() * .35;
    this.puffs = [
      { rx: 0, ry: 0, r: 48 }, { rx: -50, ry: 14, r: 36 }, { rx: 50, ry: 12, r: 40 },
      { rx: -28, ry: -18, r: 30 }, { rx: 30, ry: -16, r: 28 }, { rx: 0, ry: -24, r: 22 }
    ];
  }
  draw() {
    ctx.save(); ctx.translate(this.x, this.y); ctx.scale(this.scale, this.scale); ctx.globalAlpha = this.alpha;
    this.puffs.forEach(p => { ctx.beginPath(); ctx.arc(p.rx, p.ry, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fill() });
    ctx.restore();
    this.x += this.speed;
    if (this.x - 400 * this.scale > W) this.reset(true);
  }
}

// --- HOT AIR BALLOONS (light mode) ---
const BALLOON_COLORS = [
  ['#ff6b6b', '#ffd93d', '#6bcb77'],
  ['#a78bfa', '#f472b6', '#fbbf24'],
  ['#34d399', '#60a5fa', '#f87171'],
  ['#fb923c', '#facc15', '#e879f9'],
  ['#38bdf8', '#f472b6', '#86efac'],
];
class Balloon {
  constructor(offscreen) { this.reset(offscreen) }
  reset(offscreen) {
    this.colors = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    this.x = Math.random() * W;
    this.y = offscreen ? -220 : -Math.random() * 200;
    this.vy = .28 + Math.random() * .2;
    this.vx = (Math.random() - .5) * .35;
    this.scale = .55 + Math.random() * .55;
    this.alpha = 0;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = .008 + Math.random() * .006;
    this.swayAmp = 1.2 + Math.random() * 1.5;
  }

  drawBalloon(x, y, s, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha = alpha;

    const [c1, c2, c3] = this.colors;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.15)'; ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(0, -60, 38, 52, 0, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(-38, -112, 38, -8);
    grad.addColorStop(0, c1); grad.addColorStop(.38, c2); grad.addColorStop(1, c3);
    ctx.fillStyle = grad; ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.ellipse(0, -60, 38, 52, 0, 0, Math.PI * 2); ctx.clip();
    const stripeW = 15;
    for (let i = -3; i <= 3; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,.13)' : 'rgba(0,0,0,.07)';
      ctx.fillRect(i * stripeW - 7, -116, stripeW, -8 + 116);
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.ellipse(-10, -70, 14, 22, -.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); ctx.restore();

    ctx.beginPath();
    ctx.moveTo(-10, -8); ctx.lineTo(-6, -18); ctx.lineTo(6, -18); ctx.lineTo(10, -8);
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fill();

    ctx.strokeStyle = 'rgba(120,80,30,.65)'; ctx.lineWidth = .8;
    [[-18, -8], [-8, -8], [8, -8], [18, -8]].forEach(([rx]) => {
      ctx.beginPath(); ctx.moveTo(rx, -8); ctx.lineTo(rx * .4, 28); ctx.stroke();
    });

    ctx.save();
    const bw = 24, bh = 18;
    ctx.beginPath();
    ctx.roundRect(-bw / 2, 20, bw, bh, 3);
    ctx.fillStyle = '#b5722a'; ctx.fill();
    ctx.strokeStyle = '#7c4a15'; ctx.lineWidth = 1; ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.lineWidth = .7;
    for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-bw / 2, 20 + i * (bh / 3)); ctx.lineTo(bw / 2, 20 + i * (bh / 3)); ctx.stroke() }
    for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-bw / 2 + i * (bw / 4), 20); ctx.lineTo(-bw / 2 + i * (bw / 4), 20 + bh); ctx.stroke() }
    ctx.beginPath(); ctx.roundRect(-bw / 2 - 2, 18, bw + 4, 5, 2);
    ctx.fillStyle = '#c97f2e'; ctx.fill(); ctx.restore();

    ctx.save();
    const flicker = Math.sin(Date.now() * .018) * 2;
    const fg = ctx.createRadialGradient(0, -10, 0, 0, -10, 10 + flicker);
    fg.addColorStop(0, 'rgba(255,220,60,.9)'); fg.addColorStop(.5, 'rgba(255,120,20,.55)'); fg.addColorStop(1, 'rgba(255,60,0,0)');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(0, -10, 8 + flicker * .3, 10 + flicker, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  draw() {
    this.wobble += this.wobbleSpeed;
    const sway = Math.sin(this.wobble) * this.swayAmp;
    this.x += this.vx + sway * .012;
    this.y += this.vy;
    if (this.y < 80) this.alpha = Math.min(1, this.alpha + .015);
    else if (this.y > H - 150) this.alpha = Math.max(0, this.alpha - .018);
    else this.alpha = Math.min(1, this.alpha + .01);
    const tilt = Math.sin(this.wobble * .7) * .04;
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(tilt); ctx.translate(-this.x, -this.y);
    this.drawBalloon(this.x, this.y, this.scale, this.alpha);
    ctx.restore();
    if (this.y > H + 230) this.reset(true);
  }
}

// --- LIGHTNING BOLT (dark mode) ---
function boltPoints(x1, y1, x2, y2, spread, depth) {
  if (depth === 0) return [[x1, y1], [x2, y2]];
  const mx = (x1 + x2) / 2 + (Math.random() - .5) * spread;
  const my = (y1 + y2) / 2 + (Math.random() - .5) * spread;
  return [...boltPoints(x1, y1, mx, my, spread / 2, depth - 1), ...boltPoints(mx, my, x2, y2, spread / 2, depth - 1).slice(1)];
}

class Bolt {
  constructor() { this.init() }
  init() {
    const side = Math.random();
    if (side < .6) { this.sx = Math.random() * W; this.sy = 0; }
    else if (side < .8) { this.sx = 0; this.sy = Math.random() * H * .4; }
    else { this.sx = W; this.sy = Math.random() * H * .4; }
    this.ex = this.sx + (Math.random() - .5) * 500;
    this.ey = this.sy + Math.random() * H * .7 + 150;
    this.pts = boltPoints(this.sx, this.sy, this.ex, this.ey, 200 + Math.random() * 120, 8);
    this.life = 0;
    this.maxLife = 30 + Math.floor(Math.random() * 14);
    this.width = 1.4 + Math.random() * 1.2;
    this.color = Math.random() < .65 ? '167,139,250' : '100,210,255';
    this.branches = [];
    for (let i = 0; i < 4 + Math.floor(Math.random() * 3); i++) {
      const si = Math.floor(Math.random() * (this.pts.length - 5)) + 2;
      const [bx, by] = this.pts[si];
      this.branches.push({ pts: boltPoints(bx, by, bx + (Math.random() - .5) * 300, by + Math.random() * 220 + 80, 100, 6), life: 0, maxLife: 10 });
    }
    this.dead = false;
  }
  draw() {
    if (this.dead) return;
    const t = this.life / this.maxLife;
    const a = t < .2 ? t / .2 : (1 - t) * .9 + .05;
    ctx.save(); ctx.shadowBlur = 22; ctx.shadowColor = `rgba(${this.color},${a * .6})`;
    ctx.strokeStyle = `rgba(${this.color},${a * .22})`; ctx.lineWidth = this.width * 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); this.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = `rgba(255,255,255,${a * .88})`; ctx.lineWidth = this.width * .5; ctx.lineCap = 'round';
    ctx.beginPath(); this.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    ctx.strokeStyle = `rgba(${this.color},${a * .7})`; ctx.lineWidth = this.width * 1.6;
    ctx.beginPath(); this.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    this.branches.forEach(b => {
      if (b.life >= b.maxLife) return;
      const bt = b.life / b.maxLife, ba = (bt < .2 ? bt / .2 : (1 - bt)) * .5 * a;
      ctx.strokeStyle = `rgba(${this.color},${ba})`; ctx.lineWidth = this.width * .8;
      ctx.beginPath(); b.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
      b.life++;
    });
    this.life++;
    if (this.life > this.maxLife) this.dead = true;
  }
}

// --- AMBIENT FLARES (dark mode) ---
class Flare {
  constructor() { this.reset() }
  reset() { this.x = Math.random() * W; this.y = Math.random() * H; this.r = Math.random() * 140 + 50; this.life = 0; this.maxLife = 70 + Math.floor(Math.random() * 90); this.color = Math.random() < .6 ? '124,58,237' : '80,180,255' }
  draw() {
    const t = this.life / this.maxLife, a = t < .3 ? t / .3 * .055 : (1 - t) * .055;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    g.addColorStop(0, `rgba(${this.color},${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill();
    this.life++; if (this.life > this.maxLife) this.reset();
  }
}

const clouds = Array.from({ length: 9 }, () => new Cloud(false));
const balloons = Array.from({ length: 5 }, () => new Balloon(false));
const flares = Array.from({ length: 8 }, () => new Flare());
let activeBolts = [], lastStrike = 0;

function spawnStrike() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => { const b = new Bolt(); activeBolts.push(b) }, i * 320);
  }
}

function drawSky() {
  ctx.clearRect(0, 0, W, H);
  if (!isDark) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(96,165,250,.18)');
    grad.addColorStop(1, 'rgba(147,197,253,.05)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    clouds.forEach(c => c.draw());
    balloons.forEach(b => b.draw());
  } else {
    flares.forEach(f => f.draw());
    const now = performance.now();
    if (now - lastStrike > 3500) { spawnStrike(); lastStrike = now }
    activeBolts = activeBolts.filter(b => { b.draw(); return !b.dead });
  }
  requestAnimationFrame(drawSky);
}
drawSky();