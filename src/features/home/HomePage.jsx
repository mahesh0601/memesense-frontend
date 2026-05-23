import { useEffect, useState } from "react";
import { navigateTo } from "../../app/router/navigation";
import { useMemeFlow } from "../../state/useMemeFlow";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { StepRail } from "../../components/shared/StepRail";

const labStatuses = [
  "🧪 Testing joke chemicals",
  "🧠 Teaching AI sarcasm",
  "👀 Scanning awkward vibes",
  "🔥 Heating up caption engine",
  "⚠️ Humor levels unstable",
  "🧬 Mutating photos into memes",
];

const RANDOM_ALIASES = [
  "Meme Maharaja",
  "Roast Reddy",
  "Caption Chotu",
  "Brozilla",
  "Screenshot Swamy",
  "Vibe Villain",
  "Meme Baba",
  "Chaos Kumar",
  "Group Chat Ghost",
  "Lord of LOLs",
  "Evidence Expert",
  "Roast Rocket",
];

const VISIBLE_ALIAS_CHIPS = ["Meme Maharaja", "Brozilla", "Roast Rocket"];

function getRandomAlias() {
  return RANDOM_ALIASES[Math.floor(Math.random() * RANDOM_ALIASES.length)];
}

export function HomePage() {
  const { flow, setUserName } = useMemeFlow();
  const [name, setName] = useState(flow.userName || "");
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStatusIndex((currentIndex) => (currentIndex + 1) % labStatuses.length);
    }, 2400);

    return () => window.clearInterval(intervalId);
  }, []);

  const hasInput = name.trim().length > 0;

  function handleSubmit(event) {
    event.preventDefault();
    const cleanName = name.trim();
    const finalAlias = cleanName || getRandomAlias();

    setUserName(finalAlias);
    navigateTo("/upload");
  }

  return (
    <section className="home-page">
      <span className="home-texture" aria-hidden="true" />
      <span className="home-blob home-blob-one" aria-hidden="true" />
      <span className="home-blob home-blob-two" aria-hidden="true" />
      <span className="home-blob home-blob-three" aria-hidden="true" />

      <div className="home-content home-hero">
        <div className="home-copy">
          <span className="eyebrow status-badge" aria-live="polite">
            <span key={statusIndex} className="status-badge-text">
              {labStatuses[statusIndex]}
            </span>
          </span>
          <h1>Turn awkward photos into dangerously accurate memes.</h1>
          <p>
            Upload a photo. MemeSense reads the vibe, finds the joke, and gives
            you captions before your group chat does.
          </p>
          <div className="feature-chips" aria-label="MemeSense features">
            <span>👀 Vibe detection</span>
            <span>🧠 Joke reasoning</span>
            <span>🔥 Caption chaos</span>
          </div>
        </div>

        <Card className="name-card alias-card">
          <div className="terminal-header">
            <p className="access-label">MEME LAB ACCESS</p>
            <p>Alias optional. Chaos guaranteed.</p>
          </div>
          <div className="card-title-row">
            <span aria-hidden="true">🧪</span>
            <h2>What should we call you?</h2>
          </div>
          <form className="name-form" onSubmit={handleSubmit}>
            <label htmlFor="user-name">YOUR MEME ALIAS</label>
            <div className="name-form-row">
              <Input
                id="user-name"
                name="user-name"
                placeholder="e.g. Meme Lord Mahesh"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="given-name"
              />
              <Button type="submit">
                {hasInput ? "Enter the Lab 🚀" : "Random alias 🎲"}
              </Button>
            </div>
            <p className="name-helper alias-helper">
              Skip it and we’ll invent one.
            </p>

            <div className="alias-suggestions">
              <p className="alias-suggestions-label">Quick picks:</p>
              <div className="alias-chip-list">
                {VISIBLE_ALIAS_CHIPS.map((alias) => (
                  <button
                    key={alias}
                    type="button"
                    className="alias-chip"
                    onClick={() => setName(alias)}
                  >
                    {alias}
                  </button>
                ))}
              </div>
            </div>

            <p className="lab-rule">
              Lab rule #1: don’t upload what you can’t defend in the group
              chat.
            </p>
          </form>
        </Card>
      </div>

      <div className="step-rail-wrapper">
        <StepRail activeStep={1} />
      </div>
    </section>
  );
}
