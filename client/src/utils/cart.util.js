export const invalidateCartTagsAfterAuth = async function (
  arg,
  { dispatch, queryFulfilled },
) {
  try {
    await queryFulfilled;
    dispatch(api.util.invalidateTags(["SIMPLE_CART", "CART"]));
  } catch (error) {}
};
