// Live stats panel -> ../../assets/pulse.svg. Run daily by .github/workflows/pulse.yml.
//   GH_PULSE=<github credential> node tools/readme/pulse.mjs
// Replaces third-party stat cards so the numbers use the same design system.

import { writeFileSync } from 'node:fs';
import { C, text, measure, rect, card, chip, sparkle, canvas, heading, svg } from './lib.mjs';

const LOGIN = 'SAQLAINAP';
const cred = process.env.GH_PULSE;
if (!cred) { console.error('GH_PULSE is not set'); process.exit(1); }

const QUERY = `query($login: String!) {
  user(login: $login) {
    followers { totalCount }
    all: repositories(ownerAffiliations: OWNER, privacy: PUBLIC) { totalCount }
    own: repositories(ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, first: 100) {
      nodes { stargazerCount languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } } }
    }
    contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } }
  }
}`;

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + cred, 'Content-Type': 'application/json', 'User-Agent': 'saqlainap-readme-pulse' },
  body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
});
const json = await res.json();
if (!res.ok || json.errors) { console.error(JSON.stringify(json.errors || json)); process.exit(1); }
const u = json.data.user;

const stars = u.own.nodes.reduce((a, r) => a + r.stargazerCount, 0);
const cal = u.contributionsCollection.contributionCalendar;
const days = cal.weeks.flatMap((w) => w.contributionDays);
const today = new Date().toISOString().slice(0, 10);
let current = 0, longest = 0, run = 0;
for (const d of days) { run = d.contributionCount > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
for (let i = days.length - 1; i >= 0; i--) {
  if (days[i].contributionCount > 0) current++;
  else if (days[i].date === today && current === 0) continue; // today isn't over yet
  else break;
}
const langs = {};
for (const r of u.own.nodes) for (const e of r.languages.edges) langs[e.node.name] = (langs[e.node.name] || 0) + e.size;
const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
const top = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 5);
const other = 1 - top.reduce((a, [, v]) => a + v, 0) / total;

// ---- render ---------------------------------------------------------------------
const W = 1200, H = 520;
let s = canvas(W, H) + heading('07', 'GITHUB PULSE', `// refreshed ${today}`, W);
const tiles = [
  ['PUBLIC REPOS', u.all.totalCount, C.yellow],
  ['STARS EARNED', stars, C.lime],
  ['FOLLOWERS', u.followers.totalCount, C.pink],
  ['CONTRIBUTIONS · 1Y', cal.totalContributions, C.cyan],
];
const tw = 257, tg = 26;
tiles.forEach(([label, n, sh], i) => {
  const x = 40 + i * (tw + tg), y = 100;
  s += card(x, y, tw, 124, { shadow: sh, off: 10 });
  s += text(label, x + 22, y + 34, { size: 12, fill: C.grey, ls: 1.5 });
  s += text(n.toLocaleString('en-US'), x + 20, y + 96, { font: 'display', size: 52, fill: C.ink });
});

// Heatmap: last 26 weeks.
const hx = 40, hy = 262, hw = 560, hh = 214;
s += card(hx, hy, hw, hh, { shadow: C.yellow, off: 10 });
s += text('LAST 26 WEEKS', hx + 22, hy + 32, { size: 12, fill: C.grey, ls: 1.5 });
const weeks = cal.weeks.slice(-26);
const levels = ['#ebe1d3', '#e7eea4', '#d1e030', '#98a61a', '#14160d'];
const maxC = Math.max(1, ...weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)));
const cell = 16, gapC = 3.5, gx = hx + 24, gy = hy + 50;
weeks.forEach((w, wi) => {
  w.contributionDays.forEach((d) => {
    const dow = new Date(d.date + 'T00:00:00Z').getUTCDay();
    const c = d.contributionCount;
    const lvl = c === 0 ? 0 : Math.min(4, 1 + Math.floor((c / maxC) * 3.999));
    s += rect(gx + wi * (cell + gapC), gy + dow * (cell + gapC), cell, cell, levels[lvl]);
  });
  const first = w.contributionDays[0];
  if (first && first.date.slice(8) <= '07') {
    const m = new Date(first.date + 'T00:00:00Z').toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
    s += text(m, gx + wi * (cell + gapC), gy + 7 * (cell + gapC) + 14, { size: 10, fill: C.grey });
  }
});
s += text('LESS', hx + hw - 180, hy + 32, { size: 10, fill: C.grey, anchor: 'end' });
levels.forEach((c, i) => { s += rect(hx + hw - 170 + i * 20, hy + 20, 14, 14, c); });
s += text('MORE', hx + hw - 22, hy + 32, { size: 10, fill: C.grey, anchor: 'end' });

// Streak sticker.
s += `<g transform="translate(628 268) rotate(-2)">` + card(0, 0, 230, 200, { fill: C.lime, shadow: C.cream, off: 10 })
  + text('CURRENT STREAK', 20, 34, { size: 12, fill: C.ink, ls: 1.5 })
  + text(String(current), 18, 110, { font: 'display', size: 72, fill: C.ink })
  + text(current === 1 ? 'DAY' : 'DAYS', 24 + measure(String(current), { font: 'display', size: 72 }), 108, { size: 16, fill: C.ink })
  + rect(20, 132, 190, 3, C.ink)
  + text(`LONGEST · ${longest} DAYS`, 20, 168, { size: 13, fill: C.ink }) + '</g>';
s += sparkle(846, 268, 20, C.yellow, 'pulse');

// Languages.
const lx = 888, ly = 262, lw = 272, lh = 214;
s += card(lx, ly, lw, lh, { shadow: C.pink, off: 10 });
s += text('TOP LANGUAGES', lx + 20, ly + 32, { size: 12, fill: C.grey, ls: 1.5 });
const pal = [C.yellow, C.lime, C.pink, C.cyan, C.violet];
let bx = lx + 20; const bw = lw - 40;
top.forEach(([, v], i) => { const w = bw * v / total; s += rect(bx, ly + 46, w, 18, pal[i]); bx += w; });
if (other > 0) s += rect(bx, ly + 46, bw * other, 18, C.tan);
s += `<rect x="${lx + 19}" y="${ly + 45}" width="${bw + 2}" height="20" fill="none" stroke="${C.ink}" stroke-width="2"/>`;
top.forEach(([name, v], i) => {
  const y = ly + 92 + i * 24;
  s += rect(lx + 20, y - 11, 12, 12, pal[i]) + `<rect x="${lx + 20}" y="${y - 11}" width="12" height="12" fill="none" stroke="${C.ink}" stroke-width="1.5"/>`;
  s += text(name.toUpperCase(), lx + 42, y, { size: 13, fill: C.ink, maxW: 150 });
  s += text(`${(100 * v / total).toFixed(1)}%`, lx + lw - 20, y, { font: 'monoR', size: 13, fill: C.ink, anchor: 'end' });
});

const out = svg(W, H, s, { title: `GitHub pulse: ${u.all.totalCount} public repos, ${stars} stars, ${u.followers.totalCount} followers, ${cal.totalContributions} contributions in the last year, current streak ${current} days, longest ${longest} days. Top languages: ${top.map(([n, v]) => `${n} ${(100 * v / total).toFixed(0)}%`).join(', ')}.` });
writeFileSync(new URL('../../assets/pulse.svg', import.meta.url), out);
console.log(`pulse.svg: repos ${u.all.totalCount}, stars ${stars}, followers ${u.followers.totalCount}, contribs ${cal.totalContributions}, streak ${current}/${longest}, top ${top.map((t) => t[0]).join(',')}`);
