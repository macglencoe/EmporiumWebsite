import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const useSlugPreview = ({ generateSlug, isSlugUnique }) => {
  const { watch } = useFormContext();
  const values = watch();

  return useMemo(() => {
    const slug = generateSlug ? generateSlug(values) : "";
    const unique = isSlugUnique ? isSlugUnique(values) : true;
    return { slug, unique };
  }, [values, generateSlug, isSlugUnique]);
};
