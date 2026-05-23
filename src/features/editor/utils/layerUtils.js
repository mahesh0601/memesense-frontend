export function createLayerId(prefix = "layer") {
  return `${prefix}_${crypto.randomUUID()}`;
}
