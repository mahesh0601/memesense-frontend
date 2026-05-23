import { StepRail } from "../../components/shared/StepRail";
import { navigateTo } from "../../app/router/navigation";
import { useMemeFlow } from "../../state/useMemeFlow";
import { uploadImage } from "../../api/memeApi";
import { RotatingMemeImagePreview } from "./components/RotatingMemeImagePreview";
import { UploadDropzone } from "./components/UploadDropzone";

const CONTEXT_SUGGESTIONS = [
  "hackathon",
  "monday morning",
  "family dinner",
  "office life",
];

export function UploadPage() {
  const {
    flow,
    setUploadedImage,
    setImageId,
    setUploadStatus,
    setUploadError,
    setMemeContext,
  } = useMemeFlow();
  const displayName = flow.userName || "meme scientist";

  function continueToCooking() {
    if (flow.uploadedImage) {
      navigateTo("/cooking");
    }
  }

  async function handleImageSelected(file) {
    if (!file) {
      return;
    }

    if (flow.uploadedImage?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(flow.uploadedImage.previewUrl);
    }

    setUploadedImage({
      id: crypto.randomUUID(),
      file,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      source: "upload",
    });

    setImageId(null);
    setUploadError(null);
    setUploadStatus("loading");

    console.log("[MEMESENSE] Upload started");

    try {
      const data = await uploadImage(file);
      console.log("[MEMESENSE] Upload success imageId:", data.imageId);
      setImageId(data.imageId);
      setUploadStatus("success");
    } catch (error) {
      console.log("[MEMESENSE] Upload failed, using local flow", error);
      setImageId(null);
      setUploadError(error?.message || "Upload failed");
      setUploadStatus("error");
    }
  }

  return (
    <section className="upload-page">
      <span className="home-texture" aria-hidden="true" />
      <span className="home-blob home-blob-one" aria-hidden="true" />
      <span className="home-blob home-blob-two" aria-hidden="true" />
      <span className="home-blob home-blob-three" aria-hidden="true" />

      <div className="page-heading upload-heading">
        <span className="eyebrow">Step 2</span>
        <h1>Drop the evidence, {displayName}.</h1>
        <p>One photo. Six meme angles. Choose wisely.</p>
        {!flow.uploadedImage ? (
          <p className="upload-limits-hint">
            PNG, JPEG, or WebP. Max 5MB.
          </p>
        ) : null}
        {flow.uploadError ? (
          <p className="upload-error-banner" role="alert">
            ⚠️ {flow.uploadError}
          </p>
        ) : null}
      </div>

      <div className="upload-lab-grid">
        <UploadDropzone
          onContinue={continueToCooking}
          onImageSelected={handleImageSelected}
          uploadedImage={flow.uploadedImage}
          context={flow.memeContext}
          onContextChange={setMemeContext}
          contextSuggestions={CONTEXT_SUGGESTIONS}
        />
        <RotatingMemeImagePreview />
      </div>

      <StepRail activeStep={2} />
    </section>
  );
}
