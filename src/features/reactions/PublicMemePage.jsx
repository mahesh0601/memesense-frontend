import { useEffect, useState } from "react";
import { navigateTo } from "../../app/router/navigation";
import { Button } from "../../components/ui/Button";
import {
  REACTION_TYPES,
  REACTION_META,
  addReaction,
  buildImageUrl,
  fetchMeme,
} from "../../api/memeShareApi";

const STORAGE_KEY_PREFIX = "memesense.reacted.";

function getReactedTypes(memeId) {
  try {
    const raw = window.sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${memeId}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function persistReactedTypes(memeId, set) {
  try {
    window.sessionStorage.setItem(
      `${STORAGE_KEY_PREFIX}${memeId}`,
      JSON.stringify([...set]),
    );
  } catch {
    // sessionStorage unavailable — silent
  }
}

function extractMemeId(pathname) {
  const match = pathname.match(/^\/m\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function PublicMemePage() {
  const memeId = extractMemeId(window.location.pathname);
  const [meme, setMeme] = useState(null);
  const [loadStatus, setLoadStatus] = useState(memeId ? "loading" : "error");
  const [loadError, setLoadError] = useState(memeId ? null : "Missing meme id.");
  const [pendingType, setPendingType] = useState(null);
  const [reactedTypes, setReactedTypes] = useState(
    memeId ? getReactedTypes(memeId) : new Set(),
  );

  useEffect(() => {
    if (!memeId) {
      return undefined;
    }
    let cancelled = false;
    fetchMeme(memeId)
      .then((data) => {
        if (cancelled) return;
        setMeme(data);
        setLoadStatus("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setMeme(null);
        setLoadStatus("error");
        setLoadError(error?.message || "Could not load this meme.");
      });
    return () => {
      cancelled = true;
    };
  }, [memeId]);

  async function handleReact(type) {
    if (!meme || pendingType || reactedTypes.has(type)) {
      return;
    }
    setPendingType(type);
    try {
      const reactions = await addReaction(meme.id, type);
      setMeme((current) => (current ? { ...current, reactions } : current));
      setReactedTypes((current) => {
        const next = new Set(current);
        next.add(type);
        persistReactedTypes(meme.id, next);
        return next;
      });
    } catch (error) {
      console.error("[MEMESENSE] Reaction failed", error);
    } finally {
      setPendingType(null);
    }
  }

  if (loadStatus === "loading") {
    return (
      <section className="public-meme-page">
        <p className="public-meme-status">Loading meme…</p>
      </section>
    );
  }

  if (loadStatus === "error" || !meme) {
    return (
      <section className="public-meme-page">
        <span className="home-texture" aria-hidden="true" />
        <span className="home-blob home-blob-one" aria-hidden="true" />
        <div className="public-meme-fallback">
          <h1>Meme not found.</h1>
          <p>{loadError || "This link is broken or has expired."}</p>
          <Button type="button" onClick={() => navigateTo("/")}>
            Cook your own meme
          </Button>
        </div>
      </section>
    );
  }

  const imageSrc = buildImageUrl(meme.imageUrl);
  const reactions = meme.reactions || {};

  return (
    <section className="public-meme-page">
      <span className="home-texture" aria-hidden="true" />
      <span className="home-blob home-blob-one" aria-hidden="true" />
      <span className="home-blob home-blob-two" aria-hidden="true" />

      <div className="public-meme-header">
        <span className="eyebrow">MemeSense drop</span>
        <h1>{meme.ideaTitle || "Caption damage"}</h1>
        {meme.alias ? (
          <p className="public-meme-alias">by {meme.alias}</p>
        ) : null}
      </div>

      <figure className="public-meme-figure">
        {imageSrc ? (
          <img className="public-meme-image" src={imageSrc} alt={meme.ideaTitle || "Meme"} />
        ) : null}
      </figure>

      <div className="public-meme-reactions" role="group" aria-label="React to this meme">
        {REACTION_TYPES.map((type) => {
          const meta = REACTION_META[type];
          const count = reactions[type] ?? 0;
          const isReacted = reactedTypes.has(type);
          const isPending = pendingType === type;
          return (
            <button
              key={type}
              type="button"
              className={`reaction-button${isReacted ? " is-reacted" : ""}`}
              onClick={() => handleReact(type)}
              disabled={isReacted || isPending}
              aria-label={`${meta.label} (${count})`}
            >
              <span className="reaction-emoji" aria-hidden="true">
                {meta.emoji}
              </span>
              <span className="reaction-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="public-meme-footer">
        <Button
          type="button"
          variant="secondary"
          className="secondary-action"
          onClick={() => navigateTo("/")}
        >
          Cook your own meme
        </Button>
      </div>
    </section>
  );
}
