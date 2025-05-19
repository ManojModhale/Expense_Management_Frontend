import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Loader from "../components/Loader";
import { FaUserCircle, FaEnvelope, FaIdCardAlt, FaLock, FaEdit, FaSave, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const API_BASE_URL = "http://localhost:8181/api"; // Your backend API base URL

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role:''
        // Add other fields you want to display/edit, e.g., phoneNumber, address
    });
    console.log('inside Profile ',sessionStorage.getItem("role")," with username : ",sessionStorage.getItem("username"));
    const [validationErrors, setValidationErrors] = useState({}); // For frontend validation feedback

    // Helper to validate email format
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Fetch user data from backend on component mount
    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const username = sessionStorage.getItem("username");
            if (!username) {
                throw new Error("User not logged in. Please log in to view your profile.");
            }

            const response = await fetch(`${API_BASE_URL}/users/get-user-profile/${username}`); // Assuming an endpoint like /api/user/{username}
            console.log(response);
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Failed to fetch user profile.";
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log('fetched data ',data);
            setUserData(data);
            setFormData({
                username: data.username || '',
                email: data.email || '',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                role: data.role || '',
                // Initialize other fields from fetched data
            });
            sessionStorage.setItem("user", JSON.stringify(data)); // Update session storage with fresh data
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError(err.message || "Failed to load profile.");
            Swal.fire({
                title: "Error",
                text: err.message || "Failed to load profile.",
                icon: "error",
                confirmButtonText: "Ok",
            });
        } finally {
            setLoading(false);
        }
        
    }, []);

    useEffect(() => {
        // Attempt to load from session storage first to show something quickly
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
            setFormData({
                username: parsedUser.username || '',
                email: parsedUser.email || '',
                firstName: parsedUser.firstName || '',
                lastName: parsedUser.lastName || '',
                role: parsedUser.role || '',
            });
            setLoading(false);
        }
        // Then fetch from backend to ensure data is up-to-date
        fetchUserProfile();
    }, [fetchUserProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({}); // Clear previous validation errors

        /*
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.username) {
            Swal.fire("Validation Error", "All fields are required.", "warning");
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            Swal.fire("Validation Error", "Please enter a valid email address.", "warning");
            setLoading(false);
            return;
        }*/
       const currentErrors = {};
        if (!formData.firstName) currentErrors.firstName = "First name is required.";
        if (!formData.lastName) currentErrors.lastName = "Last name is required.";
        if (!formData.email) currentErrors.email = "Email is required.";
        else if (!isValidEmail(formData.email)) currentErrors.email = "Please enter a valid email address.";

        if (Object.keys(currentErrors).length > 0) {
            setValidationErrors(currentErrors);
            Swal.fire("Validation Error", "Please correct the highlighted fields.", "warning");
            setLoading(false);
            return;
        }

        try {
            const username = sessionStorage.getItem("username"); // Get current logged-in username
            if (!username) {
                throw new Error("User not logged in.");
            }

            // Create payload for update. Only send fields that can be updated by the user.
            const updatedProfileData = {
                //username: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                // Add other updatable fields here
            };

            const response = await fetch(`${API_BASE_URL}/users/update-user/${username}`, { // Example endpoint
                method: 'PUT', // Or POST, depending on your backend
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfileData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile.");
            }

            const responseData = await response.json();
            setUserData(responseData); // Update local state with the new data from backend
            sessionStorage.setItem("user", JSON.stringify(responseData)); // Update session storage
            setIsEditing(false); // Exit edit mode
            Swal.fire("Success", "Profile updated successfully!", "success");

        } catch (err) {
            console.error("Error updating user profile:", err);
            setError(err.message || "Failed to update profile.");
            Swal.fire("Error", err.message || "Failed to update profile.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        
        return <Loader message="Loading profile..." />;
    }

    if (error) {
        return (
            <div className="p-4 text-center text-danger">
                <h3>Error: {error}</h3>
                <Button onClick={fetchUserProfile}>Retry Loading Profile</Button>
            </div>
        );
    }

    if (!userData) {
        return <div className="p-4 text-center text-muted">No profile data available.</div>;
    }

    return (
         <div className="container mt-5"> {/* Keep container for overall padding and max-width behavior */}
            <Row className="justify-content-center"> {/* Center the column */}
                <Col md={8} lg={6}> {/* Adjust Col size for desired width */}
                    <Card className="shadow-lg p-4">
                        <Card.Body>
                            {/* Header Section */}
                            <div className="d-flex align-items-center mb-4">
                                <FaUserCircle size={60} className="text-primary me-3" />
                                <div>
                                    <h2 className="mb-0">Hi, {userData.firstName}!</h2>
                                    <p className="text-muted">Your Profile</p>
                                </div>
                            </div>

                            {isEditing ? (
                                <Form onSubmit={handleUpdateProfile}>
                                    <Row className="mb-3">
                                        {/* First Name */}
                                        <Col md={6}>
                                            <Form.Group controlId="formFirstName" className="mb-3">
                                                <Form.Label>First Name:</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaIdCardAlt /></InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        isInvalid={!!validationErrors.firstName}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationErrors.firstName}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        {/* Last Name */}
                                        <Col md={6}>
                                            <Form.Group controlId="formLastName" className="mb-3">
                                                <Form.Label>Last Name:</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaIdCardAlt /></InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        isInvalid={!!validationErrors.lastName}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationErrors.lastName}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        {/* Email */}
                                        <Col md={6}>
                                            <Form.Group controlId="formEmail" className="mb-3">
                                                <Form.Label>Email:</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        isInvalid={!!validationErrors.email}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {validationErrors.email}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                        {/* Username (read-only) */}
                                        <Col md={6}>
                                            <Form.Group controlId="formUsername" className="mb-3">
                                                <Form.Label>Username:</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaUserCircle /></InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        name="username"
                                                        value={formData.username}
                                                        readOnly
                                                        disabled
                                                    />
                                                </InputGroup>
                                                <Form.Text className="text-muted">
                                                    Your username cannot be changed.
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Role (read-only) */}
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="formRole" className="mb-3">
                                                <Form.Label>Role:</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Text><FaInfoCircle /></InputGroup.Text>
                                                    <Form.Control
                                                        type="text"
                                                        name="role"
                                                        value={formData.role}
                                                        readOnly
                                                        disabled
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <Button variant="secondary" onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                username: userData.username || '',
                                                email: userData.email || '',
                                                firstName: userData.firstName || '',
                                                lastName: userData.lastName || '',
                                                role: userData.role || '',
                                            });
                                            setValidationErrors({});
                                        }}>
                                            <FaTimesCircle className="me-1" /> Cancel
                                        </Button>
                                        <Button variant="primary" type="submit" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <><FaSave className="me-1" /> Save Changes</>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <div>
                                    {/* Personal Details Card */}
                                    <Card className="mb-4 bg-light">
                                        <Card.Header className="bg-primary text-white">
                                            <h5 className="mb-0"><FaIdCardAlt className="me-2" /> Personal Details</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={12}> {/* Changed to md={12} for single column within smaller card */}
                                                    <p className="mb-2"><strong>First Name:</strong> {userData.firstName}</p>
                                                </Col>
                                                <Col md={12}> {/* Changed to md={12} */}
                                                    <p className="mb-2"><strong>Last Name:</strong> {userData.lastName}</p>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    {/* Contact Information Card */}
                                    <Card className="mb-4 bg-light">
                                        <Card.Header className="bg-success text-white">
                                            <h5 className="mb-0"><FaEnvelope className="me-2" /> Contact Information</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={12}>
                                                    <p className="mb-2"><strong>Email:</strong> {userData.email}</p>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    {/* Account Details Card (Read-only) */}
                                    <Card className="mb-4 bg-light">
                                        <Card.Header className="bg-info text-white">
                                            <h5 className="mb-0"><FaLock className="me-2" /> Account Details</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={12}> {/* Changed to md={12} */}
                                                    <p className="mb-2"><strong>Username:</strong> {userData.username}</p>
                                                </Col>
                                                <Col md={12}> {/* Changed to md={12} */}
                                                    <p className="mb-2"><strong>Role:</strong> {userData.role}</p>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>

                                    <div className="d-flex justify-content-end gap-2 mt-4">
                                        <Button variant="primary" onClick={() => setIsEditing(true)}>
                                            <FaEdit className="me-1" /> Edit Profile
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UserProfile;