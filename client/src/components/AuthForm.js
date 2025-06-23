import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Button from "./ui/Button";

const authFormItems = [
  { name: "Name", id: "name", type: "text" },
  { name: "Email", id: "email", type: "email" },
  { name: "Password", id: "password", type: "password" },
];

export const AuthForm = ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  // Client-side validation function
  const validateInputs = () => {
    setError(""); // Clear previous errors

    if (type === "signup" && !name.trim()) {
      setError("Name is required.");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false); // Stop loading if validation fails
      return;
    }

    try {
      let res;
      if (type === "login") {
        res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
          { email, password }
        );
      } else {
        res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
          { name, email, password }
        );
      }

      if (res.data.success) {
        setAuth({
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        toast.success(
          res.data.message ||
            `${type === "login" ? "Logged in" : "Signed up"} successfully!`
        );
      } else {
        setError(res.data.message || "An unexpected error occurred.");
        toast.error(res.data.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred.");
        toast.error(error.response.data.message || "An error occurred.");
      } else {
        // Network error or other unexpected issues
        setError("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") {
      setName(value);
    } else if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  // Helper function to get the current value for an input based on its ID
  const getInputValue = (id) => {
    if (id === "name") {
      return name;
    } else if (id === "email") {
      return email;
    } else if (id === "password") {
      return password;
    }
    return ""; // Default empty string if ID doesn't match
  };

  // Navigate when auth.token is set (meaning user is logged in)
  useEffect(() => {
    if (auth?.token) {
      navigate("/expenses");
    }
  }, [auth?.token, navigate]);

  // Determine which items to render based on the 'type' prop
  const filteredAuthFormItems =
    type === "login"
      ? authFormItems.filter((item) => item.id !== "name")
      : authFormItems;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 mt-6 sm:border rounded-md sm:shadow-md"
    >
      <h2 className="text-2xl text-center font-semibold mb-6">
        {type === "login" ? "Login" : "Sign Up"}
      </h2>

      {/* Display error message */}
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      {filteredAuthFormItems.map((item) => (
        <Input
          key={item.id}
          type={item.type}
          label={item.name}
          id={item.id}
          value={getInputValue(item.id)} // helper function to get the value
          onChange={handleInputChange}
          disabled={type == "login" && item.name == "Name"}
        />
      ))}

      <Button
        variant="primary"
        type="submit"
        disabled={loading}
        className="w-full"
        children={
          loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"
        }
      />

      <p className="mt-4 text-center text-gray-500 text-xs">
        {type === "login" ? (
          <Link to={"/sign-up"}>
            Don&apos;t have an account?{" "}
            <span className="text-blue-500 text-sm hover:underline">
              Sign-up
            </span>
          </Link>
        ) : (
          <Link to={"/login"}>
            Already have an account?{" "}
            <span className="text-blue-500 text-sm hover:underline">Login</span>
          </Link>
        )}
      </p>
    </form>
  );
};
