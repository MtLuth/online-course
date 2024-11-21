import BaseApi from "./BaseApi";
import Cookies from "js-cookie";
interface InstructorData {
  email: string;
  avt?: string;
  experience: number;
  expertise: string;
  education: string;
  certificate: string;
  bio: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

interface registerData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}
interface LoginData {
  email: string;
  password: string;
}
class Auth extends BaseApi {
  constructor() {
    super("/auth");
  }

  public async becomeInstructor(data: InstructorData) {
    const response = await authApi.post(`/auth/become-instructor`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data;
  }

  public async register(data: registerData) {
    const response = await this.post(`/auth/register`, data);
    return response?.data;
  }

  public async login(data: LoginData) {
    try {
      const response = await this.post("/auth/login", data);
      if (response.status === "success") {
        const { accessToken, expirationTime } = response.message.tokenPairs;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("uid", response.message.uid);
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        localStorage.setItem("expirationTime", expirationDate.toISOString());
        Cookies.set("accessToken", accessToken, { expires: 1 / 24 });
        Cookies.set("expirationTime", expirationDate.toISOString(), {
          expires: 1 / 24,
        });
      } else {
        console.error("Đăng nhập thất bại:", response.message);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  public logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("uid");
    localStorage.removeItem("expirationTime");
    Cookies.remove("accessToken");
    Cookies.remove("expirationTime");
    return true;
  }
}

export const authApi = new Auth();
