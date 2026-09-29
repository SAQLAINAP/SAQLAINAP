// Builds every static README panel into ../../assets/.
//   cd tools/readme && npm run build
// The live stats panel is built separately by pulse.mjs (daily Action).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { C, text, measure, wrap, rect, card, chip, sparkle, check, canvas, heading, svg, nest, outlineTexts } from './lib.mjs';
import * as D from './data.mjs';

const OUT = new URL('../../assets/', import.meta.url);
const write = (name, s) => { mkdirSync(new URL('.', new URL(name, OUT)), { recursive: true }); writeFileSync(new URL(name, OUT), s); console.log(`${name.padEnd(28)} ${(s.length / 1024).toFixed(0).padStart(4)} KB`); };
const icon = (id) => readFileSync(new URL(`./icons/${id}.svg`, import.meta.url), 'utf8');
const W = 1200;

// ---- 01 whoami ----------------------------------------------------------------
function whoami() {
  const H = 560;
  let s = canvas(W, H) + heading('01', 'WHOAMI', '// cat about.yml', W);
  const cx = 40, cy = 100, cw = 800, ch = 420;
  s += card(cx, cy, cw, ch, { shadow: C.yellow });
  s += rect(cx, cy, cw, 36, C.ink);
  [C.red, C.yellow, C.lime].forEach((c, i) => { s += `<circle cx="${cx + 22 + i * 20}" cy="${cy + 18}" r="6" fill="${c}"/>`; });
  s += text('~/saqlainap — about.yml', cx + cw / 2, cy + 23, { size: 13, fill: C.cream, opacity: 0.7, anchor: 'middle' });
  const kx = cx + 32, vx = kx + 140;
  D.ABOUT.forEach(([k, v], i) => {
    const y = cy + 82 + i * 32;
    s += text(k, kx, y, { size: 17, fill: C.ink });
    s += text(':', kx + measure(k, { size: 17 }), y, { size: 17, fill: C.grey });
    if (Array.isArray(v)) {
      let x = vx;
      s += text('[', x, y, { size: 17, fill: C.pink }); x += measure('[', { size: 17 });
      v.forEach((item, j) => {
        s += text(item, x, y, { font: 'monoR', size: 17, fill: C.ink }); x += measure(item, { font: 'monoR', size: 17 });
        if (j < v.length - 1) { s += text(', ', x, y, { size: 17, fill: C.grey }); x += measure(', ', { size: 17 }); }
      });
      s += text(']', x, y, { size: 17, fill: C.pink });
    } else if (k === 'status') {
      const c = chip(v, vx - 6, y - 21, { size: 15, bg: C.ink, fg: C.lime, dot: C.lime, dotCls: 'pulse', h: 30 });
      s += c.svg + rect(vx - 6 + c.w + 10, y - 20, 11, 26, C.ink, ' class="blink"');
    } else {
      s += text(v, vx, y, { font: 'monoR', size: 17, fill: C.ink });
    }
  });
  // Pixel avatar sticker + labels on the right.
  const ax = 890, ay = 110, as = 260;
  s += rect(ax + 12, ay + 12, as, as, C.lime);
  s += nest(readFileSync(new URL('./art/avatar.svg', import.meta.url), 'utf8'), ax, ay, as, as, 'av');
  s += `<rect x="${ax + 2}" y="${ay + 2}" width="${as - 4}" height="${as - 4}" fill="none" stroke="${C.cream}" stroke-width="4"/>`;
  const on = chip('ONLINE · BANGALORE, IN', ax, ay + as + 34, { size: 13, bg: C.ink, fg: C.lime, stroke: C.lime, sw: 2, dot: C.lime, dotCls: 'pulse' });
  s += on.svg;
  s += `<g transform="translate(${ax + 20} ${ay + as + 92}) rotate(-3)">` + chip('OPEN TO COLLABS', 0, 0, { size: 15, bg: C.yellow, fg: C.ink, shadow: C.cream, off: 6 }).svg + '</g>';
  s += sparkle(ax + as - 6, ay + 4, 26, C.yellow);
  return svg(W, H, s, { title: 'whoami: Saqlain Ahmed P, Forward Deployed Engineer at Plivo, B.E. AI & ML at DSCE with CGPA 9.25, 8 hackathon wins, open to collaborations' });
}

