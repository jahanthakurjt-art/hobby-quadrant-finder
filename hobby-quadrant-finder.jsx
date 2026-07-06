import { useState, useMemo, useEffect, useRef } from "react";

// ---------- Hobby database ----------
// traits: energy (pace), creative, outdoor, structure, physical (bodily demand) — 0-100
// social: 0-100 → Y axis (likelihood of meeting people)
// cost: 0-100 (free → expensive) · time: 0-100 (one-off → serious commitment)
const HOBBIES = [
  { name: "Salsa dancing", q: "salsa classes near me", energy: 75, creative: 55, outdoor: 10, structure: 60, physical: 70, social: 90, cost: 45, time: 55 },
  { name: "Bachata", q: "bachata classes near me", energy: 65, creative: 60, outdoor: 10, structure: 55, physical: 65, social: 90, cost: 45, time: 55 },
  { name: "Social dancing", q: "social dance classes near me", energy: 60, creative: 55, outdoor: 10, structure: 50, physical: 60, social: 95, cost: 40, time: 45 },
  { name: "Swing dancing", q: "swing dancing classes near me", energy: 70, creative: 60, outdoor: 5, structure: 55, physical: 65, social: 90, cost: 45, time: 55 },
  { name: "Board game meetup", q: "board game meetup near me", energy: 30, creative: 55, outdoor: 5, structure: 70, physical: 5, social: 85, cost: 15, time: 40 },
  { name: "Five-a-side football", q: "five a side football near me", energy: 90, creative: 20, outdoor: 80, structure: 75, physical: 95, social: 90, cost: 35, time: 60 },
  { name: "Tag rugby", q: "tag rugby league near me", energy: 85, creative: 20, outdoor: 90, structure: 70, physical: 85, social: 90, cost: 30, time: 60 },
  { name: "Touch rugby", q: "touch rugby near me", energy: 80, creative: 20, outdoor: 90, structure: 70, physical: 80, social: 90, cost: 30, time: 60 },
  { name: "Ultimate frisbee", q: "ultimate frisbee near me", energy: 85, creative: 30, outdoor: 95, structure: 60, physical: 85, social: 90, cost: 25, time: 60 },
  { name: "Netball", q: "social netball league near me", energy: 80, creative: 20, outdoor: 40, structure: 75, physical: 80, social: 90, cost: 30, time: 60 },
  { name: "Volleyball", q: "volleyball club near me", energy: 75, creative: 25, outdoor: 50, structure: 65, physical: 75, social: 90, cost: 30, time: 55 },
  { name: "Dodgeball", q: "dodgeball league near me", energy: 80, creative: 30, outdoor: 10, structure: 55, physical: 75, social: 90, cost: 30, time: 55 },
  { name: "Padel", q: "padel courts near me", energy: 70, creative: 25, outdoor: 60, structure: 65, physical: 70, social: 85, cost: 55, time: 45 },
  { name: "Social sports league", q: "social sports league near me", energy: 70, creative: 25, outdoor: 50, structure: 60, physical: 70, social: 95, cost: 40, time: 55 },
  { name: "Roundnet", q: "roundnet spikeball group near me", energy: 80, creative: 30, outdoor: 90, structure: 50, physical: 80, social: 85, cost: 15, time: 40 },
  { name: "Pickleball", q: "pickleball near me", energy: 65, creative: 25, outdoor: 60, structure: 65, physical: 60, social: 90, cost: 30, time: 45 },
  { name: "Hyrox", q: "hyrox training near me", energy: 95, creative: 10, outdoor: 20, structure: 85, physical: 100, social: 70, cost: 70, time: 85 },
  { name: "CrossFit", q: "crossfit gym near me", energy: 90, creative: 15, outdoor: 15, structure: 85, physical: 95, social: 80, cost: 80, time: 80 },
  { name: "Bouldering", q: "bouldering gym near me", energy: 80, creative: 35, outdoor: 30, structure: 40, physical: 90, social: 70, cost: 60, time: 55 },
  { name: "Pottery class", q: "pottery class near me", energy: 25, creative: 90, outdoor: 5, structure: 55, physical: 25, social: 65, cost: 65, time: 50 },
  { name: "Life drawing", q: "life drawing class near me", energy: 20, creative: 95, outdoor: 5, structure: 50, physical: 5, social: 60, cost: 40, time: 40 },
  { name: "Book club", q: "book club near me", energy: 15, creative: 60, outdoor: 5, structure: 60, physical: 5, social: 75, cost: 10, time: 45 },
  { name: "Lectures & talks", q: "public lectures and talks near me", energy: 15, creative: 55, outdoor: 5, structure: 70, physical: 5, social: 60, cost: 15, time: 20 },
  { name: "Parkrun", q: "parkrun near me", energy: 85, creative: 10, outdoor: 95, structure: 65, physical: 95, social: 70, cost: 0, time: 45 },
  { name: "Improv comedy", q: "improv comedy class near me", energy: 70, creative: 90, outdoor: 5, structure: 30, physical: 40, social: 95, cost: 50, time: 60 },
  { name: "Language exchange", q: "language exchange meetup near me", energy: 30, creative: 50, outdoor: 10, structure: 40, physical: 5, social: 90, cost: 5, time: 45 },
  { name: "Cooking class", q: "cooking class near me", energy: 40, creative: 75, outdoor: 5, structure: 65, physical: 30, social: 70, cost: 60, time: 30 },
  { name: "Volunteering", q: "volunteering opportunities near me", energy: 50, creative: 40, outdoor: 50, structure: 55, physical: 45, social: 85, cost: 0, time: 55 },
  { name: "Hiking group", q: "hiking group near me", energy: 70, creative: 25, outdoor: 100, structure: 50, physical: 85, social: 75, cost: 15, time: 55 },
  { name: "Foraging walks", q: "foraging walks near me", energy: 40, creative: 50, outdoor: 100, structure: 45, physical: 55, social: 65, cost: 30, time: 25 },
  { name: "Choir", q: "community choir near me", energy: 45, creative: 70, outdoor: 5, structure: 70, physical: 20, social: 90, cost: 20, time: 65 },
  { name: "Martial arts", q: "martial arts classes near me", energy: 85, creative: 30, outdoor: 20, structure: 85, physical: 95, social: 70, cost: 50, time: 75 },
  { name: "Tabletop wargaming", q: "wargaming club near me", energy: 25, creative: 70, outdoor: 5, structure: 65, physical: 5, social: 70, cost: 55, time: 65 },
  { name: "Chess club", q: "chess club near me", energy: 15, creative: 50, outdoor: 0, structure: 80, physical: 5, social: 70, cost: 10, time: 50 },
  { name: "Pub quiz team", q: "pub quiz near me", energy: 30, creative: 45, outdoor: 5, structure: 55, physical: 5, social: 90, cost: 15, time: 35 },
  { name: "Community theatre", q: "community theatre near me", energy: 60, creative: 90, outdoor: 5, structure: 60, physical: 50, social: 95, cost: 20, time: 80 },
  { name: "Creative writing group", q: "creative writing group near me", energy: 15, creative: 95, outdoor: 0, structure: 50, physical: 5, social: 65, cost: 10, time: 50 },
  { name: "Cycling club", q: "cycling club near me", energy: 80, creative: 15, outdoor: 95, structure: 60, physical: 90, social: 70, cost: 65, time: 65 },
  { name: "Photography walks", q: "photography walk group near me", energy: 40, creative: 85, outdoor: 85, structure: 35, physical: 50, social: 55, cost: 50, time: 40 },
  { name: "Escape rooms", q: "escape rooms near me", energy: 55, creative: 60, outdoor: 5, structure: 60, physical: 25, social: 85, cost: 55, time: 15 },
  { name: "VR gaming", q: "VR arcade near me", energy: 60, creative: 45, outdoor: 0, structure: 40, physical: 55, social: 60, cost: 45, time: 25 },
  { name: "Paint & sip night", q: "paint and sip near me", energy: 35, creative: 90, outdoor: 5, structure: 55, physical: 15, social: 85, cost: 50, time: 15 },
  { name: "Yoga / Pilates class", q: "yoga and pilates classes near me", energy: 45, creative: 30, outdoor: 15, structure: 70, physical: 55, social: 60, cost: 45, time: 55 },
  { name: "Swimming", q: "swimming pool near me", energy: 70, creative: 10, outdoor: 30, structure: 60, physical: 90, social: 35, cost: 25, time: 50 },
  { name: "Swimming club", q: "swimming club near me", energy: 75, creative: 10, outdoor: 30, structure: 75, physical: 90, social: 75, cost: 35, time: 65 },
  { name: "Rowing club", q: "rowing club near me", energy: 85, creative: 10, outdoor: 80, structure: 85, physical: 95, social: 80, cost: 45, time: 85 },
  { name: "Pub crawl", q: "pub crawl near me", energy: 55, creative: 30, outdoor: 30, structure: 20, physical: 30, social: 95, cost: 55, time: 15 },
  { name: "Solo running", q: "running routes near me", energy: 85, creative: 10, outdoor: 90, structure: 55, physical: 95, social: 15, cost: 10, time: 50 },
  { name: "Stargazing", q: "stargazing spots near me", energy: 15, creative: 45, outdoor: 95, structure: 35, physical: 15, social: 30, cost: 20, time: 25 },
  { name: "Reading", q: "library near me", energy: 5, creative: 55, outdoor: 5, structure: 30, physical: 0, social: 5, cost: 10, time: 40 },
  { name: "Video games", q: "gaming cafe near me", energy: 15, creative: 45, outdoor: 0, structure: 35, physical: 5, social: 20, cost: 45, time: 45 },
  { name: "Painting at home", q: "art supplies shop near me", energy: 15, creative: 95, outdoor: 5, structure: 30, physical: 10, social: 5, cost: 30, time: 45 },
  { name: "Gardening", q: "garden centre near me", energy: 45, creative: 55, outdoor: 95, structure: 55, physical: 60, social: 15, cost: 30, time: 55 },
  { name: "Miniature painting", q: "miniature painting near me", energy: 15, creative: 90, outdoor: 0, structure: 60, physical: 10, social: 15, cost: 45, time: 55 },
  { name: "Model building", q: "model hobby shop near me", energy: 20, creative: 80, outdoor: 0, structure: 75, physical: 10, social: 10, cost: 40, time: 50 },
  { name: "Learning an instrument", q: "music lessons near me", energy: 35, creative: 80, outdoor: 5, structure: 75, physical: 15, social: 20, cost: 55, time: 75 },
  { name: "Baking", q: "baking supplies near me", energy: 30, creative: 75, outdoor: 0, structure: 70, physical: 25, social: 10, cost: 25, time: 40 },
  { name: "Coding projects", q: "hackathon near me", energy: 20, creative: 65, outdoor: 0, structure: 70, physical: 5, social: 10, cost: 5, time: 60 },
  { name: "Fishing", q: "fishing spots near me", energy: 30, creative: 15, outdoor: 95, structure: 45, physical: 30, social: 25, cost: 45, time: 45 },
  { name: "Jigsaw puzzles", q: "puzzle exchange near me", energy: 15, creative: 40, outdoor: 0, structure: 80, physical: 5, social: 10, cost: 15, time: 40 },
];

