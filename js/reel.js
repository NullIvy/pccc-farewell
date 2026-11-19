const PHOTOS = ["photos/01.jpg", "photos/02.jpg", "photos/03.jpg", "photos/04.jpg", "photos/05.jpg", "photos/06.jpg", "photos/07.jpg", "photos/08.jpg", "photos/09.jpg", "photos/10.jpg", "photos/11.jpg", "photos/12.jpg", "photos/13.jpg"];

const COPY = {
  title: ['Selamat jalan,', 'PCCC'],
  sign: 'kita berempat',
  slides: [
    ['Dari asing jadi keluarga', 'Datang tanpa saling kenal, pulang dengan saling punya.'],
    ['Lembur yang tak terasa', 'Karena dikerjakan bersama, yang berat pun jadi ringan.'],
    ['Bukan selamat tinggal', 'Hanya jeda, sampai kita bertemu lagi di tempat yang lebih baik.'],
    ['Lebih dari rekan kerja', 'Kalian rumah, tempat pulang di hari-hari paling berat.']
  ],
  outroLabel: 'BERHENTI SEJENAK, 30 NOVEMBER 2026',
  outro: 'Sampai bertemu lagi.',
  credits: [
    ['Anita Sabela', 'Account Manager'],
    ['Vidia Syahrisa', 'Account Manager'],
    ['Ulfa Mardhatillah', 'Account Executive'],
    ['Muhammad Rifi', 'Solution & Delivery Engineer Jr']
  ]
};

/* ---------- timeline (seconds) ---------- */
const SEQ = [['flash', .8], ['title', 1.8]];
for (let i = 0; i < 4; i++) SEQ.push(['grid', 2.2, i], ['slide', 2.4, i]);
SEQ.push(['outro', 3.0]);
const TOTAL = SEQ.reduce((a, s) => a + s[1], 0);

const W = 1920, H = 1080, PAD = 140;
const cv = document.getElementById('stage'), ctx = cv.getContext('2d');
let imgs = [];

function loadImages(srcs) {
  return Promise.all(srcs.map(s => new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = s; })))
    .then(a => { imgs = a.filter(Boolean); });
}
function photoFor(grid, cell) {
  if (!imgs.length) return null;
  return imgs[(grid * 9 + cell * 4 + grid * 3) % imgs.length];
}
function cover(im, x, y, w, h) {
  if (!im) { ctx.fillStyle = (x / w + y / h) % 2 ? '#1a1a1a' : '#262626'; ctx.fillRect(x, y, w, h); return; }
  const s = Math.max(w / im.width, h / im.height), sw = w / s, sh = h / s;
  ctx.drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, x, y, w, h);
}
function grid(g, count) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const cw = W / 3, ch = H / 3;
  for (let i = 0; i < count; i++) cover(photoFor(g, i), (i % 3) * cw, Math.floor(i / 3) * ch, Math.ceil(cw), Math.ceil(ch));
}
function text(str, x, y, font, color, track = 0) {
  ctx.font = font; ctx.fillStyle = color; ctx.letterSpacing = track + 'px'; ctx.fillText(str, x, y); ctx.letterSpacing = '0px';
  return ctx.measureText(str).width;
}
function wrap(str, maxW, font) {
  ctx.font = font; const words = str.split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  lines.push(cur); return lines;
}