// ---- 02 experience --------------------------------------------------------------
function experience() {
  const rowH = 150, gap = 26, top = 100;
  const H = top + D.ROLES.length * (rowH + gap) + 14;
  let s = canvas(W, H) + heading('02', 'NOW & BEFORE', '// experience.log', W);
  D.ROLES.forEach((r, i) => {
    const y = top + i * (rowH + gap), x = 40, w = 1108;
    s += card(x, y, w, rowH, { shadow: r.now ? C.lime : C.yellow });
    if (r.now) s += chip('NOW', x + 26, y + 22, { size: 13, bg: C.ink, fg: C.lime, dot: C.lime, dotCls: 'pulse', h: 26 }).svg;
    else s += chip(r.year, x + 26, y + 22, { size: 13, bg: C.ink, fg: C.cream, h: 26 }).svg;
    s += text(r.company, x + 26, y + 92, { font: 'display', size: 38, fill: C.ink, maxW: 360 });
    s += text(r.role, x + 28, y + 118, { size: 14, fill: C.ink });
    s += text(r.period, x + 28, y + 136, { font: 'monoR', size: 12, fill: C.grey });
    const hx = x + 440;
    s += rect(hx - 26, y + 18, 3, rowH - 36, C.ink, ' opacity="0.15"');
    r.points.forEach((p, k) => { s += text('▸ ' + p, hx, y + 42 + k * 26, { font: 'monoR', size: 15, fill: C.ink }); });
    let cx = hx;
    r.chips.forEach((c, k) => {
      const ch = chip(c, cx, y + rowH - 44, { size: 12, bg: k === 0 ? (r.now ? C.lime : C.yellow) : C.cream, fg: C.ink, stroke: C.ink, sw: 2, h: 26 });
      s += ch.svg; cx += ch.w + 12;
    });
  });
  return svg(W, H, s, { title: 'Experience: ' + D.ROLES.map((r) => `${r.role} at ${r.company} (${r.period})`).join('; ') });
}

// ---- 03 builds ------------------------------------------------------------------
function strip(num, title, note, h = 110) {
  return svg(W, h, canvas(W, h) + heading(num, title, note, W, (h - 40) / 2 - 2), { title });
}

function projectCard(p, i) {
  const w = 600, h = 540;
  let s = canvas(w, h, 'g' + i);
  const ax = 30, ay = 30, aw = 540, ah = 337.5;
  s += rect(ax + 10, ay + 10, aw, ah, p.shadow);
  const art = outlineTexts(readFileSync(new URL(`../../assets/projects/${p.id}.svg`, import.meta.url), 'utf8').replace(/SAQLAINAP · ARENA/g, `SAQLAINAP · BUILD 0${i + 1}`));
  s += nest(art, ax, ay, aw, ah, 'p' + i, { preserve: 'xMidYMid slice' });
  s += `<rect x="${ax + 2}" y="${ay + 2}" width="${aw - 4}" height="${ah - 4}" fill="none" stroke="${C.cream}" stroke-width="4"/>`;
  s += `<g transform="translate(${ax - 10} ${ay - 12}) rotate(-4)">` + chip(`0${i + 1}`, 0, 0, { size: 15, bg: C.yellow, fg: C.ink, h: 30, padX: 10 }).svg + '</g>';
  let y = ay + ah + 44;
  s += text(p.name, ax, y, { font: 'display', size: 28, fill: C.cream });
  if (p.live) {
    const nx = ax + measure(p.name, { font: 'display', size: 28 }) + 16;
    s += chip('LIVE ↗', nx, y - 25, { size: 12, bg: C.lime, fg: C.ink, h: 26, dot: C.ink, dotCls: 'pulse' }).svg;
  }
  y += 32;
  for (const line of wrap(p.desc, aw, { font: 'monoR', size: 15 }).slice(0, 2)) { s += text(line, ax, y, { font: 'monoR', size: 15, fill: C.cream, opacity: 0.8 }); y += 23; }
  let cx = ax;
  p.stack.forEach((t) => { const c = chip(t, cx, h - 58, { size: 12, bg: C.ink, fg: C.cream, stroke: C.cream, sw: 2, h: 26 }); s += c.svg; cx += c.w + 10; });
  return svg(w, h, s, { title: `${p.name}: ${p.desc}` });
}

