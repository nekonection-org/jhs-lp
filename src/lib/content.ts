export function getMatchingItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
): T {
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    throw new Error(`Localized content item is missing: ${id}`);
  }

  return item;
}
