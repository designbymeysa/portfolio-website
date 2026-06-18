/* global React */
// Portfolio components — refresh of designbymeysa.com
// Hero variants: collage | statement | wordmark
// Project layouts: stories | grid | bento
//
// Animation: CSS keyframes + a tiny IntersectionObserver helper that adds
// `.is-in` to elements tagged `.pf-reveal` when they scroll into view.
// Wired up at the bottom of this file (see installRevealObserver).


// ─────────────────────────────────────────────────────────────────────
// Project data
// ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
{
  id: "vire",
  num: "01",
  title: "Vire Club",
  titleItalic: "Club",
  year: "2024",
  sector: "Fintech",
  role: "Lead Product Designer",
  duration: "10 months",
  blurb:
  "An exclusive neobank empowering creators with seamless finances, tailored earnings, and unique perks. Designed the consumer onboarding, brand expression, and creator dashboard from zero to launch.",
  tags: ["Brand", "Product", "Web"],
  mock: "vire"
},
{
  id: "outcome",
  num: "02",
  title: "OutcomeAI",
  titleItalic: "AI",
  year: "2025",
  sector: "Healthcare",
  role: "Founding Designer",
  duration: "Ongoing",
  blurb:
  "A nurse-first AI platform designed to quietly reduce administrative burden. Voice charting, smart handoffs, and a documentation copilot — tested with three hospital systems.",
  tags: ["AI", "Mobile", "Research"],
  mock: "health"
},
{
  id: "dheart",
  num: "03",
  title: "D-Heart Redesign",
  titleItalic: "Redesign",
  year: "2023",
  sector: "Medtech",
  role: "Product Designer",
  duration: "6 months",
  blurb:
  "Reimagined the consumer ECG companion app — readable cardiogram, clinician-grade reports, and a calmer way to share an episode with your doctor.",
  tags: ["Mobile", "Health", "Data viz"],
  mock: "dheart"
},
{
  id: "art",
  num: "04",
  title: "Art Beyond Dimension",
  titleItalic: "Dimension",
  year: "2023",
  sector: "Culture",
  role: "Design Lead",
  duration: "3 months",
  blurb:
  "A virtual exhibition platform for emerging painters. Curated rooms, immersive scroll, and a lightweight checkout flow that doubled artist sales month-over-month.",
  tags: ["Web", "3D", "Commerce"],
  mock: "art"
},
{
  id: "sage",
  num: "05",
  title: "Sage Banking",
  titleItalic: "Banking",
  year: "2022",
  sector: "Fintech",
  role: "Senior Designer",
  duration: "8 months",
  blurb:
  "A second-chance banking app for new immigrants. Built credit history visualization, multilingual onboarding, and trust-by-design touchpoints across the app.",
  tags: ["Mobile", "Inclusive design"],
  mock: "sage"
}];


// Subset of disciplines for the marquee
const DISCIPLINES = [
"Interaction Design",
"Visual Design",
"Branding",
"UI Design",
"Research",
"Prototyping",
"Design Systems",
"Motion"];


// ─────────────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [dark, setDark] = React.useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.dataset.theme === 'dark';
  });
  React.useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);
  return (
    <nav className="pf-nav">
      <a href="#top" className="pf-brand">DESIGNBYMEYSA</a>
      <div className="pf-nav-pill">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
      <button
        type="button"
        className="pf-theme-toggle"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={dark}
        onClick={() => setDark((d) => !d)}>
        <span className="pf-theme-toggle-knob" aria-hidden="true">
          <svg className="pf-theme-icon pf-theme-sun" viewBox="0 0 16 16" width="14" height="14">
            <circle cx="8" cy="8" r="3" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <line x1="8" y1="1.5" x2="8" y2="3" />
              <line x1="8" y1="13" x2="8" y2="14.5" />
              <line x1="1.5" y1="8" x2="3" y2="8" />
              <line x1="13" y1="8" x2="14.5" y2="8" />
              <line x1="3.2" y1="3.2" x2="4.2" y2="4.2" />
              <line x1="11.8" y1="11.8" x2="12.8" y2="12.8" />
              <line x1="3.2" y1="12.8" x2="4.2" y2="11.8" />
              <line x1="11.8" y1="4.2" x2="12.8" y2="3.2" />
            </g>
          </svg>
          <svg className="pf-theme-icon pf-theme-moon" viewBox="0 0 16 16" width="14" height="14">
            <path d="M13.5 9.8A5.5 5.5 0 0 1 6.2 2.5a5.5 5.5 0 1 0 7.3 7.3z"
                  fill="currentColor" />
          </svg>
        </span>
      </button>
    </nav>);

}

