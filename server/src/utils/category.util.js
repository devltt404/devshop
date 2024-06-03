/**
 * Builds a JSON tree structure from an array of all categories organized in materialized path tree structure of Mongo.
 *
 * @param {Array} categories - The array of categories.
 * @returns {Array} - The JSON tree structure representing the categories.
 */
export const getTreeOfAllCategories = (categories) => {
  const categoryMap = {};

  // Create a map of categories with selected fields.
  categories.forEach((category) => {
    categoryMap[category._id] = {
      _id: category._id,
      name: category.name,
      slug: category.slug,
      children: [],
    };
  });

  const tree = [];

  categories.forEach((category) => {
    if (category.path) {
      // Get the parent id of the current category.
      const parentIds = category.path.split(",").filter((id) => id);

      // Get the last parent id.
      const parentId = parentIds[parentIds.length - 1];

      // Check if the parent id exists in the category map.
      if (parentId && categoryMap[parentId]) {
        categoryMap[parentId].children.push(categoryMap[category._id]);
      } else {
        tree.push(categoryMap[category._id]);
      }
    } else {
      tree.push(categoryMap[category._id]);
    }
  });

  return tree;
};
