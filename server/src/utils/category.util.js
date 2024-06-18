import { customAlphabet } from "nanoid";
import CATEGORY from "../constants/category.constant.js";

export const generateCatId = () => {
  const nanoid = customAlphabet(CATEGORY.ID_ALPHABET, CATEGORY.ID_LENGTH);
  return nanoid();
};
