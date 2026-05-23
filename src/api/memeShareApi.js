const API_BASE_URL = "https://memesense-backend.onrender.com";

export const REACTION_TYPES = ["fire", "skull", "laugh", "cry", "heart"];

export const REACTION_META = {
  fire: { emoji: "🔥", label: "Damage" },
  skull: { emoji: "💀", label: "Destroyed" },
  laugh: { emoji: "😂", label: "Cackled" },
  cry: { emoji: "😭", label: "Crying" },
  heart: { emoji: "❤️", label: "Loved" },
};

export function buildImageUrl(pathOrUrl) {
  if (!pathOrUrl) {
    return null;
  }
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return `${API_BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    if (data && typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }
  } catch {
    // not JSON
  }
  return null;
}

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

export async function publishMeme({
  dataUrl,
  topText,
  bottomText,
  ideaTitle,
  alias,
}) {
  const blob = await dataUrlToBlob(dataUrl);
  const formData = new FormData();
  formData.append("image", blob, "meme.png");
  formData.append("topText", topText || "");
  formData.append("bottomText", bottomText || "");
  formData.append("ideaTitle", ideaTitle || "");
  if (alias) {
    formData.append("alias", alias);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/memes/publish`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Couldn't reach the share service.");
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || `Publish failed (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.success || !data.memeId) {
    throw new Error(data.message || "Invalid publish response");
  }
  return data;
}

export async function fetchMeme(memeId) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/memes/${encodeURIComponent(memeId)}`);
  } catch {
    throw new Error("Couldn't reach the meme service.");
  }

  if (response.status === 404) {
    throw new Error("This meme could not be found.");
  }
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || `Fetch failed (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.success || !data.meme) {
    throw new Error(data.message || "Invalid meme response");
  }
  return data.meme;
}

export async function addReaction(memeId, type) {
  if (!REACTION_TYPES.includes(type)) {
    throw new Error(`Unknown reaction: ${type}`);
  }

  let response;
  try {
    response = await fetch(
      `${API_BASE_URL}/api/memes/${encodeURIComponent(memeId)}/reactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      },
    );
  } catch {
    throw new Error("Couldn't reach the reactions service.");
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || `Reaction failed (HTTP ${response.status})`);
  }

  const data = await response.json();
  if (!data.success || !data.reactions) {
    throw new Error(data.message || "Invalid reaction response");
  }
  return data.reactions;
}
