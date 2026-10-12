import { TFunction } from "i18next";
import { PieceWithDetails } from "@/database/models/PieceModel";

export const capitalized = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const formatDateToHumanString = (date: any) => {
  if (!date) return null;

  const dateOptions = {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  return new Date(date).toLocaleDateString("fr", dateOptions);
};

export const formatPieceTypeAndCategory = (
  category: PieceWithDetails["category"] | undefined,
  t: TFunction<"translation", undefined>,
): string => {
  if (!category?.type) return "";
  return `${t(`types.${capitalized(category.type.name)}`)} • ${t(`categories.${capitalized(category.name)}`)}`;
};