function alsoShipped() {
  const h = 90;
  let s = canvas(W, h);
  s += text('ALSO SHIPPED', 40, 54, { size: 15, fill: C.yellow, ls: 2 });
  let x = 40 + measure('ALSO SHIPPED', { size: 15, ls: 2 }) + 22;
  D.ALSO.forEach((n, i) => {
    s += text(n, x, 54, { size: 15, fill: C.cream }); x += measure(n, { size: 15 });
    if (i < D.ALSO.length - 1) { s += text(' · ', x, 54, { size: 15, fill: C.grey }); x += measure(' · ', { size: 15 }); }
  });
  s += chip('ALL REPOS ↗', W - 40 - measure('ALL REPOS ↗', { size: 13, ls: 1 }) - 24, 28, { size: 13, bg: C.lime, fg: C.ink, h: 30 }).svg;
  return svg(W, h, s, { title: 'Also shipped: ' + D.ALSO.join(', ') });
}

// ---- 04 toolbox -------------------------------------------------------------------
function toolbox() {
  const rowH = 70, top = 104;
  const H = top + D.TOOLBOX.length * rowH + 26;
  let s = canvas(W, H) + heading('04', 'TOOLBOX', '// stack.json', W);
  D.TOOLBOX.forEach(([label, ids, extra = []], r) => {
    const y = top + r * rowH;
    s += chip(label, 40, y + 12, { size: 13, bg: C.cream, fg: C.ink, h: 32, padX: 14 }).svg;
    let x = 250;
    ids.forEach((id) => {
      s += rect(x + 5, y + 5, 52, 52, C.lime);
      s += nest(icon(id), x, y, 52, 52, `i${r}-${id}`);
      x += 66;
    });
    extra.forEach((t) => { const c = chip(t, x + 4, y + 12, { size: 13, bg: C.ink, fg: C.cream, stroke: C.cream, sw: 2, h: 32 }); s += c.svg; x += c.w + 12; });
  });
  return svg(W, H, s, { title: 'Toolbox: ' + D.TOOLBOX.map(([l, ids, e = []]) => `${l}: ${[...ids, ...e].join(', ')}`).join('; ') });
}

