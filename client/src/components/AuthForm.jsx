import { useState } from "react";
import axios from "axios";

export const AuthForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [type, setType] = useState("login");

  const handleChangetype = (val) => {
    setType(val);
  };

  const handleSignUp = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`http://localhost:5000/api/auth/register`, {
        name,
        email,
        password,
        role,
      });
      console.log(res);
    } catch (error) {
      console.log("error in signup");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/login`, {
        email,
        password,
      });
      console.log(res)
    } catch (error) {
      console.log("error in login", error);
    }
  };

  return (
    <form
      onSubmit={type === "login" ? handleLogin : handleSignUp}
      className="max-w-md mx-auto p-6 mt-6 sm:border rounded-md sm:shadow-md"
    >
      <h2 className="text-2xl text-center font-semibold mb-6">
        {type === "login" ? "Login" : "Sign Up"}
      </h2>
      {type === "signup" && (
        <>
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

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Role:
            </label>
            <input
              type="role"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="border p-2 rounded-md w-full"
            />
          </div>
        </>
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
            <button className="" onClick={() => handleChangetype("signup")}>
              Don&apos;t have an account?
              <span>Sign-up</span>
            </button>
          </>
        ) : (
          <>
            <button className="" onClick={() => handleChangetype("login")}>
              Already have an account?
              <span>Login</span>
            </button>
          </>
        )}
      </p>
    </form>
  );
};
