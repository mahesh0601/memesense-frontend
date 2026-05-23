import { API_URL } from "../constants/api";

export async function getName() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const value = await response.text();
  return value.trim();
}

