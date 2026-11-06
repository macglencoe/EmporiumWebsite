import { useCallback, useEffect, useMemo, useState } from "react";

export const useDraftItem = ({ slug, defaults = {}, initialItem = {}, allItems = [], productId = null, draftItemId = null, type, slugFields = ["Cigar Brand", "Cigar Name"], slugFormatter }) => {
  const [draft, setDraft] = useState(initialItem);
  useEffect(() => setDraft(initialItem), [initialItem]);
  const generateSlug = useCallback((item) => {
    if (!item) return "";
    if (typeof slugFormatter === "function") return slugFormatter(item);
    return slugFields.map((field) => item[field] || "").join(" ").toLowerCase().replace(/[^a-z0-9\s]/gi, "").replace(/\s+/g, "-");
  }, [slugFields, slugFormatter]);
  const isSlugUnique = useCallback((item) => {
    const targetSlug = generateSlug(item);
    return !allItems.some((entry) => entry.slug !== slug && entry.slug === targetSlug);
  }, [allItems, generateSlug, slug]);
  const saveDraft = useCallback(async (item) => {
    if (!isSlugUnique(item)) return { error: "slug-conflict" };
    const legacy = { ...item, slug: generateSlug(item) || item.slug || slug };
    const response = await fetch('/api/catalog/draft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, legacy, productId, draftItemId }) });
    const result = await response.json();
    if (response.status === 409) return { error: "slug-conflict" };
    if (!response.ok) return { error: "save-failed", message: result.message, details: result.errors };
    setDraft(legacy); return { currentSlug: slug, newSlug: legacy.slug, item: result.item };
  }, [draftItemId, generateSlug, isSlugUnique, productId, type, slug]);
  return { draft, setDraft, allDrafts: allItems, saveDraft, generateSlug, isSlugUnique, revertDraft: () => setDraft({ ...defaults, ...initialItem }), originData: useMemo(() => initialItem, [initialItem]) };
};
