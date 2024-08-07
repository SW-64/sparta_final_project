import axios from "axios";
import { UpdateUserDto } from "../types/user";
// 환경 변수에서 API_BASE_URL을 가져옵니다.
const API_BASE_URL = "http://localhost:3001/api/v1"; // 추후 env파일로 수정
// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초
  withCredentials: true, // CORS 설정에 맞춰 credentials를 true로 설정
});
// 요청 인터셉터를 추가하여 JWT 토큰을 헤더에 포함시킵니다.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
// 응답 인터셉터 - 토큰 만료 시 리프레시 토큰으로 갱신
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Unable to refresh token", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/sign-in", { email, password }),
  googleLogin: (token: string) => api.post("/auth/google", { token }),
  logout: () => api.post("/auth/logout"),
  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),
};
// 다른 API 함수들 (userApi, postApi, fileApi)은 이전과 동일하게 유지
export const userApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  googleLogin: (token: string) => api.post("/auth/google", { token }),
  logout: () => api.post("/auth/logout"),
  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),
  update: (userId: number, userData: UpdateUserDto) => api.post("/auth/logout"),
};