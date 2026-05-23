import { useEffect, useState } from "react";
import { navigateTo } from "../../app/router/navigation";
import { Button } from "../../components/ui/Button";
import { useMemeFlow } from "../../state/useMemeFlow";
import { publishMeme } from "../../api/memeShareApi";

function slugify(value) {
  return String(value || "memesense")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "memesense";
}

export function SharePage() {
  const { flow, setCurrentDraft } = useMemeFlow();
  const draft = flow.currentDraft;
  const [publishStatus, setPublishStatus] = useState(
    draft?.shareUrl ? "ready" : "idle",
  );
  const [publishError, setPublishError] = useState(null);
  const [copyState, setCopyState] = useState(null);

  useEffect(() => {
    if (!draft?.dataUrl) {
      navigateTo("/results", { replace: true });
    }
  }, [draft?.dataUrl]);

  if (!draft?.dataUrl) {
    return null;
  }

  const downloadFileName = `memesense-${slugify(draft.ideaTitle)}.png`;
  const shareUrl = draft.shareUrl
    ? `${window.location.origin}${draft.shareUrl}`
    : null;

  async function handlePublish() {
    if (publishStatus === "publishing") {
      return;
    }
    setPublishStatus("publishing");
    setPublishError(null);
    try {
      const result = await publishMeme({
        dataUrl: draft.dataUrl,
        topText: draft.topText,
        bottomText: draft.bottomText,
        ideaTitle: draft.ideaTitle,
        alias: flow.userName,
      });
      setCurrentDraft({
        ...draft,
        memeId: result.memeId,
        shareUrl: result.publicPath || `/m/${result.memeId}`,
        remoteImageUrl: result.imageUrl,
      });
      setPublishStatus("ready");
    } catch (error) {
      console.error("[MEMESENSE] Publish failed", error);
      setPublishError(error?.message || "Could not publish this meme.");
      setPublishStatus("idle");
    }
  }

  async function handleCopyLink() {
    if (!shareUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("Link copied.");
    } catch {
      setCopyState("Copy failed — select the URL manually.");
    }
  }

  function handleOpenLink() {
    if (!shareUrl) {
      return;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = draft.dataUrl;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <section className="share-page">
      <span className="home-texture" aria-hidden="true" />
      <span className="home-blob home-blob-one" aria-hidden="true" />
      <span className="home-blob home-blob-two" aria-hidden="true" />
      <span className="home-blob home-blob-three" aria-hidden="true" />

      <div className="share-intro">
        <span className="eyebrow">Meme baked 🔥</span>
        <h1>Your meme is ready.</h1>
        <p>Generate a share link or download the image.</p>
      </div>

      <div className="share-stage">
        <img
          className="share-image"
          src={draft.dataUrl}
          alt={draft.ideaTitle ? `Meme: ${draft.ideaTitle}` : "Exported meme"}
        />
        {draft.ideaTitle ? (
          <p className="share-caption">Selected: {draft.ideaTitle}</p>
        ) : null}
      </div>

      {shareUrl ? (
        <div className="share-link-card">
          <p className="share-link-label">Share this link</p>
          <div className="share-link-row">
            <input
              className="share-link-input"
              readOnly
              value={shareUrl}
              onFocus={(event) => event.target.select()}
            />
            <Button
              type="button"
              className="primary-action"
              onClick={handleCopyLink}
            >
              Copy
            </Button>
          </div>
          <div className="share-link-actions">
            <Button
              type="button"
              variant="secondary"
              className="secondary-action"
              onClick={handleOpenLink}
            >
              Open link
            </Button>
            {copyState ? <span className="share-status">{copyState}</span> : null}
          </div>
        </div>
      ) : (
        <Button
          type="button"
          className="primary-action share-publish-button"
          onClick={handlePublish}
          disabled={publishStatus === "publishing"}
        >
          {publishStatus === "publishing" ? "Generating link…" : "Share 🚀"}
        </Button>
      )}

      {publishError ? <p className="share-status">{publishError}</p> : null}

      <div className="share-actions">
        <Button
          type="button"
          variant="secondary"
          className="secondary-action"
          onClick={handleDownload}
        >
          Download
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="secondary-action"
          onClick={() => navigateTo("/upload")}
        >
          Upload another
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="secondary-action"
          onClick={() => navigateTo("/")}
        >
          Home
        </Button>
      </div>
    </section>
  );
}
