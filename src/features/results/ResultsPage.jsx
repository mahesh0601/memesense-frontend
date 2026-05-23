import { useMemo, useState } from "react";
import { navigateTo } from "../../app/router/navigation";
import { StepRail } from "../../components/shared/StepRail";
import { Button } from "../../components/ui/Button";
import { useMemeFlow } from "../../state/useMemeFlow";
import { FALLBACK_CAPTION_IDEAS } from "../../data/fallbackCaptionIdeas";
import { CaptionIdeaCard } from "./components/CaptionIdeaCard";
import { MemeEditorPanel } from "./components/MemeEditorPanel";
import { MemePreview } from "./components/MemePreview";
import { generateMemeImage } from "./utils/generateMemeImage";

export function ResultsPage() {
  const { flow, setCurrentDraft } = useMemeFlow();

  const ideasToShow = useMemo(() => {
    return flow.memeIdeas?.length ? flow.memeIdeas : FALLBACK_CAPTION_IDEAS;
  }, [flow.memeIdeas]);

  const firstIdea = ideasToShow[0];
  const [selectedIdeaId, setSelectedIdeaId] = useState(firstIdea.id);
  const [topText, setTopText] = useState(firstIdea.topText);
  const [bottomText, setBottomText] = useState(firstIdea.bottomText);
  const [fontStyle, setFontStyle] = useState("classic");
  const [textColor, setTextColor] = useState("white");
  const [outlineColor, setOutlineColor] = useState("black");
  const [positionMode, setPositionMode] = useState("top-bottom");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [trackedIdeas, setTrackedIdeas] = useState(ideasToShow);

  if (trackedIdeas !== ideasToShow) {
    setTrackedIdeas(ideasToShow);
    setSelectedIdeaId(firstIdea.id);
    setTopText(firstIdea.topText);
    setBottomText(firstIdea.bottomText);
  }

  function selectIdea(idea) {
    setSelectedIdeaId(idea.id);
    setTopText(idea.topText);
    setBottomText(idea.bottomText);
  }

  async function handleExport() {
    if (!flow.uploadedImage || isExporting) {
      return;
    }
    setIsExporting(true);
    setExportError(null);
    try {
      const dataUrl = await generateMemeImage({
        image: flow.uploadedImage,
        topText,
        bottomText,
        textColor,
        outlineColor,
        positionMode,
        fontStyle,
      });
      setCurrentDraft({
        dataUrl,
        topText,
        bottomText,
        ideaTitle: selectedIdea.title,
        fileName: flow.uploadedImage.fileName,
      });
      navigateTo("/share/preview");
    } catch (error) {
      console.error("[MEMESENSE] Failed to bake meme image", error);
      setExportError("Could not export this meme. Try again.");
    } finally {
      setIsExporting(false);
    }
  }

  const selectedIdea =
    ideasToShow.find((idea) => idea.id === selectedIdeaId) ?? firstIdea;

  if (!flow.uploadedImage) {
    return (
      <section className="results-page results-fallback-page">
        <span className="home-texture" aria-hidden="true" />
        <span className="home-blob home-blob-one" aria-hidden="true" />
        <span className="home-blob home-blob-two" aria-hidden="true" />
        <span className="home-blob home-blob-three" aria-hidden="true" />

        <div className="state-panel no-evidence-panel">
          <span className="eyebrow">Step 4</span>
          <h1>No evidence found.</h1>
          <p>Upload a photo first so MemeSense has something to ruin.</p>
          <Button type="button" onClick={() => navigateTo("/upload")}>
            Upload photo
          </Button>
        </div>

        <div className="step-rail-wrapper">
          <StepRail activeStep={4} />
        </div>
      </section>
    );
  }

  return (
    <section className="results-page">
      <span className="home-texture" aria-hidden="true" />
      <span className="home-blob home-blob-one" aria-hidden="true" />
      <span className="home-blob home-blob-two" aria-hidden="true" />
      <span className="home-blob home-blob-three" aria-hidden="true" />

      <div className="results-workspace">
        <div className="preview-column">
          <MemePreview
            bottomText={bottomText}
            fontStyle={fontStyle}
            image={flow.uploadedImage}
            outlineColor={outlineColor}
            positionMode={positionMode}
            selectedIdeaTitle={selectedIdea.title}
            textColor={textColor}
            topText={topText}
          />
        </div>

        <aside className="controls-column">
          <div className="controls-scroll">
            <div className="caption-ideas-panel caption-panel">
              <p className="sample-panel-title">Caption angles</p>
              <div className="caption-ideas-grid caption-grid">
                {ideasToShow.map((idea) => (
                  <CaptionIdeaCard
                    idea={idea}
                    isSelected={idea.id === selectedIdeaId}
                    key={idea.id}
                    onSelect={() => selectIdea(idea)}
                  />
                ))}
              </div>
            </div>

            <div className="results-quick-actions results-actions">
              <Button
                type="button"
                onClick={() => setIsEditorOpen((isOpen) => !isOpen)}
                variant="secondary"
                className="secondary-action"
              >
                {isEditorOpen ? "Hide tweaks" : "Tweak text ✏️"}
              </Button>
              <Button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="primary-action"
              >
                {isExporting ? "Baking…" : "Looks dangerous 🔥"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="try-photo-button secondary-action"
                onClick={() => navigateTo("/upload")}
              >
                Try another photo
              </Button>
              {exportError ? (
                <p className="results-note-inline">{exportError}</p>
              ) : null}
            </div>

            {isEditorOpen ? (
              <div className="editor-panel">
                <MemeEditorPanel
                  bottomText={bottomText}
                  fontStyle={fontStyle}
                  outlineColor={outlineColor}
                  positionMode={positionMode}
                  setBottomText={setBottomText}
                  setFontStyle={setFontStyle}
                  setOutlineColor={setOutlineColor}
                  setPositionMode={setPositionMode}
                  setTextColor={setTextColor}
                  setTopText={setTopText}
                  textColor={textColor}
                  topText={topText}
                />
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      <div className="step-rail-wrapper">
        <StepRail activeStep={4} />
      </div>
    </section>
  );
}
