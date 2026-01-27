import { useCallback, useEffect, useMemo, useState } from "react";
import setLocalData from "../utils/setLocalData";

const parseJson = (raw, fallback) => {
  try {
    const parsed = JSON.parse(raw ?? "");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const pruneEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.map(pruneEmpty);
  }
  if (value && typeof value === "object") {
    const result = {};
    Object.entries(value).forEach(([k, v]) => {
      const cleaned = pruneEmpty(v);
      if (cleaned !== undefined) {
        result[k] = cleaned;
      }
    });
    return result;
  }
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  return value;
};

const makeClientId = () => {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useDraftItem = ({
  slug,
  defaults = {},
  initialItem = {},
  allItems = [],
  storageKey = "tempData_cigars",
  originKey = "originData_cigars",
  slugFields = ["Cigar Brand", "Cigar Name"],
  slugFormatter,
  cleanItem, // optional post-prune cleanup; defaults to filtering non-objects in Sizes
  onInitLocalData = setLocalData, // allows consumers to disable/replace the side-effect
}) => {
  const [draft, setDraft] = useState(initialItem);
  const [origin] = useState(initialItem);
  const [allDrafts, setAllDrafts] = useState(allItems);

  // Keep local state in sync when props change.
  useEffect(() => {
    setDraft(initialItem);
    setAllDrafts(allItems);
  }, [initialItem, allItems]);

  // Load any existing drafts from storage and initialize the current draft.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (onInitLocalData) {
      onInitLocalData(allItems);
    }

    const tempData = parseJson(localStorage.getItem(storageKey), []);
    const storedDraft = tempData.find((item) => item.slug === slug);
    const nextDraft = storedDraft || { ...defaults, ...initialItem };
    setDraft(nextDraft);

    const storedAll = parseJson(localStorage.getItem(storageKey), []);
    setAllDrafts(storedAll.length ? storedAll : allItems);
  }, [slug, defaults, initialItem, allItems, onInitLocalData, storageKey]);

  const generateSlug = useCallback((item) => {
    if (!item) return "";
    if (typeof slugFormatter === "function") {
      return slugFormatter(item);
    }
    const parts = slugFields.map((field) => item[field] || "");
    return parts
      .join(" ")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "-");
  }, [slugFields, slugFormatter]);

  const isSlugUnique = useCallback(
    (item) => {
      if (!item) return true;
      const currentSlug = item.slug || slug;
      const targetSlug = generateSlug(item);
      return !allDrafts.some((cigar) => {
        const isSameRecord =
          cigar.slug === currentSlug || cigar["new-slug"] === currentSlug;
        if (isSameRecord) return false;
        return (
          cigar.slug === targetSlug ||
          cigar["new-slug"] === targetSlug
        );
      });
    },
    [allDrafts, generateSlug, slug]
  );

  const saveDraft = useCallback(
    (item) => {
      if (typeof window === "undefined") {
        return { error: "window-unavailable" };
      }

      if (!isSlugUnique(item)) {
        return { error: "slug-conflict" };
      }

      const currentSlug = item.slug || slug;
      const newSlug = generateSlug(item);
      const targetSlug = currentSlug || newSlug;

      let tempData = parseJson(localStorage.getItem(storageKey), []);
      if (!Array.isArray(tempData)) {
        tempData = allItems || [];
      }

      const existingIndex = tempData.findIndex(
        (entry) => entry.slug === currentSlug || entry.slug === targetSlug
      );
      const existing = existingIndex !== -1 ? tempData[existingIndex] : null;
      const clientId =
        item._clientId || existing?._clientId || makeClientId();

      const updated = pruneEmpty({
        ...item,
        _clientId: clientId,
        slug: targetSlug,
        "new-slug": newSlug,
      });

      if (existingIndex !== -1) {
        tempData[existingIndex] = updated;
      } else {
        tempData.push(updated);
      }

      const targetIndex = existingIndex === -1 ? tempData.length - 1 : existingIndex;
      const maybeClean =
        cleanItem ||
        ((value) => {
          if (value?.Sizes) {
            return {
              ...value,
              Sizes: value.Sizes.filter((size) => typeof size === "object"),
            };
          }
          return value;
        });
      tempData[targetIndex] = maybeClean(tempData[targetIndex]);

      localStorage.setItem(storageKey, JSON.stringify(tempData));
      setAllDrafts(tempData);

      return { currentSlug, newSlug };
    },
    [allItems, cleanItem, generateSlug, isSlugUnique, slug, storageKey]
  );

  const revertDraft = useCallback(() => {
    setDraft({ ...defaults, ...origin });
  }, [defaults, origin]);

  const originData = useMemo(() => {
    if (typeof window === "undefined") return origin;
    const storedOrigin = parseJson(localStorage.getItem(originKey), []);
    const match = storedOrigin.find((item) => item.slug === slug);
    return match || origin;
  }, [origin, slug, originKey]);

  return {
    draft,
    setDraft,
    allDrafts,
    saveDraft,
    revertDraft,
    generateSlug,
    isSlugUnique,
    originData,
  };
};
