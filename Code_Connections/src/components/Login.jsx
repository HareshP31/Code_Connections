import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../services/authService";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await loginUser(identifier, password);
      login(user);
      navigate("/home");
    } catch (err) {
      if (err.message.includes("auth/user-not-found")) {
        setError("No account found with that email or username.");
      } else if (err.message.includes("auth/wrong-password")) {
        setError("Incorrect password. Please try again.");
      } else if (err.message.includes("auth/invalid-email")) {
        setError("Invalid email format.");
      } else if (err.message.includes("auth/too-many-requests")) {
        setError(
          "Too many failed attempts. Please wait a few minutes or reset your password."
        );
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await loginWithGoogle();
      login(user);
      navigate("/home");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or Email"
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Log In"}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="google-login-button"
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <img
          src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
          alt="Google Icon"
          style={{ width: "20px", height: "20px" }}
        />
        {loading ? "Loading..." : "Log in with Google"}
      </button>

      {loading && <div className="loading-spinner"></div>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: "10px" }}>
        <Link to="/forgot-password" style={{ color: "#744bfa" }}>
          Forgot Password?
        </Link>
      </p>
    </div>
  );
}

export default Login;