function bg(cx, cy) {
  ctx.fillStyle = '#0b0b0c'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 700);
  g.addColorStop(0, 'rgba(43,87,166,.28)'); g.addColorStop(.5, 'rgba(232,180,37,.10)'); g.addColorStop(1, 'rgba(11,11,12,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
const SERIF = 'Fraunces, Georgia, serif', SCRIPT = 'Caveat, cursive';
function draw(t) {
  ctx.textBaseline = 'alphabetic';
  let acc = 0, seg;
  for (seg of SEQ) { if (t < acc + seg[1]) break; acc += seg[1]; }
  const lt = t - acc, [type, , idx] = seg;

  if (type === 'flash') grid(0, 9);

  else if (type === 'grid') grid(idx, Math.min(9, 1 + Math.floor(lt / .18)));

  else if (type === 'title') {
    bg(W * .3, H * .5);
    const f = `500 170px ${SERIF}`;
    text(COPY.title[0], PAD, 470, f, '#fff', -4);
    text(COPY.title[1], PAD, 650, f, '#fff', -4);
    if (lt > .35) {
      text('oleh', PAD + 6, 780, '400 40px Inter', '#bdbdbd');
      text(COPY.sign, PAD + 110, 785, `700 84px ${SCRIPT}`, '#E8B425');
    }
  }

  else if (type === 'slide') {
    bg(W * .25, H * .55);
    const [head, sub] = COPY.slides[idx];
    const hf = `500 128px ${SERIF}`, lines = wrap(head, W - PAD * 2, hf), lh = 140;
    const block = 110 + lines.length * lh + 130, top = (H - block) / 2;
    text('0' + (idx + 1), PAD, top + 70, `700 84px ${SCRIPT}`, '#E8B425');
    lines.forEach((l, i) => text(l, PAD, top + 110 + (i + 1) * lh - 30, hf, '#fff', -3));
    if (lt > .45) {
      const sf = '400 38px Inter', y0 = top + 110 + lines.length * lh + 50;
      wrap(sub, 1150, sf).forEach((l, i) => text(l, PAD, y0 + i * 54, sf, '#d0d0d0'));
    }
  }

  else if (type === 'outro') {
    bg(W * .5, H * .35);
    text(COPY.outroLabel, PAD, 260, '500 24px Inter', '#8a8a8a', 6);
    text(COPY.outro, PAD, 420, `500 140px ${SERIF}`, '#fff', -3);
    if (lt > .5) {
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(PAD, 560, W - PAD * 2, 1);
      COPY.credits.forEach(([n, r], i) => {
        const x = PAD + (i % 2) * 820, y = 680 + Math.floor(i / 2) * 140;
        text(n, x, y, `500 60px ${SCRIPT}`, '#fff');
        text(r.toUpperCase(), x, y + 44, '400 20px Inter', '#8a8a8a', 3);
      });
    }
  }
}

/* ---------- playback ---------- */
let lastKey = -1, playing = true, speed = 1, t = 0, last = performance.now(), onLoopEnd = null;
function loop(now) {
  const dt = (now - last) / 1000; last = now;
  if (playing) {
    t += dt * speed;
    if (t >= TOTAL) { t = 0; if (onLoopEnd) { const f = onLoopEnd; onLoopEnd = null; f(); } }
  }
  const key = Math.floor(t * 30);
  if (key !== lastKey) { lastKey = key; draw(t); }
  requestAnimationFrame(loop);
}

const $ = id => document.getElementById(id);
$('play').onclick = () => { playing = !playing; $('play').textContent = playing ? 'Jeda' : 'Putar'; };
$('restart').onclick = () => { t = 0; playing = true; $('play').textContent = 'Jeda'; };
$('speed').oninput = e => { speed = +e.target.value; $('spv').textContent = speed.toFixed(2) + 'x'; };
$('clean').onclick = () => { document.body.classList.add('clean'); document.documentElement.requestFullscreen?.().catch(() => {}); };
addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('clean'); });

function useFiles(files) {
  const list = [...files].filter(f => f.type.startsWith('image/')); if (!list.length) return;
  loadImages(list.map(f => URL.createObjectURL(f))).then(() => { t = 0; });
}
$('file').onchange = e => useFiles(e.target.files);
addEventListener('dragover', e => e.preventDefault());
addEventListener('drop', e => { e.preventDefault(); useFiles(e.dataTransfer.files); });

