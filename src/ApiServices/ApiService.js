import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { base } from "../Api/Constants";

const SESSION_KEYS = [
  "token",
  "tokenExpires",
  "roleId",
  "userID",
  "userName",
  "clockInTime",
  "clockInEpoch",
];

const PUBLIC_PATHS = [
  "/user/auth/login",
  "/user/auth/register",
  "/user/auth/otp",
  "/user/auth/verify-otp",
  "/user/auth/forgot-password",
];

let navigationRef = null;
let sessionInvalid = false;
let logoutInProgress = null;

export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

export const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch (error) {
    return "UTC";
  }
};

export const toRoleId = (value) => {
  const id = Number(value);
  return Number.isFinite(id) ? id : value;
};

const stringifyHeaders = (headers = {}) => {
  const next = {};
  Object.entries(headers).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    next[key] = String(value);
  });
  return next;
};

export const toFormData = (fields = {}) => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) {
          return;
        }
        formData.append(key, typeof item === "object" ? item : String(item));
      });
      return;
    }
    if (typeof value === "object") {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
};

const getUrl = (value = "") => String(value || "");

export const isPublicEndpoint = (url = "") =>
  PUBLIC_PATHS.some((path) => String(url).includes(path));

const shouldHandleAuth = (url = "") => {
  const value = String(url);
  if (isPublicEndpoint(value)) {
    return false;
  }
  if (value.startsWith("http") && !value.includes("socialsanitation.com")) {
    return false;
  }
  return true;
};

const decodeBase64 = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  if (typeof global.atob === "function") {
    return global.atob(padded);
  }
  if (typeof atob === "function") {
    return atob(padded);
  }
  return "";
};

const getJwtExpiryMs = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }
  try {
    const payload = JSON.parse(decodeBase64(parts[1]));
    return payload?.exp ? payload.exp * 1000 : null;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token, expiresAt) => {
  const now = Date.now() + 5000;
  if (expiresAt) {
    const expiryMs = new Date(expiresAt).getTime();
    if (!Number.isNaN(expiryMs)) {
      return expiryMs <= now;
    }
  }
  const jwtExpiry = getJwtExpiryMs(token);
  if (jwtExpiry) {
    return jwtExpiry <= now;
  }
  return false;
};

export const persistSession = async ({
  token,
  expires,
  roleId,
  userId,
  userName,
}) => {
  sessionInvalid = false;
  const pairs = [];
  if (token) {
    pairs.push(["token", String(token)]);
  }
  if (expires) {
    pairs.push(["tokenExpires", String(expires)]);
  }
  if (roleId !== undefined && roleId !== null && roleId !== "") {
    pairs.push(["roleId", String(toRoleId(roleId))]);
  }
  if (userId !== undefined && userId !== null && userId !== "") {
    pairs.push(["userID", String(userId)]);
  }
  if (userName) {
    pairs.push(["userName", String(userName)]);
  }
  if (pairs.length) {
    await AsyncStorage.multiSet(pairs);
  }
};

export const clearSessionStorage = async () => {
  await AsyncStorage.multiRemove(SESSION_KEYS);
};

const resetToLogin = () => {
  const nav = navigationRef?.current || navigationRef;
  if (!nav) {
    return;
  }
  const canNavigate =
    typeof nav.isReady === "function" ? nav.isReady() : true;
  if (!canNavigate || typeof nav.dispatch !== "function") {
    return;
  }
  nav.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  );
};

export const handleUnauthorized = async () => {
  sessionInvalid = true;
  if (logoutInProgress) {
    return logoutInProgress;
  }

  logoutInProgress = (async () => {
    try {
      await clearSessionStorage();
      resetToLogin();
    } finally {
      logoutInProgress = null;
    }
  })();

  return logoutInProgress;
};

export const getAuthHeaders = async ({ redirectIfInvalid = true } = {}) => {
  const token = await AsyncStorage.getItem("token");
  const roleId = await AsyncStorage.getItem("roleId");
  const tokenExpires = await AsyncStorage.getItem("tokenExpires");
  const expired =
    !token || isTokenExpired(token, tokenExpires) || sessionInvalid;

  if (expired) {
    if (redirectIfInvalid && token) {
      await handleUnauthorized();
    }
    return { token: null, roleId: null, headers: {}, expired: true };
  }

  return {
    token,
    roleId,
    headers: stringifyHeaders({
      timezone: getTimezone(),
      "x-access-token": token,
      ...(roleId ? { role_id: String(toRoleId(roleId)) } : {}),
    }),
    expired: false,
  };
};

