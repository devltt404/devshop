import CategoryService from "../services/category.service.js";

export async function getDescendantIds(categoryId) {
  let descendantIds = await CategoryService.findCategories({
    filter: { path: { $regex: `,${categoryId},` } },
    select: "_id",
    lean: true,
  });

  descendantIds = descendantIds.map((category) => category._id);

  return descendantIds;
}

export async function getTreeOfSingleCategory(category) {
  let categoryIds = category.path.split(",").slice(1, -1);

  const findQueries = await Promise.all(
    categoryIds.map(async (categoryId) => {
      return CategoryService.findOneCategory({
        filter: { _id: categoryId },
        select: "name slug",
        lean: true,
      });
    })
  );

  findQueries.push(category);

  return findQueries;
}