// ─────────────────────────────────────────────────────────────────────
// Marquee band (full-bleed, between hero and projects)
// ─────────────────────────────────────────────────────────────────────
function MarqueeBand() {
  const items = [];
  for (let i = 0; i < 3; i++) {
    DISCIPLINES.forEach((d) => {
      items.push(<span className="star" key={`s${i}-${d}`}>✦</span>);
      items.push(<span key={`t${i}-${d}`}>{d}</span>);
    });
  }
  return (
    <div className="pf-band">
      <div className="pf-band-track">
        {items}
        {items.map((el, i) => React.cloneElement(el, { key: `dup-${i}` }))}
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// HERO · Collage variant
// ─────────────────────────────────────────────────────────────────────
function HeroCollage() {
  return (
    <section className="pf-hero pf-anim-collage">
      <div className="pf-hero-bg" />

      {/* Polaroid / avatar */}
      <div className="pf-chip pf-chip-polaroid" aria-hidden="true">
        <div className="pic" />
        <div className="cap">Meysa · Toronto</div>
      </div>

      {/* Now playing */}
      <div className="pf-chip pf-chip-now-playing" aria-hidden="true">
        <div className="art" />
        <div className="meta">
          <div className="lbl">Now scoring</div>
          <div className="ttl">Vierd Blues</div>
          <div className="bar"><i /></div>
        </div>
      </div>

      {/* Open to work */}
      <div className="pf-chip pf-chip-open" aria-hidden="true">
        <div className="dot" />
        <div className="txt">Open to work<strong>Q3 — 2026</strong></div>
      </div>

      {/* Location */}
      <div className="pf-chip pf-chip-loc" aria-hidden="true">
        <div className="eyebrow">Based in</div>
        <div className="city">Toronto</div>
        <div className="sub">EST · UTC−5</div>
      </div>

      {/* Role card */}
      <div className="pf-chip pf-chip-role" aria-hidden="true">
        <div className="eyebrow">Currently</div>
        <h4>Product Designer</h4>
        <ul>
          <li>Brand & UX</li>
          <li>Research → Ship</li>
          <li>Toronto / Remote</li>
        </ul>
      </div>

      {/* Headline */}
      <h1 className="pf-collage-headline pf-anim-headline">
        I design <em>and</em> ship.<br />Fast.
      </h1>
      <p className="pf-collage-sub pf-anim-meta">
        Hi, I'm Meysa — a multidisciplinary product designer who turns research into experiences people actually enjoy using.
      </p>

      {/* Marquee chip (inside collage) */}
      <div className="pf-chip pf-chip-marquee" aria-hidden="true">
        <div className="track">
          {Array.from({ length: 4 }).map((_, i) =>
          <React.Fragment key={i}>
              <span className="star">✦</span><span>Interaction Design</span>
              <span className="star">✦</span><span>Brand</span>
              <span className="star">✦</span><span>Product</span>
              <span className="star">✦</span><span>Research</span>
            </React.Fragment>
          )}
        </div>
      </div>

      {/* Resume */}
      <div className="pf-chip pf-chip-cv" aria-hidden="true">
        <div className="eyebrow">CV</div>
        <div className="file">
          <div className="ico" />
          <div>
            <b>Resume</b>
            <small>PDF · 1 page</small>
          </div>
        </div>
      </div>

      {/* Mail */}
      <div className="pf-chip pf-chip-mail" aria-hidden="true">
        <div className="eyebrow">Say hi</div>
        <div className="addr">hello@meysa.design</div>
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────────────
// HERO · Aurora variant — soft purple gradient, italic "multidisciplinary"
// (matches the new Figma node 343:684)
// ─────────────────────────────────────────────────────────────────────
function HeroAurora() {
  return (
    <section className="pf-hero pf-hero--aurora pf-anim-fadein">
      <div className="pf-aurora-bg" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>
      <div className="pf-aurora-inner">
        <h1 className="pf-aurora-headline pf-anim-headline">
          <span className="line-1">Ciao! I'm Meysa,</span>
          <span className="line-2">a <em>multidisciplinary</em> designer</span>
        </h1>
        <p className="pf-aurora-sub pf-anim-meta">
          Shaping products and experiences that focus on people's wellbeing
        </p>
        <div className="pf-aurora-ctas pf-anim-meta">
          <a href="#work" className="pf-btn pf-btn--dark">View work</a>
          <a href="#about" className="pf-btn pf-btn--light">More about me</a>
        </div>
      </div>
      <a href="#work" className="pf-aurora-scroll" aria-label="Scroll to work">
        <span>SCROLL</span>
      </a>
    </section>);

}

// ─────────────────────────────────────────────────────────────────────
// Rotating-word headline helper
// ─────────────────────────────────────────────────────────────────────
function RotatingWord({ words, interval = 1800 }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [interval, words.length]);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    <span className="pf-rotate">
      <span className="pf-rotate-spacer" aria-hidden="true">{longest}</span>
      {words.map((w, idx) => (
        <span
          key={w}
          className={`pf-rotate-w${idx === i ? " is-active" : ""}`}
          aria-hidden={idx !== i}>
          {w}
        </span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// HERO · Statement variant (Leah Kim-style)
// ─────────────────────────────────────────────────────────────────────
function HeroStatement() {
  return (
    <section className="pf-hero pf-anim-fadein">
      <div className="pf-hero-bg" />
      <div className="pf-statement">
        <div className="pf-statement-eyebrow pf-anim-eyebrow">DesignbyMeysa · Portfolio '26</div>
        <h1 className="pf-statement-headline pf-anim-headline">
          I'm <span className="pf-statement-highlight">Meysa</span> a <RotatingWord words={["Product","UX","UI","Visual","Experience","Interaction"]} /> Designer fluent in <em>research-led</em> work.
        </h1>
      </div>
      <div className="pf-statement-meta pf-anim-meta">
        <div className="pf-statement-roles">
          <span className="pill"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" /></svg>Brand & UX</span>
          <span className="pill">Research → Ship</span>
          <span className="pill">AI · Health</span>
          <span className="pill">CV ↗</span>
        </div>
        <div className="pf-statement-avail">
          <span className="pulse" /> Open for new work · Q3 2026
        </div>
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────────────
// HERO · Wordmark variant
// ─────────────────────────────────────────────────────────────────────
function HeroWordmark() {
  return (
    <section className="pf-hero" style={{ height: 980 }}>
      <div className="pf-hero-bg" />
      <div className="pf-wordmark">
        <div className="pf-wordmark-top">
          <span>Meysa · Portfolio 2026</span>
          <span>Toronto / Remote</span>
        </div>
        <h1 className="pf-wordmark-name">
          Mey<em>s</em>a.
        </h1>
        <div className="pf-wordmark-meta">
          <div>
            <strong>Product Designer</strong>
            Brand · Product · Research
          </div>
          <div style={{ textAlign: "right" }}>
            <strong>Open for new work</strong>
            Q3 2026 — let's talk →
          </div>
        </div>
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────────────
// MOCK COVERS — visual placeholders for each project
// ─────────────────────────────────────────────────────────────────────
function MockVire() {
  return (
    <div className="pf-mock pf-mock--vire">
      <div className="laptop">
        <div className="browser-bar"><i /><i /><i /></div>
        <div className="page">
          <div className="topbar">
            <b>◆ vire</b>
            <span>For Creators · For Brands · Features · Join the Club</span>
          </div>
          <h5>Made for the<br /><em>ones who create.</em></h5>
          <p>Simplify your finances, unlock opportunities, and join a community built for creators shaping the future.</p>
          <div className="cta">Join the Club</div>
        </div>
        <div className="phone"><div className="phone-screen" /></div>
      </div>
    </div>);

}

function MockHealth() {
  return (
    <div className="pf-mock pf-mock--health">
      <div className="phone">
        <div className="screen">
          <div className="menu">
            <span className="logo">⋮⋮ OutcomeAI</span>
            <div className="bars"><i /><i /><i /></div>
          </div>
          <h6>Nurses at the core,<br />supercharged by AI</h6>
          <p>Licensed nurses, supported by AI productivity agents, reduce administrative burden and expand capacity.</p>
          <div className="care-img" />
        </div>
      </div>
    </div>);

}

function MockDheart() {
  return (
    <div className="pf-mock pf-mock--dheart">
      <svg className="pulse-line" viewBox="0 0 600 80" preserveAspectRatio="none">
        <path d="M0 40 L100 40 L120 40 L130 10 L140 70 L150 40 L250 40 L270 40 L280 10 L290 70 L300 40 L400 40 L420 40 L430 10 L440 70 L450 40 L600 40"
        stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
      </svg>
      <div className="device">
        <div className="top">
          <b>D-Heart</b>
          <span>Lead I · 60 sec</span>
        </div>
        <div className="reading">72<sub>BPM</sub></div>
        <div className="status">Sinus rhythm · within normal range</div>
      </div>
    </div>);

}

function MockArt() {
  return (
    <div className="pf-mock pf-mock--art">
      <div className="gallery">
        <div className="frame"><span>Sun ⋅ 03</span></div>
        <div className="frame"><span>Tide ⋅ 12</span></div>
        <div className="frame"><span>Bloom ⋅ 07</span></div>
      </div>
    </div>);

}

function MockSage() {
  return (
    <div className="pf-mock pf-mock--sage">
      <div className="card">
        <div className="row">
          <b>Sage Account</b>
          <span>•••• 4218</span>
        </div>
        <div className="bal">$4,820<sub>.32 CAD</sub></div>
        <div className="delta">↑ $120 this week</div>
        <div className="actions">
          <div className="act">Send</div>
          <div className="act">Receive</div>
          <div className="act">Split</div>
        </div>
      </div>
    </div>);

}

const MOCKS = {
  vire: MockVire,
  health: MockHealth,
  dheart: MockDheart,
  art: MockArt,
  sage: MockSage
};

// ─────────────────────────────────────────────────────────────────────
// Projects · scrolling-story (single column, full-bleed covers)
// ─────────────────────────────────────────────────────────────────────
function ProjectsStories() {
  return (
    <>
      <header className="pf-section-head pf-reveal" id="work">
        <div>
          <div className="l">Selected work</div>
          <h2>Latest <em>Projects</em></h2>
        </div>
        <div className="yr">2022 — 2026</div>
      </header>
      <div className="pf-stories">
        {PROJECTS.map((p, i) => {
          const Mock = MOCKS[p.mock];
          const titleParts = p.title.split(p.titleItalic);
          return (
            <article className="pf-story pf-reveal" key={p.id}
             >
              <div className="pf-story-num">/ {p.num}</div>
              <div className="pf-story-cover"
               >
                <div className="label">{p.tags[0]}</div>
                <Mock />
                <div className="corner">↗</div>
              </div>
              <div className="pf-story-content">
                <h3 className="pf-story-title">
                  {titleParts[0]}<em>{p.titleItalic}</em>{titleParts[1]}
                </h3>
                <p className="pf-story-blurb">{p.blurb}</p>
                <div className="pf-story-meta">
                  <span className="tag">{p.year}</span>
                  <span className="tag">{p.sector}</span>
                  <span className="tag">{p.role}</span>
                </div>
                <a href={`#${p.id}`} className="pf-story-link">
                  View case study <span>→</span>
                </a>
              </div>
            </article>);

        })}
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────────────
// Projects · 2-up grid (italic serif titles)
// ─────────────────────────────────────────────────────────────────────
function ProjectsGrid() {
  return (
    <>
      <header className="pf-section-head pf-reveal" id="work">
        <div>
          <div className="l">Selected work</div>
          <h2>Latest <em>Projects</em></h2>
        </div>
        <a href="#all" className="yr">View archive ↗</a>
      </header>
      <div className="pf-grid">
        {PROJECTS.slice(0, 4).map((p) => {
          const Mock = MOCKS[p.mock];
          return (
            <article className="card" key={p.id}>
              <div className="cover">
                <Mock />
              </div>
              <h3 className="title">{p.title}</h3>
              <p className="blurb">{p.blurb}</p>
              <div className="meta">
                <span>{p.year}</span>
                <span style={{ color: "var(--ink-300)" }}>/</span>
                <span style={{ flex: 1, textTransform: "uppercase", letterSpacing: ".18em", marginLeft: 8 }}>{p.sector}</span>
              </div>
            </article>);

        })}
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────────────
// Projects · bento collage
// ─────────────────────────────────────────────────────────────────────
function ProjectsBento() {
  return (
    <>
      <header className="pf-section-head pf-reveal" id="work">
        <div>
          <div className="l">Selected work</div>
          <h2>Latest <em>Projects</em></h2>
        </div>
        <div className="yr">2022 — 2026</div>
      </header>
      <div className="pf-bento">
        <div className="b b1" style={{ background: "linear-gradient(135deg,#3a1a6b,#0F0F0F)" }}>
          <div className="label">Fintech · 2024</div>
          <MockVire />
          <div className="ttl">Vire Club</div>
        </div>
        <div className="b b2 light" style={{ background: "var(--pastel-clay)" }}>
          <div className="label">Healthcare · 2025</div>
          <MockHealth />
          <div className="ttl">OutcomeAI</div>
        </div>
        <div className="b b3" style={{ background: "linear-gradient(180deg,#c83b3b,#7a1a1a)" }}>
          <div className="label">Medtech · 2023</div>
          <MockDheart />
          <div className="ttl">D-Heart</div>
        </div>
        <div className="b b4" style={{ background: "linear-gradient(180deg,#1e1a26,#0F0F0F)" }}>
          <div className="label">Culture · 2023</div>
          <MockArt />
          <div className="ttl">Art Beyond Dimension</div>
        </div>
      </div>
    </>);

}

// ─────────────────────────────────────────────────────────────────────
// Projects · Rows — stacked clay covers + side-by-side description
// (matches the new Figma node 343:684)
// ─────────────────────────────────────────────────────────────────────
function ProjectsRows() {
  const rows = PROJECTS.slice(0, 3);
  return (
    <section className="pf-rows-section" id="work">
      <header className="pf-rows-head">
        <div className="pf-rows-eyebrow">SELECTED WORKS</div>
        <a href="#all" className="pf-rows-viewall">
          VIEW ALL PROJECTS <span aria-hidden="true">→</span>
        </a>
      </header>
      <h2 className="pf-rows-title pf-reveal">Project Case Studies</h2>

      <div className="pf-rows">
        {rows.map((p, i) => (
          <article className="pf-row pf-reveal" key={p.id}>
            <a href={`#${p.id}`} className="pf-row-cover" aria-label={`Open ${p.title}`}>
              <span className="pf-row-corner" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4 10 L10 4 M5 4 H10 V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <div className="pf-row-content">
              <h3 className="pf-row-title">Project {String.fromCharCode(65 + i)}</h3>
              <p className="pf-row-blurb">{p.blurb}</p>
              <div className="pf-row-tags">
                {p.tags.slice(0, i === 1 ? 3 : 2).map((tag) => (
                  <span className="pf-row-tag" key={tag}>{tag.toUpperCase()}</span>
                ))}
              </div>
              <a href={`#${p.id}`} className="pf-row-link">
                <span>{i === 0 ? "View project" : "View case study"}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="pf-rows-viewall-bottom">
        <a href="#all">View all</a>
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────────────
// About Me — short bio + experience list
// ─────────────────────────────────────────────────────────────────────
const EXPERIENCE = [
  { role: "Design Intern", org: "Empatica" },
  { role: "Research Assistant", org: "LeNS Lab Polimi" },
  { role: "Polimi student", org: "Polimi" }
];

function AboutMe() {
  return (
    <section className="pf-about" id="about">
      <h2 className="pf-about-title pf-reveal">Somethings About Me</h2>
      <p className="pf-about-sub pf-reveal">
        A few notes on how I got here,<br />
        and what I'm chasing next.
      </p>

      <div className="pf-about-eyebrow pf-reveal">EXPERIENCE</div>
      <ul className="pf-about-list">
        {EXPERIENCE.map((e) => (
          <li className="pf-about-row pf-reveal" key={e.role}>
            <span className="role">{e.role}</span>
            <span className="org">{e.org}</span>
          </li>
        ))}
      </ul>

      <div className="pf-about-more pf-reveal">
        <a href="#cv">Learn More</a>
      </div>
    </section>);

}

// ─────────────────────────────────────────────────────────────────────
// Footer game · "Catch the ✦" — a quick reaction mini-game.
// The star pops into random spots; tap it before it escapes to build a
// streak. Best score persists in localStorage.
// ─────────────────────────────────────────────────────────────────────
function StarCatch() {
  const KEY = "pf-starcatch-best";
  const [playing, setPlaying] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [best, setBest] = React.useState(() => {
    if (typeof localStorage === "undefined") return 0;
    return Number(localStorage.getItem(KEY) || 0);
  });
  const [pos, setPos] = React.useState({ x: 50, y: 50 });
  const [pop, setPop] = React.useState(false);
  const timer = React.useRef(null);

  const place = React.useCallback(() => {
    setPos({ x: 8 + Math.random() * 84, y: 14 + Math.random() * 72 });
  }, []);

  // Each star has a shrinking lifespan; miss it and the run ends.
  const arm = React.useCallback((streak) => {
    clearTimeout(timer.current);
    const life = Math.max(620, 1500 - streak * 70);
    timer.current = setTimeout(() => endRun(), life);
  }, []);

  function endRun() {
    clearTimeout(timer.current);
    setPlaying(false);
    setBest((b) => {
      const next = Math.max(b, score);
      if (typeof localStorage !== "undefined") localStorage.setItem(KEY, String(next));
      return next;
    });
  }

  function start() {
    setScore(0);
    setPlaying(true);
    place();
    arm(0);
  }

  function hit(e) {
    e.stopPropagation();
    const next = score + 1;
    setScore(next);
    setPop(true);
    setTimeout(() => setPop(false), 180);
    place();
    arm(next);
  }

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const showBest = Math.max(best, score);

  return (
    <div className="pf-game">
      <div className="pf-game-head">
        <div className="pf-game-label">
          <span className="star">✦</span> Catch the star
        </div>
        <div className="pf-game-scores">
          <span className="now">{String(score).padStart(2, "0")}</span>
          <span className="best">BEST {String(showBest).padStart(2, "0")}</span>
        </div>
      </div>

      <div
        className={`pf-game-board${playing ? " is-playing" : ""}`}
        onClick={playing ? endRun : start}>
        {!playing && (
          <button type="button" className="pf-game-cta" onClick={(e) => { e.stopPropagation(); start(); }}>
            {showBest > 0 ? "Play again" : "Tap to play"}
          </button>
        )}
        {playing && (
          <button
            type="button"
            className={`pf-game-star${pop ? " is-pop" : ""}`}
            style={{ left: pos.x + "%", top: pos.y + "%" }}
            onClick={hit}
            aria-label="Catch the star">
            ✦
          </button>
        )}
      </div>

      <div className="pf-game-foot">
        {playing
          ? "Tap the star before it vanishes — it gets faster!"
          : score > 0
            ? `Run over — you caught ${score}. Go again?`
            : "A little something for the curious."}
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────────────────────
// Footer · Big — keep-in-touch + huge full-bleed wordmark
// (matches the new Figma node 343:684)
// ─────────────────────────────────────────────────────────────────────
function FooterBig() {
  return (
    <footer className="pf-footer-big" id="contact">
      <div className="pf-footer-big-top">
        <div className="lt">
          <h3 className="pf-reveal">Let's keep in touch!</h3>
          <div className="pf-footer-big-links">
            <a href="#li">LinkedIn</a>
            <a href="#be">Behance</a>
          </div>
        </div>
        <a href="mailto:mail@designbymeysa.com" className="pf-footer-big-mail pf-reveal">
          mail@designbymeysa.com
        </a>
      </div>

      <div className="pf-footer-big-wordmark" aria-hidden="true">DesignbyMeysa</div>

      <div className="pf-footer-big-bot">
        <span>Designed and built by Meysa</span>
        <span>©2026</span>
      </div>
    </footer>);

}

// ─────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="pf-footer" id="contact">
      <div className="pf-footer-head">
        <h3 className="pf-reveal">Let's keep <em>in touch!</em></h3>
        <div className="mail-block pf-reveal">
          <div className="e">Drop me a line</div>
          <a href="mailto:hello@meysa.design" className="addr">hello@meysa.design</a>
        </div>
      </div>
      <div className="links">
        <div className="col">
          <div className="h">Elsewhere</div>
          <a href="#li">LinkedIn ↗</a>
          <a href="#be">Behance ↗</a>
          <a href="#gh">GitHub ↗</a>
        </div>
        <div className="col">
          <div className="h">Writings</div>
          <a href="#sb">Substack ↗</a>
          <a href="#md">Read.cv ↗</a>
        </div>
        <div className="col">
          <div className="h">Calendar</div>
          <a href="#cal">Book a 30-min chat ↗</a>
        </div>
      </div>
      <div className="pf-footer-bot">
        <div>© 2026 <span className="star">✦</span> DesignbyMeysa</div>
        <div>Designed &amp; built in Toronto</div>
      </div>
    </footer>);

}

// ─────────────────────────────────────────────────────────────────────
// Portfolio — composer (hero variant + project layout)
// ─────────────────────────────────────────────────────────────────────
function Portfolio({ hero = "aurora", projects = "rows" }) {
  let HeroComp = HeroAurora;
  if (hero === "collage") HeroComp = HeroCollage;
  if (hero === "statement") HeroComp = HeroStatement;
  if (hero === "wordmark") HeroComp = HeroWordmark;

  let ProjectsComp = ProjectsRows;
  if (projects === "stories") ProjectsComp = ProjectsStories;
  if (projects === "grid") ProjectsComp = ProjectsGrid;
  if (projects === "bento") ProjectsComp = ProjectsBento;

  const isNew = hero === "aurora" && projects === "rows";
  const FooterComp = isNew ? FooterBig : Footer;

  return (
    <div className="pf" data-screen-label={`Portfolio · ${hero} / ${projects}`}>
      <Nav />
      <HeroComp />
      <MarqueeBand />
      <ProjectsComp />
      {isNew && <AboutMe />}
      <FooterComp />
    </div>);

}


// ─────────────────────────────────────────────────────────────────────
// Reveal-on-scroll: any element with class `pf-reveal` gets `.is-in`
// added the first time it enters the viewport. CSS does the transition.
// ─────────────────────────────────────────────────────────────────────
function installRevealObserver(root = document) {
  const els = root.querySelectorAll('.pf-reveal:not(.is-in)');
  if (!els.length || !window.IntersectionObserver) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
  els.forEach((el) => io.observe(el));
}
// Re-run after every render so layout switches in Tweaks are picked up.
if (typeof window !== 'undefined') {
  const reinstall = () => {
    requestAnimationFrame(() => installRevealObserver());
  };
  window.addEventListener('load', reinstall);
  // Also kick off shortly after script load
  setTimeout(reinstall, 50);
  setTimeout(reinstall, 250);
  setTimeout(reinstall, 600);
}

Object.assign(window, {
  installRevealObserver,
  Portfolio,
  Nav,
  MarqueeBand,
  HeroAurora,
  HeroCollage,
  HeroStatement,
  HeroWordmark,
  ProjectsRows,
  ProjectsStories,
  ProjectsGrid,
  ProjectsBento,
  AboutMe,
  Footer,
  FooterBig,
  StarCatch,
  PROJECTS
});