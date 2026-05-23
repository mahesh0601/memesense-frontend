import { useMemo, useState } from "react";
import { MemeFlowContext } from "./memeFlowContext";

const initialFlow = {
  userName: "",
  uploadedImage: null,
  imageId: null,
  uploadStatus: "idle",
  uploadError: null,
  memeIdeas: null,
  memeIdeasSource: null,
  memeGenerationStatus: "idle",
  memeGenerationError: null,
  memeContext: "",
  suggestions: [],
  imageSummary: "",
  funnySignals: [],
  currentDraft: null,
};

export function MemeFlowProvider({ children }) {
  const [flow, setFlow] = useState(initialFlow);

  const value = useMemo(
    () => ({
      flow,
      setUserName: (userName) => setFlow((current) => ({ ...current, userName })),
      setUploadedImage: (uploadedImage) =>
        setFlow((current) => ({ ...current, uploadedImage })),
      setImageId: (imageId) => setFlow((current) => ({ ...current, imageId })),
      setUploadStatus: (uploadStatus) =>
        setFlow((current) => ({ ...current, uploadStatus })),
      setUploadError: (uploadError) =>
        setFlow((current) => ({ ...current, uploadError })),
      setMemeIdeas: (memeIdeas) =>
        setFlow((current) => ({ ...current, memeIdeas })),
      setMemeIdeasSource: (memeIdeasSource) =>
        setFlow((current) => ({ ...current, memeIdeasSource })),
      setMemeGenerationStatus: (memeGenerationStatus) =>
        setFlow((current) => ({ ...current, memeGenerationStatus })),
      setMemeGenerationError: (memeGenerationError) =>
        setFlow((current) => ({ ...current, memeGenerationError })),
      setMemeContext: (memeContext) =>
        setFlow((current) => ({ ...current, memeContext })),
      setSuggestions: ({ suggestions, imageSummary = "", funnySignals = [] }) =>
        setFlow((current) => ({
          ...current,
          suggestions,
          imageSummary,
          funnySignals,
        })),
      setCurrentDraft: (currentDraft) =>
        setFlow((current) => ({ ...current, currentDraft })),
      resetFlow: () => setFlow(initialFlow),
    }),
    [flow],
  );

  return (
    <MemeFlowContext.Provider value={value}>{children}</MemeFlowContext.Provider>
  );
}
