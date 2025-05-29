import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";

function App() {
  const [auth] = useAuth();

  return (
    <div className="m-0">
      {auth.token && <Navbar />}
      <Routes>
        {/* {!auth.token && <Route path="/login" element={<LoginPage />} />} */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
