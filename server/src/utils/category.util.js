import { customAlphabet } from "nanoid";
import CATEGORY from "../constants/category.constant.js";

export const genCategoryId = () => {
  const nanoid = customAlphabet(CATEGORY.ID.ALPHABET, CATEGORY.ID.LENGTH);
  return nanoid();
};
