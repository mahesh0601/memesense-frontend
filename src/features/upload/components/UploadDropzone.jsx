import { useRef, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

export function UploadDropzone({
  onContinue,
  onImageSelected,
  uploadedImage,
  context = "",
  onContextChange,
  contextSuggestions = [],
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFiles(files) {
    const [file] = Array.from(files || []);

    if (file) {
      onImageSelected(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <Card
      className={`upload-placeholder ${isDragging ? "upload-placeholder-active" : ""}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        className="visually-hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => handleFiles(event.target.files)}
      />

      {uploadedImage ? (
        <div className="upload-preview-state">
          <div className="upload-placeholder-copy">
            <h2>Evidence loaded</h2>
            <p>Give it one last look before the model starts cooking.</p>
          </div>
          <div className="uploaded-image-preview">
            <img
              alt={`Preview of ${uploadedImage.fileName}`}
              src={uploadedImage.previewUrl}
            />
          </div>
          <span className="file-chip">{uploadedImage.fileName}</span>

          <div className="upload-context">
            <label htmlFor="meme-context" className="upload-context-label">
              Vibe (optional)
            </label>
            <input
              id="meme-context"
              className="input upload-context-input"
              type="text"
              value={context}
              onChange={(event) => onContextChange?.(event.target.value)}
              placeholder="e.g. hackathon, monday morning, family dinner"
              maxLength={80}
            />
            {contextSuggestions.length > 0 ? (
              <div className="upload-context-chips">
                {contextSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="upload-context-chip"
                    onClick={() => onContextChange?.(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="upload-action-row">
            <Button onClick={onContinue}>Let him cook</Button>
            <Button onClick={openFilePicker} variant="secondary">
              Choose different
            </Button>
          </div>
          <p className="upload-warning">
            Warning: group chat damage may be irreversible.
          </p>
        </div>
      ) : (
        <>
          <span className="upload-icon" aria-hidden="true">
            ⇧
          </span>
          <div className="upload-placeholder-copy">
            <h2>Upload the photo</h2>
            <p>
              {isDragging
                ? "Release the evidence 👀"
                : "Drag photo here, or choose from your device."}
            </p>
          </div>
          <Button onClick={openFilePicker}>Choose photo</Button>
          <p className="upload-warning">
            Warning: group chat damage may be irreversible.
          </p>
        </>
      )}
    </Card>
  );
}
