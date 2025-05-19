import React, { useState } from "react";
import { TextField, Button, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./RegisterPage.css";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        firstName: "",
        lastName: "",
        role: "",
    });

    const [errors, setErrors] = useState({});
    const roles = ["EMPLOYEE", "MANAGER"];

    const validate = () => {
        const newErrors = {};
        const { firstName, lastName, email, username, password, confirmPassword, role } = formData;

        if (!firstName.trim()) newErrors.firstName = "First name is required";
        if (!lastName.trim()) newErrors.lastName = "Last name is required";

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+$/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!username.trim()) newErrors.username = "Username is required";

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])/.test(password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/(?=.*[@$!%*?&])/.test(password)) {
            newErrors.password = "Password must contain at least one symbol (@$!%*?&)";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!role) newErrors.role = "Role selection is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const data = await registerUser({
                username: formData.username,
                password: formData.password,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role,
            });

            console.log("Registration successful:", data);
            Swal.fire({
                title: "Success",
                text: "Your account has been created successfully!",
                icon: "success",
                timer: 3000,
                confirmButtonText: "Continue",
            }).then(() => {
                navigate("/login");
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Registration failed. Please try again.";
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Try Again",
            });
        }
    };


    return (
        <div className="register-page">
            <form className="register-form" onSubmit={handleSubmit}>
                <Typography variant="h4" gutterBottom>
                    Registration Form
                </Typography>

                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.username}
                    helperText={errors.username}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                />
                <TextField
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.role}
                    helperText={errors.role}
                >
                    {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                            {role}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: "20px" }}
                >
                    Register
                </Button>
            </form>
        </div>
    );
};

export default RegisterPage;