// ---- 05 wins ------------------------------------------------------------------------
function wins() {
  const H = 650;
  let s = canvas(W, H) + heading('05', 'WINS & RECOGNITION', '// trophies.txt', W);
  // Big sticker.
  s += `<g transform="translate(52 108) rotate(-3)">`;
  s += card(0, 0, 320, 250, { fill: C.lime, shadow: C.cream, off: 12 });
  s += text('8×', 28, 158, { font: 'display', size: 140, fill: C.ink });
  s += text('HACKATHON', 30, 196, { size: 20, fill: C.ink, ls: 2 });
  s += text('WINS', 30, 232, { font: 'display', size: 34, fill: C.ink });
  s += '</g>';
  s += sparkle(360, 118, 30, C.yellow);
  s += `<g transform="translate(58 406) rotate(2)">` + card(0, 0, 310, 76, { fill: C.yellow, shadow: C.pink, off: 8 })
    + text('1ST PLACE', 20, 32, { size: 13, fill: C.ink, ls: 2 }) + text('DEBATE · SEMINAR · EXTEMPORE', 20, 58, { size: 14, fill: C.ink }) + '</g>';
  // Event list.
  const lx = 420, ly = 100, lw = 740, lh = 400;
  s += card(lx, ly, lw, lh, { shadow: C.yellow });
  s += rect(lx, ly, lw, 36, C.ink);
  s += text('EVENT', lx + 24, ly + 24, { size: 12, fill: C.cream, opacity: 0.7, ls: 2 });
  s += text('WHEN', lx + lw - 24, ly + 24, { size: 12, fill: C.cream, opacity: 0.7, ls: 2, anchor: 'end' });
  D.HACKATHONS.forEach(([name, when], i) => {
    const y = ly + 76 + i * 42;
    if (i % 2 === 0) s += rect(lx + 4, y - 27, lw - 8, 42, C.ink, ' opacity="0.045"');
    s += sparkle(lx + 34, y - 6, 9, C.ink);
    s += text(name, lx + 56, y, { size: 16, fill: C.ink });
    s += text(when, lx + lw - 24, y, { font: 'monoR', size: 15, fill: C.grey, anchor: 'end' });
  });
  // Scholarships & programs.
  const sy = 540;
  let fs = 17;
  const widthAt = (f) => D.SCHOLAR.reduce((a, [top, main]) => a + Math.max(measure(main, { font: 'display', size: f }), measure(top, { size: 11, ls: 1.5 })) + 36 + 26, -26);
  while (widthAt(fs) > W - 100 && fs > 12) fs -= 0.5;
  let x = 40;
  D.SCHOLAR.forEach(([top, main, bg, rot], i) => {
    const w = Math.max(measure(main, { font: 'display', size: fs }), measure(top, { size: 11, ls: 1.5 })) + 36;
    s += `<g transform="translate(${x} ${sy}) rotate(${rot})">` + card(0, 0, w, 70, { fill: bg, stroke: bg === C.ink ? C.cream : C.ink, sw: 3, shadow: bg === C.ink ? C.lime : C.cream, off: 7 })
      + text(top, 18, 27, { size: 11, fill: bg === C.ink ? C.lime : C.ink, ls: 1.5 })
      + text(main, 18, 53, { font: 'display', size: fs, fill: bg === C.ink ? C.cream : C.ink }) + '</g>';
    x += w + 26;
  });
  return svg(W, H, s, { title: 'Wins: 8 hackathons — ' + D.HACKATHONS.map((h) => h[0]).join(', ') + '. ' + D.SCHOLAR.map((h) => `${h[0]} ${h[1]}`).join(', ') });
}

// ---- 06 certifications (one clickable tile each) -----------------------------------------
function cert(c, i) {
  const w = 300, h = 150;
  let s = canvas(w, h, 'c' + i);
  s += card(18, 20, w - 48, h - 50, { shadow: c.shadow, off: 9 });
  const inner = w - 48 - 36;
  s += text(c.issuer, 36, 50, { size: 11, fill: C.grey, ls: 1.5, maxW: inner - 80 });
  s += text('VERIFY ↗', w - 44, 50, { size: 11, fill: C.ink, anchor: 'end' });
  s += text(c.title, 36, 84, { font: 'display', size: 24, fill: C.ink, maxW: inner });
  s += text(c.sub, 36, 106, { font: 'monoR', size: 11, fill: C.ink, maxW: inner });
  return svg(w, h, s, { title: `${c.title} — ${c.issuer} (click to verify)` });
}

