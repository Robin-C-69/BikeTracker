import { TFunction } from "i18next";
import { PieceType } from "@/database/models/PieceTypeModel";
import { Category } from "@/database/models/PieceCategoryModel";

export const capitalized = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const calculateAndFormatAge = (
  startDate: any,
  t: TFunction<"translation", undefined>,
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const installDate = new Date(startDate);
  installDate.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today.getTime() - installDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return t("age.days", { count: diffDays });
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return t("age.months", { count: months });
  } else {
    const years = Math.floor(diffDays / 365);
    return t("age.years", { count: years });
  }
};

export const formatDateToHumanString = (date: any) => {
  const dateOptions = {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  return new Date(date).toLocaleDateString("fr", dateOptions);
};

export const formatPieceTypeAndCategory = (
  categoryId: number,
  pieceCategories: Category[],
  pieceTypes: PieceType[],
  t: TFunction<"translation", undefined>,
): string => {
  const pieceCategory = pieceCategories.find((c) => c.id === categoryId);
  if (!pieceCategory) return "";

  const pieceType = pieceTypes.find((t) => t.id === pieceCategory.typeId);
  if (!pieceType) return "";

  return `${t(`types.${capitalized(pieceType.name)}`)} • ${t(`categories.${capitalized(pieceCategory.name)}`)}`;
};
