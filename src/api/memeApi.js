const API_BASE_URL = "https://memesense-backend.onrender.com";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/images/upload`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "Couldn't reach the server. File may be too large or backend is offline.",
    );
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || `Image upload failed (HTTP ${response.status})`);
  }

  const data = await response.json();

  if (!data.success || !data.imageId) {
    throw new Error(data.message || "Invalid upload response");
  }

  return data;
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    if (data && typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }
  } catch {
    // response wasn't JSON — fall through
  }
  return null;
}

export async function generateMemeCaptions(imageId, alias, context) {
  const trimmedContext = typeof context === "string" ? context.trim() : "";
  const body = {
    imageId,
    alias: alias || "Bro",
  };
  if (trimmedContext) {
    body.context = trimmedContext;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/meme/captions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Couldn't reach the caption service.");
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || `Caption generation failed (HTTP ${response.status})`);
  }

  const data = await response.json();

  if (!data.success || !Array.isArray(data.ideas)) {
    throw new Error(data.message || "Invalid captions response");
  }

  return data;
}