export const isUnauthorizedError = (error) => {
  if (error?.isSessionExpired) {
    return true;
  }
  const status = error?.response?.status;
  const apiStatus = error?.response?.data?.status;
  const message = String(
    error?.response?.data?.message || error?.message || ""
  ).toLowerCase();

  if (
    status === 401 ||
    status === 403 ||
    apiStatus === 401 ||
    apiStatus === 403
  ) {
    return true;
  }

  return [
    "please authenticate",
    "jwt expired",
    "jwt malformed",
    "invalid signature",
    "invalid token",
    "token expired",
    "unauthorized",
    "not authenticated",
  ].some((text) => message.includes(text));
};

const createSessionError = () => {
  const error = new Error("Session expired. Please login again.");
  error.isSessionExpired = true;
  return error;
};

const createApiError = (message, status, data, url) => {
  const error = new Error(message || `Request failed (${status || "network"})`);
  error.response = { status, data };
  error.config = { url };
  return error;
};

export const apiRequest = async ({
  url,
  method = "GET",
  data,
  auth,
  headers: extraHeaders = {},
  timeout = 20000,
} = {}) => {
  if (!url) {
    throw createApiError("Missing API url", 0, {}, url);
  }

  const methodUpper = String(method || "GET").toUpperCase();
  const useAuth = auth !== undefined ? auth : shouldHandleAuth(url);
  const headers = stringifyHeaders({
    Accept: "application/json",
    timezone: getTimezone(),
    ...extraHeaders,
  });

  if (useAuth) {
    if (sessionInvalid) {
      throw createSessionError();
    }
    const session = await getAuthHeaders();
    if (session.expired || !session.token) {
      await handleUnauthorized();
      throw createSessionError();
    }
    Object.assign(headers, session.headers, stringifyHeaders(extraHeaders));
  }

  delete headers["Content-Type"];
  delete headers["content-type"];

  let body;
  const canHaveBody = !["GET", "HEAD"].includes(methodUpper);
  if (canHaveBody && data !== undefined && data !== null && data !== "") {
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      body = data;
    } else if (typeof data === "object") {
      body = toFormData(data);
    } else {
      body = data;
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: methodUpper,
      headers,
      body,
      signal: controller.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = createApiError(
        json?.message || `Request failed (${res.status})`,
        res.status,
        json,
        url
      );
      if (useAuth && isUnauthorizedError(error)) {
        await handleUnauthorized();
      }
      throw error;
    }
    return { status: res.status, data: json };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw createApiError("Request timed out", 0, {}, url);
    }
    if (useAuth && isUnauthorizedError(error)) {
      await handleUnauthorized();
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

export const apiGet = (url, options = {}) =>
  apiRequest({ url, method: "GET", ...options });

export const apiPost = (url, data, options = {}) =>
  apiRequest({ url, method: "POST", data, ...options });

export const apiPut = (url, data, options = {}) =>
  apiRequest({ url, method: "PUT", data, ...options });

export const apiDelete = (url, options = {}) =>
  apiRequest({ url, method: "DELETE", ...options });

export const postFormData = async (
  url,
  data = {},
  extraHeaders = {},
  options = {}
) =>
  apiPost(url, data, {
    headers: extraHeaders,
    timeout: options.timeout || 20000,
    auth: options.auth,
    method: options.method || "POST",
  });

const apiServices = {
  get: async (url, headers = {}) => {
    const response = await apiGet(url, { headers });
    return response.data;
  },
  post: async (url, data, headers = {}) => {
    const response = await apiPost(url, data, { headers });
    return response.data;
  },
  put: async (url, data, headers = {}) => {
    const response = await apiPut(url, data, { headers });
    return response.data;
  },
  delete: async (url, data = {}, headers = {}) => {
    const response = await apiDelete(url, { data, headers });
    return response.data;
  },
};

export default apiServices;
