import { jwtDecode } from "jwt-decode";

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem("accessToken");
          return null;
        }
        return token;
      } catch (error) {
        localStorage.removeItem("accessToken");
        return null;
      }
    }
  }
  return null;
};