const SLIDERS = [
  { key: "extroversion", left: "Introvert", right: "Extrovert", def: 50, url: "ex" },
  { key: "physical", left: "Sedentary", right: "Physical", def: 50, url: "ph" },
  { key: "energy", left: "Chilled", right: "High energy", def: 50, url: "en" },
  { key: "creative", left: "Practical", right: "Creative", def: 50, url: "cr" },
  { key: "outdoor", left: "Indoors", right: "Outdoors", def: 50, url: "ou" },
  { key: "structure", left: "Spontaneous", right: "Structured", def: 50, url: "st" },
];

const OPTIONAL = [
  { key: "budget", flag: "useBudget", left: "Free & cheap", right: "Happy to spend", tick: "Consider budget", def: 50, url: "bu", flagUrl: "fb" },
  { key: "time", flag: "useTime", left: "One-off tasters", right: "Regular commitment", tick: "Consider time", def: 50, url: "ti", flagUrl: "ft" },
];

const QUAD = {
  ES: { hue: "#5EDBA5" }, EN: { hue: "#6BA8F5" },
  DS: { hue: "#F0796E" }, DN: { hue: "#E8B44F" },
};

function scoreHobby(h, u, opts) {
  const terms = [
    [Math.abs(u.energy - h.energy), 0.8],
    [Math.abs(u.creative - h.creative), 1],
    [Math.abs(u.outdoor - h.outdoor), 1],
    [Math.abs(u.structure - h.structure), 0.7],
    [Math.abs(u.physical - h.physical), 1.3],
    [Math.abs(u.extroversion - h.social), 0.9],
  ];
  // asymmetric: only penalise hobbies that demand MORE money/time than offered
  if (opts.useBudget) terms.push([Math.max(0, h.cost - u.budget), 1.1]);
  if (opts.useTime) terms.push([Math.max(0, h.time - u.time), 1.0]);
  const num = terms.reduce((s, [d, w]) => s + d * w, 0);
  const den = terms.reduce((s, [, w]) => s + w, 0);
  return 100 - num / den;
}

