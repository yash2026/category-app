// components/Login.js
import { useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/categories");
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex items-center justify-center flex-col border-2 rounded-2xl max-h-[614px] h-[614px] my-4 max-w-xl w-full">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">Login</h2>
        <span className="text-2xl font-medium">Welcome back to ECOMMERCE</span>
        <span className="">The next gen business marketplace</span>
      </div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col max-w-[456px] w-full mb-5">
          <label htmlFor="email" className="w-full mb-1">
            Email
          </label>
          <input
            type="email"
            ref={emailRef}
            required
            placeholder="Email"
            className="text-gray-500 border-2 border-slate-300 rounded p-2  w-full "
          />
        </div>
        <div className="flex flex-col max-w-[456px] w-full">
          <label htmlFor="password" className="w-full mb-1">
            Password
          </label>
          <div className="relative w-[456px] ">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password type
              ref={passwordRef}
              required
              placeholder="Password"
              className="text-gray-500 border-2 border-slate-300 rounded p-2 w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2.5 text-sm text-gray-900 underline mr-2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="max-w-[456px] w-full mt-8 p-4 bg-gray-800 rounded-md text-white mb-4
          "
        >
          LOGIN
        </button>
        <div className="h-px bg-gray-200 max-w-[456px] w-full" />
        <div className="max-w-[456px] w-full text-center mt-4 text-sm">
          Don't have an Account?{" "}
          <button
            className="font-medium text-base"
            onClick={() => navigate("/signup")}
          >
            SIGN UP
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
