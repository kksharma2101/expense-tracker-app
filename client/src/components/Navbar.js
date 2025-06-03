import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            {auth?.user && (
              <Link
                to="/expenses"
                className="text-gray-700 hover:text-blue-600"
              >
                Expenses
              </Link>
            )}
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Services
            </Link>

            {!auth?.user ? (
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 hover:underline"
              >
                Login
              </Link>
            ) : (
              <>
                <span>{auth?.user?.name.slice(0, 5)}</span>
                <button
                  className="py-1 px-2 rounded-md bg-red-500 hover:bg-red-600"
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
          <Link to="/" className="block text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/" className="block text-gray-700 hover:text-blue-600">
            About
          </Link>
          <Link to="/" className="block text-gray-700 hover:text-blue-600">
            Services
          </Link>
          <Link to="/" className="block text-gray-700 hover:text-blue-600">
            Contact
          </Link>
          {!auth?.user ? (
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 hover:underline"
            >
              Login
            </Link>
          ) : (
            <div className="flex flex-col">
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