function explain(h, u) {
  const traits = [
    { k: "energy", lo: "relaxed pace", hi: "lively pace" },
    { k: "creative", lo: "practical streak", hi: "creative streak" },
    { k: "outdoor", lo: "indoor leanings", hi: "outdoorsy side" },
    { k: "structure", lo: "spontaneous side", hi: "love of structure" },
    { k: "physical", lo: "low-impact preference", hi: "physical side" },
  ];
  const best = traits
    .map((t) => ({ t, d: Math.abs(u[t.k] - h[t.k]) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .map(({ t }) => (h[t.k] >= 50 ? t.hi : t.lo));
  const scene =
    h.social >= 80 ? "a big social scene" :
    h.social >= 50 ? "a friendly small-group scene" :
    "a mostly solo pursuit";
  return `Fits your ${best[0]} and ${best[1]}, and it's ${scene}.`;
}

// storage that degrades gracefully where localStorage is unavailable
const store = {
  get() { try { return JSON.parse(localStorage.getItem("hq-shortlist") || "[]"); } catch { return []; } },
  set(v) { try { localStorage.setItem("hq-shortlist", JSON.stringify(v)); } catch { /* in-memory only */ } },
};

function readUrl() {
  try {
    const p = new URLSearchParams(window.location.search);
    const num = (k, def) => {
      const v = parseInt(p.get(k), 10);
      return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : def;
    };
    const u = {};
    SLIDERS.forEach((s) => (u[s.key] = num(s.url, s.def)));
    OPTIONAL.forEach((o) => (u[o.key] = num(o.url, o.def)));
    return {
      u,
      showSolo: p.get("solo") === "1",
      useBudget: p.get("fb") === "1",
      useTime: p.get("ft") === "1",
    };
  } catch {
    const u = {};
    SLIDERS.forEach((s) => (u[s.key] = s.def));
    OPTIONAL.forEach((o) => (u[o.key] = o.def));
    return { u, showSolo: false, useBudget: false, useTime: false };
  }
}

export default function HobbyQuadrant() {
  const init = useRef(readUrl()).current;
  const [u, setU] = useState(init.u);
  const [showSolo, setShowSolo] = useState(init.showSolo);
  const [useBudget, setUseBudget] = useState(init.useBudget);
  const [useTime, setUseTime] = useState(init.useTime);
  const [pick, setPick] = useState(null);
  const [selected, setSelected] = useState(null);
  const [shortlist, setShortlist] = useState(() => store.get());
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(max-width: 700px)").matches
  );
  const spinRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // keep the URL in sync so any chart is shareable
  useEffect(() => {
    try {
      const p = new URLSearchParams();
      SLIDERS.forEach((s) => p.set(s.url, u[s.key]));
      if (useBudget) { p.set("fb", "1"); p.set("bu", u.budget); }
      if (useTime) { p.set("ft", "1"); p.set("ti", u.time); }
      if (showSolo) p.set("solo", "1");
      window.history.replaceState(null, "", "?" + p.toString());
    } catch { /* sandboxed environments may block this */ }
  }, [u, showSolo, useBudget, useTime]);

  useEffect(() => { store.set(shortlist); }, [shortlist]);

  const opts = { useBudget, useTime };

  const placed = useMemo(() => {
    const pool = showSolo ? HOBBIES : HOBBIES.filter((h) => h.social >= 50);
    const scored = pool.map((h) => ({ ...h, score: scoreHobby(h, u, opts) }));
    const min = Math.min(...scored.map((s) => s.score));
    const max = Math.max(...scored.map((s) => s.score));
    const span = Math.max(max - min, 1);

    let pts = scored.map((h) => {
      const yv = showSolo ? h.social : (h.social - 50) * 2;
      const xPad = isMobile ? 16 : 9;
      return {
        ...h,
        x: xPad + ((h.score - min) / span) * (100 - xPad * 2),
        y: 91 - (yv / 100) * 82,
      };
    });

    const byQuad = { ES: [], EN: [], DS: [], DN: [] };
    pts.forEach((p) => {
      const key = (p.x >= 50 ? "E" : "D") + (p.y <= 50 ? "S" : "N");
      byQuad[key].push(p);
    });
    const cap = isMobile ? 4 : showSolo ? 5 : 6;
    pts = Object.entries(byQuad).flatMap(([k, arr]) =>
      arr
        .sort((a, b) => Math.abs(b.x - 50) - Math.abs(a.x - 50))
        .slice(0, cap)
        .map((p) => ({ ...p, quad: k }))
    );

    const xThresh = isMobile ? 48 : 26;
    const yGap = isMobile ? 8 : 7.5;
    for (let iter = 0; iter < 40; iter++) {
      let moved = false;
      pts.sort((a, b) => a.y - b.y);
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          if (Math.abs(a.x - b.x) < xThresh && Math.abs(a.y - b.y) < yGap) {
            const push = (yGap - Math.abs(a.y - b.y)) / 2 + 0.2;
            a.y = Math.max(5, a.y - push);
            b.y = Math.min(95, b.y + push);
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return pts;
  }, [u, showSolo, isMobile, useBudget, useTime]);

  const set = (key) => (e) => setU({ ...u, [key]: Number(e.target.value) });

  const surprise = () => {
    const pool = showSolo ? HOBBIES : HOBBIES.filter((h) => h.social >= 50);
    if (spinRef.current) clearInterval(spinRef.current);
    let n = 0;
    spinRef.current = setInterval(() => {
      const choice = pool[Math.floor(Math.random() * pool.length)];
      setPick(choice);
      n++;
      if (n > 9) clearInterval(spinRef.current);
    }, 70);
  };
  useEffect(() => () => clearInterval(spinRef.current), []);

  const inShortlist = (name) => shortlist.includes(name);
  const toggleShortlist = (name) =>
    setShortlist((s) =>
      s.includes(name) ? s.filter((n) => n !== name) : [...s, name]
    );

  const searchUrl = (h) =>
    `https://www.google.com/search?q=${encodeURIComponent(h.q)}`;

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch { /* noop */ }
  };

  return (
    <div className="hq-page">
      <style>{css}</style>

      <div className="hq-orb hq-orb-a" />
      <div className="hq-orb hq-orb-b" />
      <div className="hq-stars" />

      <header className="hq-header">
        <h1 className="hq-title">
          The Hobby <em>Finder</em>
        </h1>
        <p className="hq-sub">
          Tune the instruments to your temperament. Hobbies take their
          positions on the chart, placed by how much you'd enjoy them
          and how likely they are to put you in a room with other people.
          Tap any one to see why it matched and find it near you.
        </p>
      </header>

      <div className="hq-layout">
        {/* ---- Controls ---- */}
        <aside className="hq-panel">
          <div className="hq-panel-title">Instruments</div>
          {SLIDERS.map((s) => (
            <div key={s.key} className="hq-slider-row">
              <div className="hq-slider-labels">
                <span style={{ opacity: u[s.key] <= 50 ? 1 : 0.4 }}>{s.left}</span>
                <span style={{ opacity: u[s.key] >= 50 ? 1 : 0.4 }}>{s.right}</span>
              </div>
              <input
                type="range" min="0" max="100"
                value={u[s.key]} onChange={set(s.key)}
                className="hq-range" style={{ "--val": `${u[s.key]}%` }}
                aria-label={`${s.left} to ${s.right}`}
              />
            </div>
          ))}

          {OPTIONAL.map((o) => {
            const on = o.flag === "useBudget" ? useBudget : useTime;
            const setOn = o.flag === "useBudget" ? setUseBudget : setUseTime;
            return (
              <div key={o.key} className={`hq-slider-row hq-optional${on ? "" : " off"}`}>
                <label className="hq-tick">
                  <input
                    type="checkbox" checked={on}
                    onChange={(e) => setOn(e.target.checked)}
                  />
                  <span>{o.tick}</span>
                </label>
                <div className="hq-slider-labels">
                  <span style={{ opacity: u[o.key] <= 50 ? 1 : 0.4 }}>{o.left}</span>
                  <span style={{ opacity: u[o.key] >= 50 ? 1 : 0.4 }}>{o.right}</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={u[o.key]} onChange={set(o.key)}
                  disabled={!on}
                  className="hq-range" style={{ "--val": `${u[o.key]}%` }}
                  aria-label={`${o.left} to ${o.right}`}
                />
              </div>
            );
          })}

          <button
            type="button" className="hq-toggle"
            onClick={() => setShowSolo(!showSolo)} aria-pressed={showSolo}
          >
            <span className={`hq-toggle-track${showSolo ? " on" : ""}`}>
              <span className="hq-toggle-knob" />
            </span>
            <span className="hq-toggle-text">
              {showSolo ? "Showing solo hobbies too" : "Meeting people only"}
            </span>
          </button>

          <button type="button" className="hq-dice" onClick={surprise}>
            🎲 Surprise me
          </button>
          {pick && (
            <button type="button" className="hq-pick" onClick={() => setSelected(pick)}>
              <span className="hq-pick-label">Tonight's pick</span>
              <span className="hq-pick-name">{pick.name}</span>
              <span className="hq-pick-cta">Tap for details →</span>
            </button>
          )}

          <button type="button" className="hq-share" onClick={copyLink}>
            🔗 Copy link to this chart
          </button>
        </aside>

        {/* ---- Chart ---- */}
        <main className="hq-chart-wrap">
          <div className="hq-axis-label hq-axis-top">
            {showSolo ? "LIKELY TO MEET PEOPLE ↑" : "BIG SOCIAL SCENES ↑"}
          </div>
          <div className="hq-chart-row">
            <div className="hq-axis-label hq-axis-side hq-axis-left">← HOBBIES YOU'D AVOID</div>

            <div className="hq-chart">
              <div className="hq-qglow" style={{ left: "50%", top: 0, background: "radial-gradient(circle at 70% 30%, rgba(94,219,165,.16), transparent 70%)" }} />
              <div className="hq-qglow" style={{ left: "50%", top: "50%", background: "radial-gradient(circle at 70% 70%, rgba(107,168,245,.14), transparent 70%)" }} />
              <div className="hq-qglow" style={{ left: 0, top: 0, background: "radial-gradient(circle at 30% 30%, rgba(240,121,110,.13), transparent 70%)" }} />
              <div className="hq-qglow" style={{ left: 0, top: "50%", background: "radial-gradient(circle at 30% 70%, rgba(232,180,79,.13), transparent 70%)" }} />

              <div className="hq-grid" />
              <div className="hq-ring hq-ring-1" />
              <div className="hq-ring hq-ring-2" />
              <div className="hq-axis-v" />
              <div className="hq-axis-h" />

              {[10, 20, 30, 40, 60, 70, 80, 90].map((t) => (
                <span key={`tx${t}`} className="hq-tick-mark hq-tick-x" style={{ left: `${t}%` }} />
              ))}
              {[10, 20, 30, 40, 60, 70, 80, 90].map((t) => (
                <span key={`ty${t}`} className="hq-tick-mark hq-tick-y" style={{ top: `${t}%` }} />
              ))}

              <span className="hq-corner" style={{ right: 10, top: 8, color: "#5EDBA5" }}>✦ sweet spot</span>

              {placed.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  className={`hq-chip${pick && pick.name === p.name ? " hq-chip-picked" : ""}${selected && selected.name === p.name ? " hq-chip-selected" : ""}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%`, "--hue": QUAD[p.quad].hue }}
                  onClick={() => setSelected(p)}
                >
                  <span className="hq-chip-dot" />
                  {inShortlist(p.name) && <span className="hq-chip-star">★</span>}
                  {p.name}
                </button>
              ))}
            </div>

            <div className="hq-axis-label hq-axis-side hq-axis-right">HOBBIES YOU'D ENJOY →</div>
          </div>
          <div className="hq-axis-label hq-axis-bottom">
            {showSolo ? "↓ UNLIKELY TO MEET PEOPLE" : "↓ QUIETER SOCIAL SCENES"}
          </div>
          <div className="hq-axis-label hq-axis-x-mobile">
            ← AVOID&nbsp;&nbsp;·&nbsp;&nbsp;ENJOY →
          </div>

          {/* ---- Detail card ---- */}
          {selected && (
            <div className="hq-detail">
              <button
                type="button" className="hq-detail-close"
                onClick={() => setSelected(null)} aria-label="Close"
              >×</button>
              <div className="hq-detail-name">{selected.name}</div>
              <div className="hq-detail-why">{explain(selected, u)}</div>
              <div className="hq-detail-actions">
                <a
                  className="hq-detail-go"
                  href={searchUrl(selected)}
                  target="_blank" rel="noopener noreferrer"
                >
                  Find it near you →
                </a>
                <button
                  type="button"
                  className={`hq-detail-save${inShortlist(selected.name) ? " saved" : ""}`}
                  onClick={() => toggleShortlist(selected.name)}
                >
                  {inShortlist(selected.name) ? "★ Saved" : "☆ Save"}
                </button>
              </div>
            </div>
          )}

          {/* ---- Shortlist ---- */}
          {shortlist.length > 0 && (
            <div className="hq-shortlist">
              <div className="hq-shortlist-title">Your shortlist</div>
              <div className="hq-shortlist-items">
                {shortlist.map((name) => {
                  const h = HOBBIES.find((x) => x.name === name);
                  if (!h) return null;
                  return (
                    <span key={name} className="hq-sl-item">
                      <a href={searchUrl(h)} target="_blank" rel="noopener noreferrer">
                        {name}
                      </a>
                      <button
                        type="button" aria-label={`Remove ${name}`}
                        onClick={() => toggleShortlist(name)}
                      >×</button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="hq-footnote">
            Tags glide as you tune. Tap one for the why, then jump to a
            location-aware search. Your chart's link updates as you go, so
            copy it to share your map with someone.
          </div>
        </main>
      </div>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.hq-page {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(1200px 800px at 75% -10%, #1A2440 0%, #0D1321 55%) #0D1321;
  color: #E8ECF4;
  font-family: 'Space Grotesk', sans-serif;
  padding: 48px 28px 64px;
  overflow: hidden;
}

/* ambient */
.hq-orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }
.hq-orb-a { width: 420px; height: 420px; background: rgba(107,168,245,.10); top: -120px; right: -80px; animation: drift 26s ease-in-out infinite alternate; }
.hq-orb-b { width: 380px; height: 380px; background: rgba(232,180,79,.08); bottom: -140px; left: -100px; animation: drift 32s ease-in-out infinite alternate-reverse; }
@keyframes drift { from { transform: translate(0,0);} to { transform: translate(40px,30px);} }
.hq-stars {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,.5), transparent),
    radial-gradient(1px 1px at 78% 12%, rgba(255,255,255,.35), transparent),
    radial-gradient(1.5px 1.5px at 55% 68%, rgba(255,255,255,.3), transparent),
    radial-gradient(1px 1px at 32% 84%, rgba(255,255,255,.4), transparent),
    radial-gradient(1px 1px at 90% 55%, rgba(255,255,255,.35), transparent),
    radial-gradient(1.5px 1.5px at 8% 60%, rgba(255,255,255,.25), transparent);
}

/* header */
.hq-header { position: relative; z-index: 1; max-width: 1120px; margin: 0 auto 34px; }
.hq-title {
  font-family: 'Instrument Serif', serif; font-weight: 400;
  font-size: clamp(40px, 6vw, 62px); line-height: 1.02;
  margin: 0 0 14px; letter-spacing: -0.01em;
}
.hq-title em { font-style: italic; color: #A9C6F7; }
.hq-sub { font-size: 15.5px; line-height: 1.65; max-width: 640px; margin: 0; color: #93A0B8; }

/* layout */
.hq-layout {
  position: relative; z-index: 1;
  max-width: 1120px; margin: 0 auto;
  display: grid; grid-template-columns: 300px 1fr; gap: 26px;
}
@media (max-width: 860px) { .hq-layout { grid-template-columns: 1fr; } }

/* panel */
.hq-panel {
  align-self: start;
  background: rgba(255,255,255,.045);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 18px;
  padding: 24px 22px;
  backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 10px 40px rgba(0,0,0,.35);
}
.hq-panel-title {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  letter-spacing: .24em; text-transform: uppercase;
  color: #E8B44F; margin-bottom: 22px;
}
.hq-slider-row { margin-bottom: 24px; }
.hq-slider-labels {
  display: flex; justify-content: space-between;
  font-size: 13.5px; font-weight: 500; margin-bottom: 10px;
  transition: opacity .2s;
}

.hq-optional { border-top: 1px dashed rgba(255,255,255,.12); padding-top: 16px; }
.hq-optional.off .hq-slider-labels, .hq-optional.off .hq-range { opacity: .35; }
.hq-tick {
  display: flex; align-items: center; gap: 9px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  letter-spacing: .06em; color: #E8B44F;
  margin-bottom: 12px; cursor: pointer;
}
.hq-tick input {
  appearance: none; -webkit-appearance: none;
  width: 16px; height: 16px; border-radius: 4px;
  border: 1.5px solid #E8B44F; background: transparent;
  cursor: pointer; position: relative; flex-shrink: 0;
}
.hq-tick input:checked { background: #E8B44F; }
.hq-tick input:checked::after {
  content: '✓'; position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #0D1321; font-weight: 700;
}
.hq-tick input:focus-visible { outline: 3px solid #6BA8F5; }

.hq-range {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 5px; border-radius: 3px; outline: none; cursor: pointer;
  background: linear-gradient(to right, #E8B44F var(--val), rgba(255,255,255,.14) var(--val));
}
.hq-range:disabled { cursor: not-allowed; }
.hq-range::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 20px; height: 20px; border-radius: 50%;
  background: #0D1321; border: 2px solid #E8B44F;
  box-shadow: 0 0 12px rgba(232,180,79,.55); cursor: grab;
}
.hq-range::-moz-range-thumb {
  width: 20px; height: 20px; border-radius: 50%;
  background: #0D1321; border: 2px solid #E8B44F;
  box-shadow: 0 0 12px rgba(232,180,79,.55); cursor: grab;
}
.hq-range:focus-visible::-webkit-slider-thumb { outline: 3px solid #6BA8F5; }

/* toggle */
.hq-toggle {
  display: flex; align-items: center; gap: 11px;
  width: 100%; background: none; border: none; cursor: pointer;
  padding: 2px 0 0; text-align: left;
}
.hq-toggle-track {
  position: relative; width: 38px; height: 21px; border-radius: 999px;
  background: rgba(255,255,255,.14);
  border: 1px solid rgba(255,255,255,.18);
  transition: background .2s; flex-shrink: 0;
}
.hq-toggle-track.on { background: rgba(94,219,165,.35); border-color: #5EDBA5; }
.hq-toggle-knob {
  position: absolute; top: 2px; left: 2px;
  width: 15px; height: 15px; border-radius: 50%;
  background: #E8ECF4; transition: left .2s;
}
.hq-toggle-track.on .hq-toggle-knob { left: 19px; }
.hq-toggle-text {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  letter-spacing: .06em; color: #93A0B8;
}
.hq-toggle:focus-visible .hq-toggle-track { outline: 3px solid #6BA8F5; }

/* randomiser + share */
.hq-dice {
  margin-top: 20px; width: 100%;
  background: linear-gradient(135deg, rgba(232,180,79,.18), rgba(232,180,79,.06));
  border: 1px solid #E8B44F; border-radius: 12px;
  padding: 11px 14px; cursor: pointer;
  font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; font-weight: 500;
  letter-spacing: .08em; color: #E8B44F;
  transition: box-shadow .18s, transform .1s;
}
.hq-dice:hover { box-shadow: 0 0 18px rgba(232,180,79,.35); }
.hq-dice:active { transform: scale(.97); }
.hq-dice:focus-visible { outline: 3px solid #6BA8F5; }
.hq-pick {
  display: flex; flex-direction: column; gap: 3px;
  width: 100%; text-align: left; cursor: pointer;
  margin-top: 12px; padding: 13px 15px;
  background: rgba(94,219,165,.08);
  border: 1px solid rgba(94,219,165,.5); border-radius: 12px;
}
.hq-pick:hover { box-shadow: 0 0 16px rgba(94,219,165,.3); }
.hq-pick-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px;
  letter-spacing: .2em; text-transform: uppercase; color: #5EDBA5;
}
.hq-pick-name { font-size: 17px; font-weight: 600; color: #E8ECF4; }
.hq-pick-cta { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #93A0B8; }
.hq-share {
  margin-top: 12px; width: 100%;
  background: none; border: 1px solid rgba(255,255,255,.18); border-radius: 12px;
  padding: 10px 14px; cursor: pointer;
  font-family: 'IBM Plex Mono', monospace; font-size: 11.5px;
  letter-spacing: .06em; color: #93A0B8;
  transition: border-color .18s, color .18s;
}
.hq-share:hover { border-color: #6BA8F5; color: #A9C6F7; }
.hq-share:focus-visible { outline: 3px solid #6BA8F5; }

/* chart */
.hq-chart-wrap { display: flex; flex-direction: column; }
.hq-chart-row { display: flex; align-items: stretch; gap: 8px; }
.hq-chart {
  position: relative; flex: 1; aspect-ratio: 4 / 3;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 16px; overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 14px 50px rgba(0,0,0,.4);
}
.hq-qglow { position: absolute; width: 50%; height: 50%; pointer-events: none; }
.hq-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(rgba(232,236,244,.10) 1px, transparent 1px);
  background-size: 34px 34px;
}
.hq-ring {
  position: absolute; left: 50%; top: 50%;
  transform: translate(-50%,-50%);
  border: 1px dashed rgba(232,236,244,.10); border-radius: 50%;
  pointer-events: none;
}
.hq-ring-1 { width: 46%; aspect-ratio: 1; }
.hq-ring-2 { width: 82%; aspect-ratio: 1; }
.hq-axis-v { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: linear-gradient(rgba(232,236,244,.0), rgba(232,236,244,.45), rgba(232,236,244,.0)); }
.hq-axis-h { position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, rgba(232,236,244,.0), rgba(232,236,244,.45), rgba(232,236,244,.0)); }
.hq-tick-mark { position: absolute; background: rgba(232,236,244,.30); pointer-events: none; }
.hq-tick-x { top: calc(50% - 3px); width: 1px; height: 6px; }
.hq-tick-y { left: calc(50% - 3px); height: 1px; width: 6px; }
.hq-corner {
  position: absolute; font-family: 'IBM Plex Mono', monospace;
  font-size: 10px; letter-spacing: .14em; opacity: .85; pointer-events: none;
}

.hq-axis-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 10.5px;
  letter-spacing: .22em; color: #7686A0;
}
.hq-axis-top { text-align: center; margin-bottom: 10px; }
.hq-axis-bottom { text-align: center; margin-top: 10px; }
.hq-axis-side { writing-mode: vertical-rl; text-align: center; }
.hq-axis-left { transform: rotate(180deg); }
.hq-axis-x-mobile { display: none; }

/* chips */
.hq-chip {
  position: absolute; transform: translate(-50%, -50%);
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(13,19,33,.78);
  border: 1px solid var(--hue);
  border-radius: 999px; padding: 6px 13px 6px 9px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; font-weight: 500;
  color: #E8ECF4; text-decoration: none; white-space: nowrap; cursor: pointer;
  box-shadow: 0 0 14px color-mix(in srgb, var(--hue) 35%, transparent), inset 0 0 8px color-mix(in srgb, var(--hue) 12%, transparent);
  backdrop-filter: blur(4px);
  transition: left .55s cubic-bezier(.22,1,.36,1), top .55s cubic-bezier(.22,1,.36,1), box-shadow .18s, scale .18s;
}
.hq-chip:hover, .hq-chip:focus-visible {
  scale: 1.1; z-index: 20;
  box-shadow: 0 0 26px color-mix(in srgb, var(--hue) 65%, transparent), inset 0 0 10px color-mix(in srgb, var(--hue) 20%, transparent);
}
.hq-chip-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--hue); box-shadow: 0 0 8px var(--hue);
  flex-shrink: 0;
}
.hq-chip-star { color: #E8B44F; font-size: 10px; margin: 0 -3px; }
.hq-chip-selected { border-width: 2px; }
.hq-chip-picked { border-width: 2px; animation: hq-pulse 1.4s ease-in-out infinite; }
@keyframes hq-pulse {
  0%, 100% { box-shadow: 0 0 14px color-mix(in srgb, var(--hue) 45%, transparent); }
  50% { box-shadow: 0 0 32px color-mix(in srgb, var(--hue) 90%, transparent); }
}

/* detail card */
.hq-detail {
  position: relative;
  margin-top: 14px; padding: 18px 20px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 14px;
  backdrop-filter: blur(10px);
}
.hq-detail-close {
  position: absolute; top: 10px; right: 12px;
  background: none; border: none; color: #7686A0;
  font-size: 20px; cursor: pointer; line-height: 1;
}
.hq-detail-close:hover { color: #E8ECF4; }
.hq-detail-name { font-size: 19px; font-weight: 600; margin-bottom: 4px; }
.hq-detail-why { font-size: 13.5px; color: #93A0B8; line-height: 1.55; margin-bottom: 14px; }
.hq-detail-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.hq-detail-go {
  background: linear-gradient(135deg, rgba(94,219,165,.22), rgba(94,219,165,.08));
  border: 1px solid #5EDBA5; border-radius: 10px;
  padding: 9px 14px; text-decoration: none;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5EDBA5;
}
.hq-detail-go:hover { box-shadow: 0 0 16px rgba(94,219,165,.4); }
.hq-detail-save {
  background: none; border: 1px solid rgba(232,180,79,.6); border-radius: 10px;
  padding: 9px 14px; cursor: pointer;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #E8B44F;
}
.hq-detail-save.saved { background: rgba(232,180,79,.16); }
.hq-detail-save:hover { box-shadow: 0 0 14px rgba(232,180,79,.3); }

/* shortlist */
.hq-shortlist { margin-top: 14px; }
.hq-shortlist-title {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px;
  letter-spacing: .2em; text-transform: uppercase; color: #E8B44F;
  margin-bottom: 8px;
}
.hq-shortlist-items { display: flex; flex-wrap: wrap; gap: 8px; }
.hq-sl-item {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(232,180,79,.10);
  border: 1px solid rgba(232,180,79,.45); border-radius: 999px;
  padding: 5px 8px 5px 12px;
}
.hq-sl-item a {
  color: #E8ECF4; text-decoration: none;
  font-family: 'IBM Plex Mono', monospace; font-size: 11.5px;
}
.hq-sl-item a:hover { color: #E8B44F; }
.hq-sl-item button {
  background: none; border: none; color: #7686A0;
  font-size: 15px; cursor: pointer; line-height: 1; padding: 0 2px;
}
.hq-sl-item button:hover { color: #F0796E; }

.hq-footnote {
  margin-top: 14px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11.5px; color: #7686A0; line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
  .hq-chip { transition: none; }
  .hq-chip-picked { animation: none; }
  .hq-orb-a, .hq-orb-b { animation: none; }
}

/* ---------- mobile ---------- */
@media (max-width: 700px) {
  .hq-page { padding: 26px 14px 40px; }

  .hq-header { margin-bottom: 22px; }
  .hq-title { font-size: clamp(32px, 10vw, 40px); }
  .hq-sub { font-size: 14px; line-height: 1.55; }

  .hq-layout { gap: 18px; }
  .hq-panel { padding: 18px 16px; border-radius: 14px; }
  .hq-slider-row { margin-bottom: 18px; }
  .hq-slider-labels { font-size: 12.5px; margin-bottom: 7px; }
  .hq-range::-webkit-slider-thumb { width: 24px; height: 24px; }
  .hq-range::-moz-range-thumb { width: 24px; height: 24px; }

  .hq-chart { aspect-ratio: 3 / 4; border-radius: 12px; }
  .hq-axis-side { display: none; }
  .hq-chart-row { gap: 0; }
  .hq-axis-x-mobile { display: block; text-align: center; margin-top: 6px; }
  .hq-axis-top, .hq-axis-bottom { font-size: 9.5px; letter-spacing: .16em; }
  .hq-axis-bottom { margin-top: 8px; }

  .hq-chip { font-size: 10px; padding: 4px 9px 4px 7px; gap: 5px; }
  .hq-chip-dot { width: 6px; height: 6px; }
  .hq-corner { font-size: 8.5px; right: 6px; top: 6px; }
  .hq-ring-2 { display: none; }

  .hq-detail { padding: 15px 16px; }
  .hq-detail-name { font-size: 17px; }
  .hq-detail-actions { flex-direction: column; }
  .hq-detail-go, .hq-detail-save { text-align: center; }

  .hq-footnote { font-size: 10.5px; margin-top: 10px; }
  .hq-orb-a, .hq-orb-b { display: none; }
}
`;
