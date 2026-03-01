/* ============================================================
   main.js — Sujay Shrestha Portfolio
   Sections:
     1. Scroll animations
     2. Nav shadow on scroll
     3. Demo iframe helpers
     4. Projects — open full page
     5. Game (Flappy Resume)
   ============================================================ */


/* ── 1. SCROLL ANIMATIONS ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('on'), i * 30);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.sa, .sa-l, .sa-r').forEach(el => obs.observe(el));


/* ── 2. NAV SHADOW ON SCROLL ── */
window.addEventListener('scroll', () => {
  document.querySelector('nav').style.boxShadow =
    scrollY > 10 ? '0 1px 0 rgba(0,0,0,0.08)' : '';
}, { passive: true });


/* ── 3. DEMO IFRAME HELPERS ── */
function demoLoaded(frameId, phId) {
  try {
    const f = document.getElementById(frameId);
    if (f.contentDocument && f.contentDocument.title !== 'Placeholder') {
      document.getElementById(phId).style.display = 'none';
    } else {
      document.getElementById(phId).style.display = 'none';
    }
  } catch(e) {}
}
function demoFailed(frameId, phId) {
  document.getElementById(frameId).style.display = 'none';
  document.getElementById(phId).style.display = 'flex';
}


/* ── 4. PROJECTS — OPEN FULL PAGE IN NEW TAB ── */
// To change where projects open — edit this one function:
function openProject(folder) {
  window.open('projects/' + folder + '/index.html', '_blank');
}


/* ── 5. GAME (Flappy Resume) ── */
function openGame() {
  document.getElementById('game-ov').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeGame() {
  document.getElementById('game-ov').classList.remove('open');
  document.body.style.overflow = '';
  if (gRun) endGame();
}

const gc = document.getElementById('gc'), gx = gc.getContext('2d');
const GW = gc.width, GH = gc.height;
let bird, pipes, gSc, gBest = 0, gFr, gRaf, gRun = false, gDead = false, gPhoto = null, sparks = [];
const LABELS = ['Deadlines','Bugs','System Failures','Clients','Scope Creep','No Sleep','Merge Conflicts','Tech Debt','The Standup','Legacy Code'];

function loadPhoto(e) {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => { const img = new Image(); img.onload = () => gPhoto = img; img.src = ev.target.result; };
  r.readAsDataURL(f);
}
function startGame() {
  gRun = true; gDead = false; gSc = 0; gFr = 0; pipes = []; sparks = [];
  bird = { x: 80, y: GH / 2, vy: 0, rot: 0, trail: [] };
  document.getElementById('gscore').textContent = 0;
  cancelAnimationFrame(gRaf); gLoop();
}
function endGame() {
  gRun = false; gDead = true;
  cancelAnimationFrame(gRaf); gDraw();
}
function spawnPipe() {
  pipes.push({ x: GW + 60, th: 70 + Math.random() * (GH - 230), gap: 195 + Math.random() * 20, lbl: LABELS[Math.floor(Math.random() * LABELS.length)], scored: false, hit: 0 });
}
function flap() {
  if (!gRun || gDead) return;
  bird.vy = -6.0;
  for (let i = 0; i < 6; i++) sparks.push({ x: bird.x, y: bird.y, vx: (Math.random() - .5) * 3, vy: Math.random() * 2 + .5, life: 1, s: 2 + Math.random() * 3 });
}
gc.addEventListener('click', flap);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeGame();
  if (e.code === 'Space' && document.getElementById('game-ov').classList.contains('open')) { e.preventDefault(); flap(); }
});

