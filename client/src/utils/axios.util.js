import axios from "axios";

const axiosWithAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosWithAuth.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    try {
      //Try to refresh token if 401
      if (error.response.status === 401) {
        await axiosWithAuth.post("/auth/refresh-token");
        return axiosWithAuth.request(error.config);
      } else {
        return Promise.reject(error);
      }
    } catch (error) {
      //TODO: logout
      return Promise.reject(error);
    }
  },
);

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosWithAuth({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: err.response?.data || {
          status: err.response?.status,
          message: err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
