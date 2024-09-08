// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitForm } from "@/utils/submitForm.js";
import axios from "axios";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("authToken") || null
  );
  const [user, setUser] = useState(() => localStorage.getItem("user") || null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!authToken) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/user/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );

        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setAuthToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem("authToken");
        console.error("User not authenticated:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [authToken]);

  const login = async (data) => {
    const isEmail = data.emailOrPhone.includes("@");
    const formData = {
      email: isEmail ? data.emailOrPhone : "",
      phone: isEmail ? "" : data.emailOrPhone,
      password: data.password,
    };

    await submitForm({
      data: formData,
      endpoint: `${import.meta.env.VITE_API_BASE_URL}/api/auth/login/`,
      setLoading,
      setErrorMessage,
      onSuccess: (response) => {
        console.log(response);
        localStorage.setItem("authToken", response.token);
        setAuthToken(response.token);
        setIsAuthenticated(true);
        navigate("/");
        toast.success(response.message);
      },
      onError: (error) => {
        if (error.response?.data?.message?.includes("Account is inactive")) {
          setErrorMessage(
            "Your account is inactive. Please check your email for an OTP."
          );
          navigate("/verify-otp", {
            state: { email: formData.email || formData.phone },
          });
        } else {
          setErrorMessage(error.response?.data?.error);
        }
      },
    });
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout/`,
        {},
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      localStorage.removeItem("authToken");
      setAuthToken(null);
      setIsAuthenticated(false);
      navigate("/login");
      toast.success(response.data.message);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const signup = async (data) => {
    await submitForm({
      data,
      endpoint: `${import.meta.env.VITE_API_BASE_URL}/api/auth/register/`,
      setLoading,
      setErrorMessage,
      onSuccess: (response) => {
        setAuthToken(null);
        setIsAuthenticated(false);
        navigate("/verify", { state: { email: data?.email } });
        toast.success(response.message);
      },
      onError: (error) => {
        console.error("Signup failed:", error);
        setErrorMessage("Signup error, please try again");
      },
    });
  };

  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp/`,
        { email, otp }
      );
      localStorage.setItem("authToken", response.data.token);
      setAuthToken(response.data.token);
      setIsAuthenticated(true);
      navigate("/");
      toast.success(response.data.message);
    } catch (error) {
      setErrorMessage("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/resend-otp/`,
        { email }
      );
      setErrorMessage(null);
      toast.success(response.data.message);
    } catch (error) {
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="animate-spin text-primary me-2" /> Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authToken,
        setAuthToken,
        loading,
        errorMessage,
        isAuthenticated,
        login,
        logout,
        signup,
        verifyOtp,
        resendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    console.error("AuthContext must be used within AuthProvider");
  }
  return value;
};
