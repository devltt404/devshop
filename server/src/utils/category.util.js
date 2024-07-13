import { customAlphabet } from "nanoid";
import {CATEGORY} from "../constants/index.js";

export const genCategoryId = () => {
  const nanoid = customAlphabet(CATEGORY.ID.ALPHABET, CATEGORY.ID.LENGTH);
  return nanoid();
};
