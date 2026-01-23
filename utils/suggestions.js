export const buildCigarSuggestions = (items = []) => {
  const dedupe = (arr) => Array.from(new Set(arr.filter(Boolean)));

  return {
    "Cigar Brand": dedupe(items.map((i) => i["Cigar Brand"])),
    Wrapper: dedupe(items.map((i) => i["Wrapper"])),
    Strength_Profile: dedupe(items.map((i) => i["Strength_Profile"])),
    Size: dedupe(
      items.flatMap((i) => (i.Sizes || []).map((s) => s.Size))
    ),
  };
};
