/* global React, ReactDOM, Portfolio,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect */

// ─────────────────────────────────────────────────────────────────────
// Portfolio refresh — single full-bleed view (Variation B: statement hero).
// Tweaks panel keeps the hero + project-layout switches so the design
// can still be explored from this one direction.
// ─────────────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "aurora",
  "projects": "rows"
}/*EDITMODE-END*/;

const HERO_OPTIONS = [
  { value: "aurora", label: "Aurora (new)" },
  { value: "collage", label: "Collage" },
  { value: "statement", label: "Statement" },
  { value: "wordmark", label: "Wordmark" },
];

const PROJECT_OPTIONS = [
  { value: "rows", label: "Case-study rows (new)" },
  { value: "stories", label: "Scrolling story" },
  { value: "grid", label: "2-up grid" },
  { value: "bento", label: "Bento collage" },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <>
      <div className="pf-shell">
        <Portfolio hero={t.hero} projects={t.projects} />
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero">
          <TweakSelect
            label="Treatment"
            value={t.hero}
            onChange={(v) => setTweak("hero", v)}
            options={HERO_OPTIONS}
          />
        </TweakSection>
        <TweakSection label="Projects">
          <TweakSelect
            label="Layout"
            value={t.projects}
            onChange={(v) => setTweak("projects", v)}
            options={PROJECT_OPTIONS}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