// ---- buttons -------------------------------------------------------------------------------
function iconPath(b, x, y, s, fill) {
  if (b.icon === 'linkedin') return rect(x, y, s, s, fill, ' rx="3"') + text('in', x + s / 2, y + s * 0.8, { font: 'display', size: s * 0.72, fill: fill === C.ink ? C.cream : C.ink, anchor: 'middle' });
  if (b.icon === 'globe') return `<g fill="none" stroke="${fill}" stroke-width="2.4"><circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 2 - 1.2}"/><ellipse cx="${x + s / 2}" cy="${y + s / 2}" rx="${s * 0.2}" ry="${s / 2 - 1.2}"/><path d="M${x + 1.5} ${y + s / 2} H${x + s - 1.5}"/></g>`;
  if (b.icon === 'resume') return `<path d="M${x + 3} ${y} h${s * 0.55} l${s * 0.3} ${s * 0.3} v${s * 0.7} h-${s * 0.85} z" fill="none" stroke="${fill}" stroke-width="2.4"/>` + [0.45, 0.62, 0.79].map((f) => rect(x + 7, y + s * f, s * 0.5, 2.4, fill)).join('');
  const src = icon('si-' + b.icon).replace(/fill="#[0-9a-fA-F]+"/, `fill="${fill}"`);
  return nest(src, x, y, s, s, 'b-' + b.icon);
}
function button(b, { small = false } = {}) {
  const h = small ? 40 : 50, size = small ? 13 : 15, is = small ? 18 : 22, off = small ? 5 : 6;
  const tw = measure(b.label, { size, ls: 1.5 });
  const w = Math.round(16 + is + 10 + tw + 18);
  let s = card(0, 0, w, h, { fill: b.fill || C.cream, sw: 3, shadow: b.shadow || C.yellow, off });
  s += iconPath(b, 16, (h - is) / 2, is, C.ink);
  s += text(b.label, 16 + is + 10, h / 2 + size * 0.36, { size, fill: C.ink, ls: 1.5 });
  return svg(w + off, h + off, s, { title: b.label });
}

// ---- footer ----------------------------------------------------------------------------------
function footer() {
  const H = 150;
  let s = canvas(W, H);
  const band = 'VOICE AI ✦ RAG ✦ AGENTIC SYSTEMS ✦ MCP ✦ CLOUD NATIVE ✦ KUBERNETES ✦ FULL STACK ✦ ';
  // Build one ticker unit with sparkles drawn as paths, then repeat it twice for a seamless loop.
  const parts = band.split('✦').map((p) => p.trim()).filter(Boolean);
  let unit = '', x = 0;
  for (const p of parts) {
    unit += text(p, x, 0, { font: 'display', size: 22, fill: C.ink }); x += measure(p, { font: 'display', size: 22 }) + 22;
    unit += sparkle(x, -8, 9, C.ink); x += 31;
  }
  const uw = x;
  s += rect(0, 20, W, 58, C.yellow) + rect(0, 20, W, 4, C.ink);
  s += `<g class="ticker" style="animation: ticker ${Math.round(uw / 60)}s linear infinite">`;
  for (let k = 0; k * uw < W + uw; k++) s += `<g transform="translate(${k * uw} 58)">${unit}</g>`;
  s += '</g>';
  s += text('BUILT IN BANGALORE', 40, 122, { size: 14, fill: C.cream, ls: 2 });
  s += text('© 2026 SAQLAIN AHMED P', W / 2, 122, { size: 14, fill: C.dim, anchor: 'middle', ls: 2 });
  s += text('THANKS FOR SCROLLING', W - 40 - 26, 122, { size: 14, fill: C.lime, anchor: 'end', ls: 2 });
  s += rect(W - 40 - 14, 106, 12, 20, C.lime, ' class="blink"');
  return svg(W, H, s, { title: 'Voice AI, RAG, agentic systems, MCP, cloud native, Kubernetes, full stack. Built in Bangalore.', style: `@keyframes ticker { to { transform: translateX(-${Math.round(uw)}px); } }` });
}

// ---- write -----------------------------------------------------------------------------------
write('sections/whoami.svg', whoami());
write('sections/experience.svg', experience());
write('sections/builds.svg', strip('03', 'FEATURED BUILDS', '// 6 of 65 public repos'));
D.PROJECTS.forEach((p, i) => write(`cards/${p.id}.svg`, projectCard(p, i)));
write('sections/also.svg', alsoShipped());
write('sections/toolbox.svg', toolbox());
write('sections/wins.svg', wins());
write('sections/certs.svg', strip('06', 'CERTIFIED', '// click a card to verify'));
D.CERTS.forEach((c, i) => write(`certs/${c.id}.svg`, cert(c, i)));
write('sections/elsewhere.svg', strip('08', 'ELSEWHERE', '// say hi'));
D.LINKS.forEach((b) => write(`buttons/${b.id}.svg`, button(b)));
D.SOCIALS.forEach((b) => write(`buttons/${b.id}.svg`, button(b, { small: true })));
write('sections/footer.svg', footer());
