import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./ForgotPasswordPage.css";
import { resetPassword, verifyUserForForgotPassword } from "../services/authService";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
  };

  const validateFields = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.username) newErrors.username = "Username is required.";
      if (!formData.email) {
        newErrors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format.";
      }
      if (!formData.role) newErrors.role = "Role is required.";
    } else if (step === 2) {
      if (!formData.otp) newErrors.otp = "OTP is required.";
    } else if (step === 3) {
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required.";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters.";
      } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
        newErrors.newPassword = "Password must contain at least one lowercase letter";
      } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
        newErrors.newPassword = "Password must contain at least one uppercase letter";
      } else if (!/(?=.*\d)/.test(formData.newPassword)) {
        newErrors.newPassword = "Password must contain at least one number";
      } else if (!/(?=.*[@$!%*?&])/.test(formData.newPassword)) {
        newErrors.newPassword = "Password must contain at least one symbol (@$!%*?&)";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {

      if (step === 1) {
        try {
          setIsLoading(true);
          const data = await verifyUserForForgotPassword(
            formData.username,
            formData.email,
            formData.role
          );

          if (data && data.otp) {
            Swal.fire("OTP Sent", "Check your email for the OTP.", "success");
            setGeneratedOTP(data.otp);
            setStep(2);
            console.log("Generated OTP : " + generatedOTP + " == data.otp " + data.otp); //check
          } else {
            Swal.fire("Error", data.message || "User not found.", "error");
            navigate("/register");
          }
        }
        catch (error) {
          Swal.fire("Error", error.message || "An error occurred.", "error");
        } finally {
          setIsLoading(false); // Reset button state after response
        }
      }
      else if (step === 2) {
        console.log(generatedOTP + " = " + formData.otp)
        if (formData.otp == generatedOTP) {
          Swal.fire("Success", "OTP verified!", "success");
          setStep(3);
        } else {
          Swal.fire("Error", "Invalid OTP. Please try again.", "error");
          setErrors({ otp: "Invalid OTP." });
        }
      }
      else if (step === 3) {
        const data = await resetPassword(formData.username, formData.newPassword);

        if (data) {
          Swal.fire("Password Reset", "Your password has been updated.", "success");
          navigate("/login");
        } else {
          Swal.fire("Error", data.message || "Password reset failed.", "error");
        }
      }
    } catch (error) {
      Swal.fire("Error", error.message || "An error occurred.", "error");
      if (error.message.includes("register")) {
        navigate("/register"); // Redirect to register
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  aria-label="Enter your username"
                />
                {errors.username && <p className="error">{errors.username}</p>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-label="Enter your email"
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                </select>
                {errors.role && <p className="error">{errors.role}</p>}
              </div>
            </>
          )}
          {step === 2 && (
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                aria-label="Enter received otp"
              />
              {errors.otp && <p className="error">{errors.otp}</p>}
            </div>
          )}
          {step === 3 && (
            <>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  aria-label="Enter your new password"
                />
                {errors.newPassword && (
                  <p className="error">{errors.newPassword}</p>
                )}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  aria-label="Enter your new password again"
                />
                {errors.confirmPassword && (
                  <p className="error">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}
          <button type="submit" disabled={isLoading}>
            {step === 1 ? ( isLoading? "Sending": "Send OTP" ) : step === 2 ? "Verify OTP" : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
