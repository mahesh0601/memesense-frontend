import { useEffect, useRef, useState } from "react";
import { navigateTo } from "../../app/router/navigation";
import { StepRail } from "../../components/shared/StepRail";
import { Button } from "../../components/ui/Button";
import { useMemeFlow } from "../../state/useMemeFlow";
import { generateMemeCaptions } from "../../api/memeApi";
import { FALLBACK_CAPTION_IDEAS } from "../../data/fallbackCaptionIdeas";

const loadingStatuses = [
  "👀 Analyzing the roast potential...",
  "🧪 Checking if this is friendship-safe...",
  "🔥 Measuring group chat damage...",
  "🧠 Cooking caption angle 3 of 6...",
  "📸 Detecting meme-worthy awkwardness...",
  "💀 Almost done. This one might hurt.",
];

function getMetaStatusText(memeGenerationStatus, memeIdeasSource) {
  if (memeGenerationStatus === "loading" || memeGenerationStatus === "idle") {
    return "Calling meme brain...";
  }
  if (memeGenerationStatus === "success" && memeIdeasSource !== "LOCAL_FALLBACK") {
    return "Caption damage ready.";
  }
  return "AI tripped. Local chaos loaded.";
}

export function CookingLoadingScreen() {
  const {
    flow,
    setMemeIdeas,
    setMemeIdeasSource,
    setMemeGenerationStatus,
    setMemeGenerationError,
  } = useMemeFlow();
  const [statusIndex, setStatusIndex] = useState(0);
  const captionsKickedOffRef = useRef(false);

  const isReady =
    flow.memeGenerationStatus === "success" ||
    flow.memeGenerationStatus === "error";

  useEffect(() => {
    if (!flow.uploadedImage) {
      navigateTo("/upload", { replace: true });
    }
  }, [flow.uploadedImage]);

  useEffect(() => {
    if (isReady) {
      return undefined;
    }
    const statusIntervalId = window.setInterval(() => {
      setStatusIndex((currentIndex) => (currentIndex + 1) % loadingStatuses.length);
    }, 1500);
    return () => window.clearInterval(statusIntervalId);
  }, [isReady]);

  useEffect(() => {
    if (captionsKickedOffRef.current) {
      return;
    }

    if (flow.imageId) {
      captionsKickedOffRef.current = true;
      const alias = flow.userName || "Bro";
      const context = flow.memeContext;

      console.log("[MEMESENSE] Caption generation started");
      setMemeGenerationStatus("loading");
      setMemeGenerationError(null);

      generateMemeCaptions(flow.imageId, alias, context)
        .then((data) => {
          console.log(
            "[MEMESENSE] Caption generation success source:",
            data.source,
          );
          const ideas = Array.isArray(data.ideas) && data.ideas.length > 0
            ? data.ideas
            : FALLBACK_CAPTION_IDEAS;
          setMemeIdeas(ideas);
          setMemeIdeasSource(data.source || "AI");
          setMemeGenerationStatus("success");
        })
        .catch((error) => {
          console.error(
            "[MEMESENSE] Caption generation failed, using local fallback",
            error,
          );
          setMemeIdeas(FALLBACK_CAPTION_IDEAS);
          setMemeIdeasSource("LOCAL_FALLBACK");
          setMemeGenerationError(error?.message || "Caption generation failed");
          setMemeGenerationStatus("error");
        });
      return;
    }

    if (flow.uploadStatus === "error") {
      captionsKickedOffRef.current = true;
      console.log("[MEMESENSE] No imageId — loading local fallback captions");
      setMemeIdeas(FALLBACK_CAPTION_IDEAS);
      setMemeIdeasSource("LOCAL_FALLBACK");
      setMemeGenerationStatus("error");
    }
  }, [
    flow.imageId,
    flow.uploadStatus,
    flow.userName,
    flow.memeContext,
    setMemeGenerationError,
    setMemeGenerationStatus,
    setMemeIdeas,
    setMemeIdeasSource,
  ]);

  if (!flow.uploadedImage) {
    return null;
  }

  const metaStatusText = getMetaStatusText(
    flow.memeGenerationStatus,
    flow.memeIdeasSource,
  );

  return (
    <section className="upload-page cooking-page">
      <span className="home-texture" aria-hidden="true" />
      <span className="home-blob home-blob-one" aria-hidden="true" />
      <span className="home-blob home-blob-two" aria-hidden="true" />
      <span className="home-blob home-blob-three" aria-hidden="true" />

      <div className="page-heading upload-heading cooking-heading">
        <span className="eyebrow">Step 3</span>
        <h1>
          <span>Touch some grass.</span>
          <span>We’re cooking your meme.</span>
        </h1>
        <p>Hold on. Let him cook.</p>
      </div>

      <div className="upload-lab-grid cooking-lab-grid">
        <div className="cooking-visual-card" aria-label="Meme cooking placeholder">
          <div className="steam-stack" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="chef-face" aria-hidden="true">
            <span className="chef-hat">👨‍🍳</span>
          </div>
          <strong>LET HIM COOK</strong>
        </div>

        <aside className="cooking-status-card" aria-label="Cooking status">
          <p className="sample-panel-title">Model thought</p>
          <span className="file-chip">{flow.uploadedImage.fileName}</span>
          <div className="loading-status-panel">
            <p key={isReady ? "ready" : statusIndex} className="loading-status-text">
              {isReady ? "💀 Damage report ready." : loadingStatuses[statusIndex]}
            </p>
            <p className="loading-meta-status">{metaStatusText}</p>
            {!isReady ? (
              <div className="fake-progress" aria-label="Loading">
                <span />
              </div>
            ) : null}
            {isReady ? (
              <Button onClick={() => navigateTo("/results")}>
                Show me the damage 💀
              </Button>
            ) : null}
          </div>
        </aside>
      </div>

      <StepRail activeStep={3} />
    </section>
  );
}
