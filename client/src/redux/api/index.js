import baseQueryWithReauth from "@/utils/axios.util.js";
import { createApi } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: baseQueryWithReauth(),
  endpoints: (builder) => ({}),
});
