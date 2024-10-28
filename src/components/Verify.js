import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Verify = () => {
  const [code, setCode] = useState(new Array(8).fill(""));
  const { state } = useLocation();
  const navigate = useNavigate();

  // Check if state exists before destructuring
  const email = state?.email;
  const verificationCode = state?.verificationCode;

  const { verifyUser } = useAuth();

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      let newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      // Automatically move to the next input if a digit is entered
      if (value && index < 7) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredCode = code.join("");

    // Compare the entered code with the verification code
    if (enteredCode === verificationCode) {
      verifyUser();
      // Redirect to the categories page after successful verification
      navigate("/categories");
    } else {
      alert("Incorrect verification code. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center flex-col border-2 rounded-2xl max-h-[453px] h-[453px] my-4 max-w-xl w-full">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">Verify your email</h2>
        <span className="">
          Enter the 8 digit code you have received on {email}
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col max-w-[456px] w-full mb-5">
          <label htmlFor="code" className="w-full mb-1">
            Code
          </label>
          <div className="flex flex-row gap-2.5 items-center justify-center w-[456px]">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                className="text-gray-500 border-2 border-slate-300 rounded p-2 text-center w-12 h-12 "
                maxLength={1}
                inputMode="numeric"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={false}
          className="max-w-[456px] w-full mt-8 p-4 bg-gray-800 rounded-md text-white mb-4
          "
        >
          VERIFY
        </button>
      </form>
    </div>
  );
};

export default Verify;