function gLoop() { if (!gRun) return; gFr++; gUpdate(); gDraw(); gRaf = requestAnimationFrame(gLoop); }
function gUpdate() {
  bird.vy += 0.20; bird.y += bird.vy;
  bird.rot = Math.max(-25, Math.min(68, bird.vy * 3.5));
  bird.trail.push({ x: bird.x, y: bird.y, l: 1 });
  if (bird.trail.length > 10) bird.trail.shift();
  bird.trail.forEach(t => t.l -= .09);
  if (gFr % 115 === 0) spawnPipe();
  const spd = 1.8 + Math.min(gSc * .028, 1.4);
  pipes.forEach(p => {
    p.x -= spd; if (p.hit > 0) p.hit--;
    if (!p.scored && p.x + 56 < bird.x) {
      p.scored = true; gSc++;
      document.getElementById('gscore').textContent = gSc;
      if (gSc > gBest) { gBest = gSc; document.getElementById('gbest').textContent = gBest; }
    }
  });
  pipes = pipes.filter(p => p.x > -80);
  sparks.forEach(s => { s.x += s.vx; s.y += s.vy; s.life -= .06; });
  sparks = sparks.filter(s => s.life > 0);
  if (bird.y + 20 > GH - 26 || bird.y - 20 < 0) { endGame(); return; }
  for (const p of pipes) { if (bird.x + 16 > p.x && bird.x - 16 < p.x + 56) { if (bird.y - 18 < p.th || bird.y + 18 > p.th + p.gap) { p.hit = 8; endGame(); return; } } }
}
function gDraw() {
  gx.fillStyle = '#f5f5f7'; gx.fillRect(0, 0, GW, GH);
  gx.strokeStyle = 'rgba(0,0,0,0.04)'; gx.lineWidth = 1;
  for (let x = (gFr * .8) % 48 - 48; x < GW; x += 48) { gx.beginPath(); gx.moveTo(x, 0); gx.lineTo(x, GH); gx.stroke(); }
  for (let y = 0; y < GH; y += 48) { gx.beginPath(); gx.moveTo(0, y); gx.lineTo(GW, y); gx.stroke(); }
  pipes.forEach(p => { drawPipe(p.x, 0, 56, p.th, p.lbl, true, p.hit > 0); drawPipe(p.x, p.th + p.gap, 56, GH - p.th - p.gap - 24, p.lbl, false, p.hit > 0); });
  gx.fillStyle = '#e5e5ea'; gx.fillRect(0, GH - 24, GW, 24);
  gx.fillStyle = 'rgba(0,0,0,0.08)'; gx.fillRect(0, GH - 25, GW, 1);
  sparks.forEach(s => { gx.globalAlpha = s.life * .7; gx.fillStyle = '#0071e3'; gx.beginPath(); gx.arc(s.x, s.y, s.s, 0, Math.PI * 2); gx.fill(); });
  gx.globalAlpha = 1;
  bird.trail.forEach((t, i) => { gx.globalAlpha = t.l * .1; gx.fillStyle = '#0071e3'; const ts = 16 * (i / bird.trail.length); gx.beginPath(); gx.arc(t.x, t.y, ts, 0, Math.PI * 2); gx.fill(); });
  gx.globalAlpha = 1;
  gx.save(); gx.translate(bird.x, bird.y); gx.rotate(bird.rot * Math.PI / 180);
  if (gPhoto) {
    gx.beginPath(); gx.arc(0, 0, 20, 0, Math.PI * 2); gx.clip();
    gx.drawImage(gPhoto, -20, -20, 40, 40);
    gx.strokeStyle = '#0071e3'; gx.lineWidth = 2.5; gx.beginPath(); gx.arc(0, 0, 20, 0, Math.PI * 2); gx.stroke();
  } else {
    gx.fillStyle = '#0071e3'; gx.beginPath(); gx.arc(0, 0, 20, 0, Math.PI * 2); gx.fill();
    gx.fillStyle = 'rgba(255,255,255,.9)'; gx.beginPath(); gx.arc(7, -6, 7, 0, Math.PI * 2); gx.fill();
    gx.fillStyle = '#1d1d1f'; gx.beginPath(); gx.arc(8, -5, 3.5, 0, Math.PI * 2); gx.fill();
    gx.fillStyle = '#fff'; gx.beginPath(); gx.arc(9, -6, 1.2, 0, Math.PI * 2); gx.fill();
    gx.fillStyle = '#ff9f0a'; gx.beginPath(); gx.moveTo(20, -3); gx.lineTo(30, 0); gx.lineTo(20, 3); gx.closePath(); gx.fill();
  }
  gx.restore();
  if (gRun && !gDead) { gx.font = '600 20px -apple-system,sans-serif'; gx.fillStyle = 'rgba(0,0,0,0.18)'; gx.textAlign = 'center'; gx.textBaseline = 'top'; gx.fillText(gSc, GW / 2, 14); }
  if (gDead) {
    gx.fillStyle = 'rgba(255,255,255,.88)'; gx.fillRect(0, 0, GW, GH);
    gx.textAlign = 'center'; gx.textBaseline = 'middle';
    gx.font = '700 34px -apple-system,sans-serif'; gx.fillStyle = '#1d1d1f'; gx.fillText('Game Over', GW / 2, GH / 2 - 44);
    gx.font = '500 16px -apple-system,sans-serif'; gx.fillStyle = '#0071e3'; gx.fillText(`Score ${gSc}  ·  Best ${gBest}`, GW / 2, GH / 2 - 4);
    gx.font = '400 13px -apple-system,sans-serif'; gx.fillStyle = '#6e6e73';
    const msgs = ["At least it wasn't in production.", '404: Career not found.', 'Have you tried turning off Deadlines?', 'Hire this dev anyway.'];
    gx.fillText(msgs[gSc % msgs.length], GW / 2, GH / 2 + 28);
    gx.fillText('Press Start to try again', GW / 2, GH / 2 + 58);
  }
  if (!gRun && !gDead) {
    gx.fillStyle = 'rgba(255,255,255,.7)'; gx.fillRect(0, 0, GW, GH);
    gx.font = '400 14px -apple-system,sans-serif'; gx.fillStyle = '#6e6e73'; gx.textAlign = 'center'; gx.textBaseline = 'middle';
    gx.fillText('Press Start to play', GW / 2, GH / 2 - 12);
    gx.fillText('Space or tap to flap', GW / 2, GH / 2 + 12);
  }
}
function drawPipe(x, y, w, h, lbl, isTop, flash) {
  if (h <= 0) return;
  const cap = 20, r = 8;
  gx.fillStyle = flash ? '#ff3b30' : '#1d1d1f';
  gx.beginPath();
  if (isTop) gx.roundRect(x, y, w, h - cap, [4, 4, 0, 0]);
  else gx.roundRect(x, y + cap, w, h - cap, [0, 0, 4, 4]);
  gx.fill();
  gx.fillStyle = flash ? '#ff6961' : '#3a3a3c';
  gx.beginPath();
  if (isTop) gx.roundRect(x - 6, h - cap, w + 12, cap, [0, 0, r, r]);
  else gx.roundRect(x - 6, y, w + 12, cap, [r, r, 0, 0]);
  gx.fill();
  gx.font = '600 8px -apple-system,sans-serif';
  gx.fillStyle = 'rgba(255,255,255,0.85)';
  gx.textAlign = 'center'; gx.textBaseline = 'middle';
  const lx = x + w / 2, ly = isTop ? (h - cap / 2) : (y + cap / 2);
  const words = lbl.split(' ');
  if (words.length > 1 && lbl.length > 10) {
    gx.fillText(words[0], lx, ly - 5);
    gx.fillText(words.slice(1).join(' '), lx, ly + 5);
  } else {
    gx.fillText(lbl, lx, ly);
  }
}
