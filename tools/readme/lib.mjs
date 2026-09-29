// Shared design system for the README panels. Mirrors assets/header.svg:
// ink canvas + 40px grid, cream cards with 4px ink borders, hard offset
// shadows, mono labels, heavy display type and sparkles.
//
// All text is converted to outlines with opentype.js, because GitHub serves
// README SVGs as <img> and they can't load web fonts. Outlines render
// identically on every OS.

import opentype from 'opentype.js';
import { readFileSync } from 'node:fs';

const here = (p) => new URL(p, import.meta.url);
const loadFont = (f) => {
  const b = readFileSync(here(`./fonts/${f}`));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
export const FONTS = {
  display: loadFont('ArchivoBlack-Regular.ttf'),
  mono: loadFont('JetBrainsMono-Bold.ttf'),
  monoR: loadFont('JetBrainsMono-Regular.ttf'),
};

export const C = {
  ink: '#14160d', cream: '#fff4ec', yellow: '#fbd535', lime: '#d1e030', green: '#9eef80',
  pink: '#ec4899', cyan: '#22d3ee', violet: '#8b5cf6', orange: '#f97316', red: '#ff5c5c',
  grey: '#8a8a7a', tan: '#e6d5c1', dim: 'rgba(255,244,236,0.55)',
};

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r1 = (n) => Math.round(n * 10) / 10;

// ---- text -------------------------------------------------------------------
function glyphRuns(str, fontKey) {
  // Per-character fallback: display -> mono, so arrows etc. still render.
  const primary = FONTS[fontKey];
  const out = [];
  for (const ch of str) {
    let f = primary;
    if (f.charToGlyphIndex(ch) === 0 && FONTS.mono.charToGlyphIndex(ch) !== 0) f = FONTS.mono;
    out.push({ ch, f });
  }
  return out;
}

export function measure(str, { font = 'mono', size = 16, ls = 0 } = {}) {
  let w = 0;
  const runs = glyphRuns(str, font);
  runs.forEach(({ ch, f }, i) => {
    w += f.getAdvanceWidth(ch, size, { kerning: false });
    if (i < runs.length - 1) {
      if (ls) w += ls;
      else if (f === runs[i + 1].f) w += f.getKerningValue(f.charToGlyph(ch), f.charToGlyph(runs[i + 1].ch)) * size / f.unitsPerEm;
    }
  });
  return w;
}

// Returns an SVG <path> of the outlined text. anchor: start | middle | end.
export function text(str, x, y, { font = 'mono', size = 16, fill = C.ink, ls = 0, anchor = 'start', opacity, cls, maxW } = {}) {
  if (maxW) { const w = measure(str, { font, size, ls }); if (w > maxW) size = size * maxW / w; }
  const w = measure(str, { font, size, ls });
  let cx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const runs = glyphRuns(str, font);
  let d = '';
  runs.forEach(({ ch, f }, i) => {
    d += f.getPath(ch, cx, y, size).toPathData(1);
    cx += f.getAdvanceWidth(ch, size);
    if (i < runs.length - 1) {
      if (ls) cx += ls;
      else if (f === runs[i + 1].f) cx += f.getKerningValue(f.charToGlyph(ch), f.charToGlyph(runs[i + 1].ch)) * size / f.unitsPerEm;
    }
  });
  const attrs = [`d="${d}"`, `fill="${fill}"`];
  if (opacity != null) attrs.push(`opacity="${opacity}"`);
  if (cls) attrs.push(`class="${cls}"`);
  return `<path ${attrs.join(' ')}/>`;
}

// Greedy word wrap by measured width.
export function wrap(str, maxW, opt) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (measure(next, opt) > maxW && cur) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---- primitives ---------------------------------------------------------------
export const rect = (x, y, w, h, fill, extra = '') => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}"${extra}/>`;

// Brutalist card: hard offset shadow, fill, 4px border drawn inside the box.
export function card(x, y, w, h, { fill = C.cream, stroke = C.ink, sw = 4, shadow = C.yellow, off = 12 } = {}) {
  let s = '';
  if (shadow) s += rect(x + off, y + off, w, h, shadow);
  s += rect(x, y, w, h, fill);
  if (stroke) s += `<rect x="${r1(x + sw / 2)}" y="${r1(y + sw / 2)}" width="${r1(w - sw)}" height="${r1(h - sw)}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>`;
  return s;
}

// Mono chip; returns { svg, w, h }.
export function chip(label, x, y, { size = 14, fg = C.ink, bg = C.lime, stroke, sw = 3, padX = 12, h, font = 'mono', ls = 1, shadow, off = 6, dot, dotCls } = {}) {
  const tw = measure(label, { font, size, ls });
  const hh = h ?? Math.round(size * 2.05);
  const dotW = dot ? size * 1.05 : 0;
  const w = tw + padX * 2 + dotW;
  let s = '';
  if (shadow) s += rect(x + off, y + off, w, hh, shadow);
  s += rect(x, y, w, hh, bg);
  if (stroke) s += `<rect x="${r1(x + sw / 2)}" y="${r1(y + sw / 2)}" width="${r1(w - sw)}" height="${r1(hh - sw)}" fill="none" stroke="${stroke}" stroke-width="${sw}"/>`;
  if (dot) s += `<circle cx="${r1(x + padX + size * 0.32)}" cy="${r1(y + hh / 2)}" r="${r1(size * 0.3)}" fill="${dot}"${dotCls ? ` class="${dotCls}"` : ''}/>`;
  s += text(label, x + padX + dotW, y + hh / 2 + size * 0.36, { font, size, fill: fg, ls });
  return { svg: s, w, h: hh };
}

