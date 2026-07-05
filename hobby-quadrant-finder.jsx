import { useState, useMemo, useEffect } from "react";

// ---------- Hobby database ----------
// traits: energy (pace/stimulation), creative, outdoor, structure, physical (bodily demand) — all 0-100
// social: 0-100 → fixed Y axis (likelihood of meeting people)
const HOBBIES = [
  { name: "Salsa dancing", q: "salsa classes near me", energy: 75, creative: 55, outdoor: 10, structure: 60, physical: 70, social: 90 },
  { name: "Bachata", q: "bachata classes near me", energy: 65, creative: 60, outdoor: 10, structure: 55, physical: 65, social: 90 },
  { name: "Social dancing", q: "social dance classes near me", energy: 60, creative: 55, outdoor: 10, structure: 50, physical: 60, social: 95 },
  { name: "Swing dancing", q: "swing dancing classes near me", energy: 70, creative: 60, outdoor: 5, structure: 55, physical: 65, social: 90 },
  { name: "Board game meetup", q: "board game meetup near me", energy: 30, creative: 55, outdoor: 5, structure: 70, physical: 5, social: 85 },
  { name: "Five-a-side football", q: "five a side football near me", energy: 90, creative: 20, outdoor: 80, structure: 75, physical: 95, social: 90 },
  { name: "Tag rugby", q: "tag rugby league near me", energy: 85, creative: 20, outdoor: 90, structure: 70, physical: 85, social: 90 },
  { name: "Touch rugby", q: "touch rugby near me", energy: 80, creative: 20, outdoor: 90, structure: 70, physical: 80, social: 90 },
  { name: "Ultimate frisbee", q: "ultimate frisbee near me", energy: 85, creative: 30, outdoor: 95, structure: 60, physical: 85, social: 90 },
  { name: "Netball", q: "social netball league near me", energy: 80, creative: 20, outdoor: 40, structure: 75, physical: 80, social: 90 },
  { name: "Volleyball", q: "volleyball club near me", energy: 75, creative: 25, outdoor: 50, structure: 65, physical: 75, social: 90 },
  { name: "Dodgeball", q: "dodgeball league near me", energy: 80, creative: 30, outdoor: 10, structure: 55, physical: 75, social: 90 },
  { name: "Padel", q: "padel courts near me", energy: 70, creative: 25, outdoor: 60, structure: 65, physical: 70, social: 85 },
  { name: "Social sports league", q: "social sports league near me", energy: 70, creative: 25, outdoor: 50, structure: 60, physical: 70, social: 95 },
  { name: "Roundnet", q: "roundnet spikeball group near me", energy: 80, creative: 30, outdoor: 90, structure: 50, physical: 80, social: 85 },
  { name: "Pickleball", q: "pickleball near me", energy: 65, creative: 25, outdoor: 60, structure: 65, physical: 60, social: 90 },
  { name: "Hyrox", q: "hyrox training near me", energy: 95, creative: 10, outdoor: 20, structure: 85, physical: 100, social: 70 },
  { name: "CrossFit", q: "crossfit gym near me", energy: 90, creative: 15, outdoor: 15, structure: 85, physical: 95, social: 80 },
  { name: "Bouldering", q: "bouldering gym near me", energy: 80, creative: 35, outdoor: 30, structure: 40, physical: 90, social: 70 },
  { name: "Pottery class", q: "pottery class near me", energy: 25, creative: 90, outdoor: 5, structure: 55, physical: 25, social: 65 },
  { name: "Life drawing", q: "life drawing class near me", energy: 20, creative: 95, outdoor: 5, structure: 50, physical: 5, social: 60 },
  { name: "Book club", q: "book club near me", energy: 15, creative: 60, outdoor: 5, structure: 60, physical: 5, social: 75 },
  { name: "Lectures & talks", q: "public lectures and talks near me", energy: 15, creative: 55, outdoor: 5, structure: 70, physical: 5, social: 60 },
  { name: "Parkrun", q: "parkrun near me", energy: 85, creative: 10, outdoor: 95, structure: 65, physical: 95, social: 70 },
  { name: "Improv comedy", q: "improv comedy class near me", energy: 70, creative: 90, outdoor: 5, structure: 30, physical: 40, social: 95 },
  { name: "Language exchange", q: "language exchange meetup near me", energy: 30, creative: 50, outdoor: 10, structure: 40, physical: 5, social: 90 },
  { name: "Cooking class", q: "cooking class near me", energy: 40, creative: 75, outdoor: 5, structure: 65, physical: 30, social: 70 },
  { name: "Volunteering", q: "volunteering opportunities near me", energy: 50, creative: 40, outdoor: 50, structure: 55, physical: 45, social: 85 },
  { name: "Hiking group", q: "hiking group near me", energy: 70, creative: 25, outdoor: 100, structure: 50, physical: 85, social: 75 },
  { name: "Foraging walks", q: "foraging walks near me", energy: 40, creative: 50, outdoor: 100, structure: 45, physical: 55, social: 65 },
  { name: "Choir", q: "community choir near me", energy: 45, creative: 70, outdoor: 5, structure: 70, physical: 20, social: 90 },
  { name: "Martial arts", q: "martial arts classes near me", energy: 85, creative: 30, outdoor: 20, structure: 85, physical: 95, social: 70 },
  { name: "Tabletop wargaming", q: "wargaming club near me", energy: 25, creative: 70, outdoor: 5, structure: 65, physical: 5, social: 70 },
  { name: "Chess club", q: "chess club near me", energy: 15, creative: 50, outdoor: 0, structure: 80, physical: 5, social: 70 },
  { name: "Pub quiz team", q: "pub quiz near me", energy: 30, creative: 45, outdoor: 5, structure: 55, physical: 5, social: 90 },
  { name: "Community theatre", q: "community theatre near me", energy: 60, creative: 90, outdoor: 5, structure: 60, physical: 50, social: 95 },
  { name: "Creative writing group", q: "creative writing group near me", energy: 15, creative: 95, outdoor: 0, structure: 50, physical: 5, social: 65 },
  { name: "Cycling club", q: "cycling club near me", energy: 80, creative: 15, outdoor: 95, structure: 60, physical: 90, social: 70 },
  { name: "Photography walks", q: "photography walk group near me", energy: 40, creative: 85, outdoor: 85, structure: 35, physical: 50, social: 55 },
  { name: "Escape rooms", q: "escape rooms near me", energy: 55, creative: 60, outdoor: 5, structure: 60, physical: 25, social: 85 },
  { name: "VR gaming", q: "VR arcade near me", energy: 60, creative: 45, outdoor: 0, structure: 40, physical: 55, social: 60 },
  { name: "Paint & sip night", q: "paint and sip near me", energy: 35, creative: 90, outdoor: 5, structure: 55, physical: 15, social: 85 },
  { name: "Yoga / Pilates class", q: "yoga and pilates classes near me", energy: 45, creative: 30, outdoor: 15, structure: 70, physical: 55, social: 60 },
  { name: "Swimming", q: "swimming pool near me", energy: 70, creative: 10, outdoor: 30, structure: 60, physical: 90, social: 35 },
  { name: "Swimming club", q: "swimming club near me", energy: 75, creative: 10, outdoor: 30, structure: 75, physical: 90, social: 75 },
  { name: "Rowing club", q: "rowing club near me", energy: 85, creative: 10, outdoor: 80, structure: 85, physical: 95, social: 80 },
  { name: "Pub crawl", q: "pub crawl near me", energy: 55, creative: 30, outdoor: 30, structure: 20, physical: 30, social: 95 },
  { name: "Solo running", q: "running routes near me", energy: 85, creative: 10, outdoor: 90, structure: 55, physical: 95, social: 15 },
  { name: "Stargazing", q: "stargazing spots near me", energy: 15, creative: 45, outdoor: 95, structure: 35, physical: 15, social: 30 },
  { name: "Reading", q: "library near me", energy: 5, creative: 55, outdoor: 5, structure: 30, physical: 0, social: 5 },
  { name: "Video games", q: "gaming cafe near me", energy: 15, creative: 45, outdoor: 0, structure: 35, physical: 5, social: 20 },
  { name: "Painting at home", q: "art supplies shop near me", energy: 15, creative: 95, outdoor: 5, structure: 30, physical: 10, social: 5 },
  { name: "Gardening", q: "garden centre near me", energy: 45, creative: 55, outdoor: 95, structure: 55, physical: 60, social: 15 },
  { name: "Miniature painting", q: "miniature painting near me", energy: 15, creative: 90, outdoor: 0, structure: 60, physical: 10, social: 15 },
  { name: "Model building", q: "model hobby shop near me", energy: 20, creative: 80, outdoor: 0, structure: 75, physical: 10, social: 10 },
  { name: "Learning an instrument", q: "music lessons near me", energy: 35, creative: 80, outdoor: 5, structure: 75, physical: 15, social: 20 },
  { name: "Baking", q: "baking supplies near me", energy: 30, creative: 75, outdoor: 0, structure: 70, physical: 25, social: 10 },
  { name: "Coding projects", q: "hackathon near me", energy: 20, creative: 65, outdoor: 0, structure: 70, physical: 5, social: 10 },
  { name: "Fishing", q: "fishing spots near me", energy: 30, creative: 15, outdoor: 95, structure: 45, physical: 30, social: 25 },
  { name: "Jigsaw puzzles", q: "puzzle exchange near me", energy: 15, creative: 40, outdoor: 0, structure: 80, physical: 5, social: 10 },
];

