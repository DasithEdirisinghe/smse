import axios from "axios";

/**
 * Setup Axios
 */
const BASE_URL_REMOTE = "";
const BASE_URL_LOCAL = "http://localhost:3001";

axios.defaults.baseURL = BASE_URL_LOCAL;

/**
 * Convert Axios Response into
 *      status: http status code
 *      message: message from backend api
 * @param res
 */
function readStatus(res) {
  if (!res || !res.status) {
    return {
      status: 408,
      message: "Check your internet connection",
    };
  } else if (!res.data.message) {
    return {
      status: res.status,
      message: "Something went wrong",
    };
  }
  return {
    status: res.status,
    message: res.data.message,
  };
}

/**
 * Resolve Axios Response
 * @param axiosRes
 * @param options
 */
async function ajaxResolver(axiosRes, options = null) {
  try {
    const res = await axiosRes;
    if (options && options.fullBody)
      return { ...readStatus(res), data: res.data };
    else return { ...readStatus(res), data: res.data.data };
  } catch (e) {
    console.log("Axios error", e);
    if (e.response) {
      return { ...readStatus(e.response), data: null };
    } else if (e.request) {
      return { ...readStatus(e.request), data: null };
    } else {
      return { ...readStatus(e), data: null };
    }
  }
}

const formDataConfig = {
  headers: {
    "content-type": "multipart/form-data",
  },
};

export default {
  query: {
    async search(queryData) {
      return ajaxResolver(axios.post("/api/search/result", queryData));
    },
  },
  meta: {
    async data() {
      return ajaxResolver(axios.get("/api/song/meta"));
    },
  },
};
