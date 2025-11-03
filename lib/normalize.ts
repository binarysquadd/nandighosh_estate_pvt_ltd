export function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String).map(s => s.trim());
  if (typeof value === "string") {
    // split on commas or pipes, trim, drop empties
    return value
      .split(/[,|]/g)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}