const dedupe = (arr) => Array.from(new Set(arr.filter(Boolean)));

export const buildCigarSuggestions = (items = []) => {
  return {
    "Cigar Brand": dedupe(items.map((i) => i["Cigar Brand"])),
    Wrapper: dedupe(items.map((i) => i["Wrapper"])),
    Strength_Profile: dedupe(items.map((i) => i["Strength_Profile"])),
    Size: dedupe(
      items.flatMap((i) => (i.Sizes || []).map((s) => s.Size))
    ),
  };
};

export const buildTobaccoSuggestions = (items = []) => {
  return {
    "Tobacco Brand": dedupe(items.map((i) => i["Tobacco Brand"])),
    Family: dedupe(items.map((i) => i["Family"])),
  }
}