export function sparkle(x, y, r, fill, cls) {
  const c = r * 0.16;
  return `<path${cls ? ` class="${cls}"` : ''} d="M${r1(x)} ${r1(y - r)} Q${r1(x + c)} ${r1(y - c)} ${r1(x + r)} ${r1(y)} Q${r1(x + c)} ${r1(y + c)} ${r1(x)} ${r1(y + r)} Q${r1(x - c)} ${r1(y + c)} ${r1(x - r)} ${r1(y)} Q${r1(x - c)} ${r1(y - c)} ${r1(x)} ${r1(y - r)} Z" fill="${fill}"/>`;
}

export function check(x, y, s, stroke = C.ink, sw = 4) {
  return `<path d="M${r1(x)} ${r1(y + s * 0.55)} L${r1(x + s * 0.38)} ${r1(y + s * 0.9)} L${r1(x + s)} ${r1(y + s * 0.1)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="square"/>`;
}

// Ink canvas with the header's 40px grid.
export function canvas(w, h, id = 'grid') {
  return `<defs><pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 L0 0 0 40" fill="none" stroke="#fff4ec" stroke-opacity="0.06" stroke-width="1"/></pattern></defs>`
    + rect(0, 0, w, h, C.ink) + rect(0, 0, w, h, 'url(#' + id + ')');
}

// Section heading used at the top of every panel: [01] TITLE ........ // note
export function heading(num, title, note, w, y = 34) {
  let s = rect(40, y, 54, 40, C.yellow);
  s += text(num, 67, y + 27, { font: 'mono', size: 18, fill: C.ink, anchor: 'middle' });
  s += text(title, 112, y + 32, { font: 'display', size: 30, fill: C.cream, ls: 1 });
  if (note) s += text(note, w - 40, y + 28, { font: 'mono', size: 14, fill: C.dim, anchor: 'end' });
  return s;
}

// Motion shared by every panel. Elements are visible by default; animations
// only add movement, so static renderers still show the finished design.
export const MOTION = `
  .blink { animation: blink 1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  .pulse { animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 50% { opacity: .25; } }
  @media (prefers-reduced-motion: reduce) { .blink, .pulse, .ticker { animation: none; } }
`;

export function svg(w, h, body, { title, style = '' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">`
    + `<title>${esc(title)}</title><style>${MOTION}${style}</style>${body}</svg>\n`;
}

// Inline a third-party SVG (icons, project art) as a nested <svg>, with ids
// namespaced so several can live in one document.
export function nest(src, x, y, w, h, ns, { preserve = 'xMidYMid meet' } = {}) {
  let s = src.replace(/<\?xml[^>]*>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<title>[\s\S]*?<\/title>/g, '');
  const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) {
    const re = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    s = s.replace(new RegExp(`id="${re}"`, 'g'), `id="${ns}-${id}"`)
      .replace(new RegExp(`url\\(#${re}\\)`, 'g'), `url(#${ns}-${id})`)
      .replace(new RegExp(`href="#${re}"`, 'g'), `href="#${ns}-${id}"`);
  }
  const m = s.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/);
  const attrs = m[1], inner = m[2];
  const vb = (attrs.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 24 24';
  const keep = ['fill', 'shape-rendering'].map((a) => { const v = attrs.match(new RegExp(`\\b${a}="([^"]+)"`)); return v ? ` ${a}="${v[1]}"` : ''; }).join('');
  return `<svg x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" viewBox="${vb}" preserveAspectRatio="${preserve}"${keep}>${inner}</svg>`;
}

// Replace <text> elements inside third-party art with outlines in our fonts.
// Walks <g> nesting so inherited font-size / letter-spacing / text-anchor apply.
export function outlineTexts(src) {
  const decode = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
  const INHERIT = ['font-size', 'letter-spacing', 'text-anchor'];
  const pick = (attrs, k) => (attrs.match(new RegExp(`\\b${k}="([^"]*)"`)) || [])[1];
  const stack = [{}];
  return src.replace(/<g\b([^>]*?)(\/?)>|<\/g>|<text\b([^>]*)>([\s\S]*?)<\/text>/g, (m, gAttrs, selfClose, tAttrs, content) => {
    if (m.startsWith('</g')) { if (stack.length > 1) stack.pop(); return m; }
    if (gAttrs !== undefined) {
      if (!selfClose) { const top = { ...stack[stack.length - 1] }; for (const k of INHERIT) { const v = pick(gAttrs, k); if (v != null) top[k] = v; } stack.push(top); }
      return m;
    }
    const inh = stack[stack.length - 1];
    const a = (k) => pick(tAttrs, k) ?? inh[k];
    const str = decode(content.replace(/<[^>]+>/g, '')).trim();
    const size = +(a('font-size') || 16);
    const display = size >= 40;
    return text(str, +(pick(tAttrs, 'x') || 0), +(pick(tAttrs, 'y') || 0), {
      font: display ? 'display' : 'mono', size: display ? size * 0.86 : size * 0.92,
      fill: pick(tAttrs, 'fill') || 'currentColor', ls: +(a('letter-spacing') || 0),
      anchor: a('text-anchor') || 'start', opacity: pick(tAttrs, 'opacity'), maxW: display ? 390 : undefined,
    }).replace('fill="currentColor"', '').replace('<path ', '<path stroke="none" ');
  });
}
