import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navbarItems = [
  { name: "Home", id: "home", naviLink: "/" },
  { name: "Add Expense", id: "add-expense", navLink: "/add-expense" },
  { name: "Expenses", id: "expenses", navLink: "/expenses" },
  { name: "About", id: "about", navLink: "/" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md w-full z-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-xl font-bold text-blue-600">
            <Link to="/">Transerg LLP.</Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            {navbarItems.map((item) => (
              <Link
                to={item.navLink}
                key={item.id}
                className="text-gray-700 hover:text-blue-600"
              >
                {auth?.user ? item.name : ""}
              </Link>
            ))}

            {!auth?.user ? (
              <Link
                to="/login"
                className="text-gray-700 font-bold hover:text-blue-600 hover:underline"
              >
                Login
              </Link>
            ) : (
              <>
                <button
                  className="py-1 px-2 rounded-md bg-blue-500 hover:bg-blue-600 font-bold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-7 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navbarItems.map((item) => (
            <Link
              to={item.navLink}
              key={item.id}
              className="block text-gray-700 hover:text-blue-600"
            >
              {auth?.user ? item.name : ""}
            </Link>
          ))}

          {!auth?.user ? (
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 hover:underline"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center justify-between">
              <span>User: {auth?.user?.name}</span>
              <button
                className="text-lg font-bold hover:text-blue-600"
                onClick={() => handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
