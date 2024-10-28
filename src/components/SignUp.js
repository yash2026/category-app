// components/SignUp.js
import { useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Generate random verification code
  const generateVerificationCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString(); // 8-digit code
  };

  // Send email using EmailJS
  const sendVerificationEmail = (email, verificationCode) => {
    const templateParams = {
      verify_email: verificationCode,
      user_email: email,
    };

    emailjs
      .send(
        "service_pd2ropc", // Your EmailJS service ID
        "template_ps5ul8n", // Your EmailJS template ID
        templateParams,
        "RpkZhum9FiSkmzaxF" // Your EmailJS public key
      )
      .then((response) => {
        console.log("Email successfully sent!", response.status, response.text);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      // Sign up user
      await signup(email, password);

      // Generate verification code and send it via email
      const verificationCode = generateVerificationCode();
      sendVerificationEmail(email, verificationCode);

      navigate("/verify", { state: { email, verificationCode } }); // Pass email to Verify page
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex items-center justify-center flex-col border-2 rounded-2xl max-h-[691px] h-[691px] my-4 max-w-xl w-full">
      <div className="flex  items-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">Create your account</h2>
      </div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col max-w-[456px] w-full mb-5">
          <label htmlFor="name" className="w-full mb-1">
            Name
          </label>
          <input
            type="text"
            ref={nameRef}
            required
            placeholder="Name"
            className="text-gray-500 border-2 border-slate-300 rounded p-2  w-full"
          />
        </div>
        <div className="flex flex-col max-w-[456px] w-full mb-5">
          <label htmlFor="email" className="w-full mb-1">
            Email
          </label>
          <input
            type="email"
            ref={emailRef}
            required
            placeholder="Email"
            className="text-gray-500 border-2 border-slate-300 rounded p-2  w-full"
          />
        </div>
        <div className="flex flex-col max-w-[456px] w-full">
          <label htmlFor="password" className="w-full mb-1">
            Password
          </label>
          <div className="relative w-[456px] ">
            <input
              type={showPassword ? "text" : "password"}
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
          CREATE ACCOUNT
        </button>
        <div className="h-px bg-gray-200 max-w-[456px] w-full" />
        <div className="max-w-[456px] w-full text-center mt-4 text-sm">
          Have an Account?{" "}
          <button
            className="font-medium text-base"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