const SLIDERS = [
  { key: "extroversion", left: "Introvert", right: "Extrovert", def: 50 },
  { key: "physical", left: "Sedentary", right: "Physical", def: 50 },
  { key: "energy", left: "Chilled", right: "High energy", def: 50 },
  { key: "creative", left: "Practical", right: "Creative", def: 50 },
  { key: "outdoor", left: "Indoors", right: "Outdoors", def: 50 },
  { key: "structure", left: "Spontaneous", right: "Structured", def: 50 },
];

const QUAD = {
  ES: { hue: "#5EDBA5", glow: "rgba(94,219,165,.16)", label: "Enjoy · meet people" },
  EN: { hue: "#6BA8F5", glow: "rgba(107,168,245,.14)", label: "Enjoy · solo" },
  DS: { hue: "#F0796E", glow: "rgba(240,121,110,.13)", label: "Avoid · social" },
  DN: { hue: "#E8B44F", glow: "rgba(232,180,79,.13)", label: "Avoid · solo" },
};

function scoreHobby(h, u) {
  const dEnergy = Math.abs(u.energy - h.energy);
  const dCreative = Math.abs(u.creative - h.creative);
  const dOutdoor = Math.abs(u.outdoor - h.outdoor);
  const dStructure = Math.abs(u.structure - h.structure);
  const dPhysical = Math.abs(u.physical - h.physical);
  const dSocial = Math.abs(u.extroversion - h.social);
  // physical fit weighted heaviest: a mismatch there is a dealbreaker, not a preference
  const weighted =
    (dEnergy * 0.8 + dCreative + dOutdoor + dStructure * 0.7 + dPhysical * 1.3 + dSocial * 0.9) /
    (0.8 + 1 + 1 + 0.7 + 1.3 + 0.9);
  return 100 - weighted;
}