/* copy editor */
const fields = [['Title line 1', () => COPY.title[0], v => COPY.title[0] = v], ['Title line 2', () => COPY.title[1], v => COPY.title[1] = v], ['Signature', () => COPY.sign, v => COPY.sign = v]];
COPY.slides.forEach((s, i) => fields.push([`0${i + 1} headline`, () => s[0], v => s[0] = v], [`0${i + 1} subcopy`, () => s[1], v => s[1] = v]));
fields.push(['Outro', () => COPY.outro, v => COPY.outro = v]);
fields.forEach(([label, get, set]) => {
  const l = document.createElement('span'); l.textContent = label; l.style.color = '#999';
  const inp = document.createElement('input'); inp.value = get(); inp.oninput = () => set(inp.value);
  $('drawer').append(l, inp);
});
$('editBtn').onclick = () => $('drawer').classList.toggle('open');

/* export */
$('export').onclick = () => {
  if (!window.MediaRecorder) return alert('MediaRecorder is not supported in this browser.');
  const type = ['video/webm;codecs=vp9', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
  const rec = new MediaRecorder(cv.captureStream(60), { mimeType: type, videoBitsPerSecond: 12e6 }), chunks = [];
  rec.ondataavailable = e => chunks.push(e.data);
  rec.onstop = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' })); a.download = 'pccc-farewell.webm'; a.click(); $('export').textContent = 'Export WebM'; };
  t = 0; playing = true; rec.start(); $('export').textContent = 'Recording...';
  onLoopEnd = () => rec.stop();
};

Promise.all([loadImages(PHOTOS), document.fonts.load('500 100px Fraunces'), document.fonts.load('400 40px Inter'), document.fonts.load('500 40px Inter'), document.fonts.load('700 80px Caveat'), document.fonts.load('500 60px Caveat')])
  .finally(() => requestAnimationFrame(t0 => { last = t0; loop(t0); }));

/* Background music: "Negoro Angin" by Muslih Fvnky (YouTube embed), loops forever */
const EMBED = new URLSearchParams(location.search).has('embedded');
if (new URLSearchParams(location.search).has('edit')) document.body.classList.add('editor');
const BGM_ID = 'IMg-w8g8Ekk';
let bgm, bgmReady = false, bgmWanted = false;
window.onYouTubeIframeAPIReady = () => {
  bgm = new YT.Player('bgm', {
    width: 1, height: 1, videoId: BGM_ID,
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: BGM_ID, playsinline: 1 },
    events: {
      onReady: () => { bgmReady = true; bgm.setVolume(70); try { const t0 = +localStorage.getItem('pcccBgmTime'); if (t0) bgm.seekTo(t0, true); } catch (e) {} if (bgmWanted) bgm.playVideo(); },
      onStateChange: e => { if (e.data === YT.PlayerState.ENDED) { bgm.seekTo(0); bgm.playVideo(); } }
    }
  });
};
function startMusic() { bgmWanted = true; if (bgmReady) bgm.playVideo(); }
function toggleMusic() {
  if (!bgmReady) return startMusic();
  bgm.getPlayerState() === YT.PlayerState.PLAYING ? bgm.pauseVideo() : bgm.playVideo();
}
/* remember song position so it continues across pages */
setInterval(() => { try { if (bgmReady && bgm.getPlayerState() === 1) localStorage.setItem('pcccBgmTime', bgm.getCurrentTime()); } catch (e) {} }, 1000);
if (!EMBED) { const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); }

document.getElementById('music').onclick = toggleMusic;
if (EMBED) {
  document.getElementById('music').style.display = 'none';
  document.getElementById('hint').textContent = 'Drag and drop photos anywhere. Press Esc to leave clean mode.';
  document.getElementById('back').onclick = e => { e.preventDefault(); parent.postMessage('pccc-close-reel', '*'); };
}
if (!EMBED && localStorage.getItem('pcccBgmTime')) startMusic();
addEventListener('pointerdown', () => { if (!EMBED) startMusic(); }, { once: true });
addEventListener('keydown', () => startMusic(), { once: true });
