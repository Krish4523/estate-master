import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar.jsx";

function Layout() {
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