export default function HobbyQuadrant() {
  const [u, setU] = useState(
    Object.fromEntries(SLIDERS.map((s) => [s.key, s.def]))
  );
  const [showSolo, setShowSolo] = useState(false);
  const [pick, setPick] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(max-width: 700px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const placed = useMemo(() => {
    const pool = showSolo ? HOBBIES : HOBBIES.filter((h) => h.social >= 50);
    const scored = pool.map((h) => ({ ...h, score: scoreHobby(h, u) }));
    const min = Math.min(...scored.map((s) => s.score));
    const max = Math.max(...scored.map((s) => s.score));
    const span = Math.max(max - min, 1);

    let pts = scored.map((h) => {
      // in focus mode the chart only holds social hobbies, so stretch
      // the 50-100 social range across the full height for finer separation
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

    // chips are proportionally much wider on a narrow screen,
    // so use a bigger horizontal collision threshold there
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
  }, [u, showSolo, isMobile]);

  const set = (key) => (e) => setU({ ...u, [key]: Number(e.target.value) });

  const surprise = () => {
    const pool = showSolo ? HOBBIES : HOBBIES.filter((h) => h.social >= 50);
    let choice = pool[Math.floor(Math.random() * pool.length)];
    // avoid picking the same hobby twice in a row
    if (pick && pool.length > 1) {
      while (choice.name === pick.name) {
        choice = pool[Math.floor(Math.random() * pool.length)];
      }
    }
    setPick(choice);
  };

  return (
    <div className="hq-page">
      <style>{css}</style>

      {/* ambient background */}
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
          Click any one to find it near you.
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
                type="range"
                min="0"
                max="100"
                value={u[s.key]}
                onChange={set(s.key)}
                className="hq-range"
                style={{ "--val": `${u[s.key]}%` }}
                aria-label={`${s.left} to ${s.right}`}
              />
            </div>
          ))}
          <button
            type="button"
            className="hq-toggle"
            onClick={() => setShowSolo(!showSolo)}
            aria-pressed={showSolo}
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
            <a
              className="hq-pick"
              href={`https://www.google.com/search?q=${encodeURIComponent(pick.q)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hq-pick-label">Tonight's pick</span>
              <span className="hq-pick-name">{pick.name}</span>
              <span className="hq-pick-cta">Find it near you →</span>
            </a>
          )}
        </aside>

        {/* ---- Chart ---- */}
        <main className="hq-chart-wrap">
          <div className="hq-axis-label hq-axis-top">
            {showSolo ? "LIKELY TO MEET PEOPLE ↑" : "BIG SOCIAL SCENES ↑"}
          </div>
          <div className="hq-chart-row">
            <div className="hq-axis-label hq-axis-side hq-axis-left">← HOBBIES YOU'D AVOID</div>

            <div className="hq-chart">
              {/* quadrant glows */}
              <div className="hq-qglow" style={{ left: "50%", top: 0, background: `radial-gradient(circle at 70% 30%, ${QUAD.ES.glow}, transparent 70%)` }} />
              <div className="hq-qglow" style={{ left: "50%", top: "50%", background: `radial-gradient(circle at 70% 70%, ${QUAD.EN.glow}, transparent 70%)` }} />
              <div className="hq-qglow" style={{ left: 0, top: 0, background: `radial-gradient(circle at 30% 30%, ${QUAD.DS.glow}, transparent 70%)` }} />
              <div className="hq-qglow" style={{ left: 0, top: "50%", background: `radial-gradient(circle at 30% 70%, ${QUAD.DN.glow}, transparent 70%)` }} />

              <div className="hq-grid" />
              <div className="hq-ring hq-ring-1" />
              <div className="hq-ring hq-ring-2" />
              <div className="hq-axis-v" />
              <div className="hq-axis-h" />

              {/* tick marks */}
              {[10, 20, 30, 40, 60, 70, 80, 90].map((t) => (
                <span key={`tx${t}`} className="hq-tick hq-tick-x" style={{ left: `${t}%` }} />
              ))}
              {[10, 20, 30, 40, 60, 70, 80, 90].map((t) => (
                <span key={`ty${t}`} className="hq-tick hq-tick-y" style={{ top: `${t}%` }} />
              ))}

              {/* corner tags */}
              <span className="hq-corner" style={{ right: 10, top: 8, color: QUAD.ES.hue }}>✦ sweet spot</span>

              {placed.map((p) => (
                <a
                  key={p.name}
                  href={`https://www.google.com/search?q=${encodeURIComponent(p.q)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hq-chip${pick && pick.name === p.name ? " hq-chip-picked" : ""}`}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    "--hue": QUAD[p.quad].hue,
                  }}
                  title={`Search "${p.q}"`}
                >
                  <span className="hq-chip-dot" />
                  {p.name}
                </a>
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
          <div className="hq-footnote">
            Tags glide as you tune. Each opens a location-aware Google search in a new tab.
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

.hq-range {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 5px; border-radius: 3px; outline: none; cursor: pointer;
  background: linear-gradient(to right, #E8B44F var(--val), rgba(255,255,255,.14) var(--val));
}
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

.hq-legend { border-top: 1px solid rgba(255,255,255,.10); padding-top: 16px; }

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

/* randomiser */
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
  margin-top: 12px; padding: 13px 15px;
  background: rgba(94,219,165,.08);
  border: 1px solid rgba(94,219,165,.5); border-radius: 12px;
  text-decoration: none;
}
.hq-pick:hover { box-shadow: 0 0 16px rgba(94,219,165,.3); }
.hq-pick-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px;
  letter-spacing: .2em; text-transform: uppercase; color: #5EDBA5;
}
.hq-pick-name { font-size: 17px; font-weight: 600; color: #E8ECF4; }
.hq-pick-cta {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #93A0B8;
}

/* picked chip pulse */
.hq-chip-picked {
  border-width: 2px;
  animation: hq-pulse 1.4s ease-in-out infinite;
}
@keyframes hq-pulse {
  0%, 100% { box-shadow: 0 0 14px color-mix(in srgb, var(--hue) 45%, transparent); }
  50% { box-shadow: 0 0 32px color-mix(in srgb, var(--hue) 90%, transparent); }
}
@media (prefers-reduced-motion: reduce) {
  .hq-chip-picked { animation: none; }
}
.hq-legend-row {
  display: flex; align-items: center; gap: 10px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px;
  color: #93A0B8; margin-bottom: 8px;
}
.hq-legend-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

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
  background-image:
    radial-gradient(rgba(232,236,244,.10) 1px, transparent 1px);
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
.hq-tick { position: absolute; background: rgba(232,236,244,.30); pointer-events: none; }
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

/* chips */
.hq-chip {
  position: absolute; transform: translate(-50%, -50%);
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(13,19,33,.78);
  border: 1px solid var(--hue);
  border-radius: 999px; padding: 6px 13px 6px 9px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; font-weight: 500;
  color: #E8ECF4; text-decoration: none; white-space: nowrap;
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

.hq-footnote {
  margin-top: 14px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11.5px; color: #7686A0;
}

.hq-axis-x-mobile { display: none; }

@media (prefers-reduced-motion: reduce) {
  .hq-chip { transition: none; }
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

  /* taller chart, full width, no rotated side labels */
  .hq-chart { aspect-ratio: 3 / 4; border-radius: 12px; }
  .hq-axis-side { display: none; }
  .hq-chart-row { gap: 0; }
  .hq-axis-x-mobile { display: block; text-align: center; margin-top: 6px; }
  .hq-axis-top, .hq-axis-bottom { font-size: 9.5px; letter-spacing: .16em; }
  .hq-axis-bottom { margin-top: 8px; }

  .hq-chip {
    font-size: 10px; padding: 4px 9px 4px 7px; gap: 5px;
    border-radius: 999px;
  }
  .hq-chip-dot { width: 6px; height: 6px; }
  .hq-corner { font-size: 8.5px; right: 6px; top: 6px; }
  .hq-ring-2 { display: none; }

  .hq-footnote { font-size: 10.5px; margin-top: 10px; }

  /* calmer background on small screens */
  .hq-orb-a, .hq-orb-b { display: none; }
}
`;
