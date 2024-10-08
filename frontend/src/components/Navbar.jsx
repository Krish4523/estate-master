import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, User } from "lucide-react"; // Importing necessary icons from Lucide
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/estatemaster-logo-transparent.svg";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { DialogTitle } from "@radix-ui/react-dialog";

const navItems = [
  { item: "Home", href: "/" },
  { item: "Listing", href: "/listings" },
  { item: "Appointments", href: "/appointments" },
  { item: "Add", href: "/add-property" },
  // { item: "About", href: "/about" },
];

function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  console.log(user);

  return (
    <nav className="fixed top-0 w-full h-[60px] bg-white z-50 shadow-md py-2 px-2 md:px-6 lg:px-10 flex justify-between items-center">
      <div className="flex items-center space-x-4 md:space-x-0">
        <div className="md:hidden">
          <Sheet side="right" open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4 w-[250px]">
              <DialogTitle></DialogTitle>
              <div className="flex flex-col space-y-4">
                <NavLink
                  to="/"
                  className="text-black font-bold text-xl"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <img src={logo} alt="logo" className="h-full w-40" />
                </NavLink>
                {navItems.map(({ item, href }) => (
                  <NavLink
                    key={item}
                    to={href}
                    onClick={() => setIsSheetOpen(false)}
                    className={({ isActive }) =>
                      `text-lg hover:bg-secondary px-2 py-1 rounded-md transition-colors duration-200 ${
                        isActive
                          ? "text-primary"
                          : "text-gray-700 hover:text-gray-900"
                      }`
                    }
                  >
                    {item}
                  </NavLink>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <NavLink to="/" className="text-black font-bold text-xl">
          <img src={logo} alt="logo" className="h-full w-40" />
        </NavLink>
      </div>
      <div className="flex justify-end items-center gap-8">
        {/* Centered Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 justify-center">
          {navItems.map(({ item, href }) => (
            <NavLink
              key={item}
              to={href}
              className={({ isActive }) =>
                `text-lg hover:bg-secondary transition-colors duration-100 ${
                  isActive
                    ? "text-primary font-semibold border-b-2 border-primary px-3 py-2"
                    : "text-gray-400 hover:text-gray-700 px-3 py-2 rounded"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </div>

        {/* Profile Icon and Dropdown */}
        <div className="flex space-x-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="rounded-full">
                {user.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/${user.avatar}`}
                    alt="Profile"
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <User />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center space-x-2"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                as={Button}
                to="/login"
                className="flex items-center space-x-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 text-gray-700" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
