import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const AuthForm = ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        {
          name,
          email,
          password,
        }
      );

      if (res && res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        localStorage.setItem("auth", JSON.stringify(res.data));
        setLoggedIn(true);
      }
    } catch (error) {
      console.log("error in signup");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      if (res && res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
      }
      setLoggedIn(true);
    } catch (error) {
      console.log("error in login", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/expenses");
    }
  }, [loggedIn, navigate]); // Navigate when 'loggedIn' state changes

  return (
    <form
      onSubmit={type === "login" ? handleLogin : handleSignUp}
      className="max-w-md mx-auto p-6 mt-6 sm:border rounded-md sm:shadow-md"
    >
      <h2 className="text-2xl text-center font-semibold mb-6">
        {type === "login" ? "Login" : "Sign Up"}
      </h2>
      {type === "signup" && (
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            type="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 rounded-md w-full"
          />
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded-md w-full"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded-md w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline mt-5"
      >
        {type === "login" ? "Login" : "Sign Up"}
      </button>

      <p className="mt-4 text-center text-gray-500 text-xs">
        {type === "login" ? (
          <>
            <Link to={"/sign-up"}>
              Don&apos;t have an account?
              <span className="text-blue-500 text-sm"> Sign-up</span>
            </Link>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              Already have an account?
              <span className="text-blue-500 text-sm"> Login</span>
            </Link>
          </>
        )}
      </p>
    </form>
  );
};
