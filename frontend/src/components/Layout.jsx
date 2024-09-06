import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook
import axios from "axios";
import Navbar from "@/components/Navbar.jsx";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator.jsx";
import { Input } from "@/components/ui/input.jsx";

function Layout() {
  const { authToken, setAuthToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) {
        return; // If no authToken, don't make the request
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/user/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          }
        );
        console.log(response.data);
        // setUser(response.data);
      } catch (error) {
        console.log("Error fetching user data:", error);
        setAuthToken(null);
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    };
    fetchData();
  }, [authToken, setAuthToken, navigate]);

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="mt-20 mx-2 sm:mx-4 md:mx-6">
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}

export default Layout;
