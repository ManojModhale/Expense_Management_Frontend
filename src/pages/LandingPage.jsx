import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Button,
    TextField,
    AppBar,      // Added for Navbar
    Toolbar,     // Added for Navbar
    IconButton,  // Added for Navbar
    Typography,  // Added for Navbar
    Menu,        // Added for Navbar
    MenuItem,    // Added for Navbar
    Box          // Added for Navbar
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Wallet, CheckCircle, Users, LayoutDashboard, Menu as MenuIcon, Image, Workflow } from "lucide-react"; // Menu as MenuIcon for Navbar
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa'; // Added for Footer
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS CSS
import Swal from 'sweetalert2';
import "./LandingPage.css";

// Animation variants (keep as is)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

// Styled Components (adjust background and text colors)
const FeatureCardRoot = styled(motion.div)(({ theme }) => ({
    backgroundColor: "#ffffff", // Changed from rgba(255, 255, 255, 0.05) to white
    borderRadius: theme.spacing(2),
    padding: theme.spacing(6),
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Softer shadow for lighter background
    border: "1px solid rgba(0, 0, 0, 0.05)", // Lighter border
    height: '100%', // Ensure cards take full height in grid
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
}));

const FeatureCardTitle = styled("h3")(({ theme }) => ({
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333", // Changed from #fff to dark gray
    marginBottom: theme.spacing(2),
}));

const FeatureCardDescription = styled("p")(({ theme }) => ({
    color: "#555", // Changed from #d1d5db to medium gray
    lineHeight: 1.6,
}));

const FeatureCard = ({ title, description, icon: Icon }) => (
    <FeatureCardRoot variants={itemVariants}>
        <div className="feature-card-header">
            <Icon className="feature-card-icon" />
            <FeatureCardTitle>{title}</FeatureCardTitle>
        </div>
        <FeatureCardDescription>{description}</FeatureCardDescription>
    </FeatureCardRoot>
);

const LandingPage = () => {
    // Navbar state and handlers
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Form state for Contact Us section
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);

        // --- Backend Integration ---
        try {
            // Replace with your actual backend API endpoint for contact form
            const response = await fetch('http://localhost:8181/api/users/contact-us', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Swal.fire({
                    title: "Success",
                    text: "Your Message has been Sent successfully!",
                    icon: "success",
                    timer: 3000,
                    confirmButtonText: "Continue",
                })
                setFormData({ name: '', email: '', mobile: '', message: '' }); // Clear form
            } else {
                //alert('Failed to send message. Please try again.');
                const errorData = await response.json().text();
                console.error('Backend error:', errorData);
                Swal.fire({
                    title: "Failed",
                    text: errorData.message || "Your Message has not been Sent successfully! Please try again.", // Use backend message if available
                    icon: "error", // Changed from "fail" to "error"
                    timer: 3000,
                    confirmButtonText: "Continue",
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Refined error message handling for network errors
            let errorMessage = "An error occurred. Please check your network connection.";
            if (error.message) {
                // Sometimes the error object itself has a useful message for network issues
                errorMessage = error.message;
            }
            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Try Again",
            });
        }
    };

    // Initialize AOS
    useEffect(() => {
        AOS.init({
            duration: 1000, // animation duration
            once: true, // whether animation should happen only once - while scrolling down
        });
        AOS.refresh(); // Recalculate positions on component updates
    }, []);

    return (
         <div className="landing-page">
            {/* INLINED NAVBAR START */}
            <AppBar position="static" className="navbar" id="home">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {/* Logo and Title */}
                    <div className="logo-container" style={{ display: "flex", alignItems: "center" }}>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Wallet size={30} />
                        </IconButton>
                        <Typography variant="h4" sx={{ fontWeight: "bold", marginLeft: "0.5rem" }}>
                            ExpenseTrack
                        </Typography>
                    </div>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        <Button color="inherit" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }}>
                            Home
                        </Button>
                        <Button color="inherit" href="#about" sx={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }}>
                            About Us
                        </Button>
                        <Button color="inherit" href="#features" sx={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }}>
                            Features
                        </Button>
                        <Button color="inherit" href="#how-it-works" sx={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }}>
                            How It Works
                        </Button>
                        <Button color="inherit" href="#contact" sx={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem' }}>
                            Contact
                        </Button>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <Button sx={{ color: 'white', fontSize: '1.1rem' }}>
                                Sign Up
                            </Button>
                        </Link>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    background: "linear-gradient(to right, #2196F3, #1976D2)",
                                    color: "white",
                                    fontSize: "1.1rem",
                                }}
                            >
                                Log In
                            </Button>
                        </Link>
                    </Box>

                    {/* Mobile Menu Toggle */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" aria-label="menu" color="inherit" onClick={handleMenuOpen}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>

                {/* Mobile Menu Dropdown */}
                <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            background: "#333",
                            color: "white",
                        },
                    }}
                >
                    <MenuItem onClick={handleMenuClose} component={Link} to="/">
                        Home
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <a href="#features" style={{ color: 'white', textDecorationLine: 'none' }}>Features</a>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <a href="#how-it-works" style={{ color: 'white', textDecorationLine: 'none' }}>How It Works</a>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <a href="#about" style={{ color: 'white', textDecorationLine: 'none' }}>About Us</a>
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <a href="#contact" style={{ color: 'white', textDecorationLine: 'none' }}>Contact</a>
                    </MenuItem>
                    <Link to="/register" style={{ textDecoration: 'none' }}><MenuItem onClick={handleMenuClose} sx={{ color: 'white' }}>
                        Sign Up
                    </MenuItem></Link>
                    <Link to="/login" style={{ textDecoration: 'none' }}><MenuItem
                        onClick={handleMenuClose}
                        sx={{
                            background: "linear-gradient(to right, #2196F3, #1976D2)",
                            color: "white",
                        }}
                    > Log In
                    </MenuItem></Link>
                </Menu>
            </AppBar>
            {/* INLINED NAVBAR END */}

            {/* Main Content */}
            <main className="main-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-background-image"></div> {/* Background image div */}
                    <div className="hero-container">
                        <motion.h1
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hero-title"
                        >
                            Simplify Expense Management
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hero-description"
                        >
                            Employees can submit their expenses with ease, while managers can quickly review and take action. Streamline your workflows today!
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="cta-buttons"
                        >
                            <Link to="/register"><Button
                                variant="contained"
                                size="large"
                                className="cta-button"
                            >
                                Get Started - It's Free
                            </Button></Link>
                        </motion.div>
                    </div>
                </section>

                 {/* About Us Section */}
                <section className="about-us-section" id="about">
                    <div className="about-us-container">
                        <h2 className="about-us-title" data-aos="fade-up">About Us</h2>
                        <p className="about-us-description" data-aos="fade-up" data-aos-delay="100">
                            Welcome to our Expense Management System – a modern solution designed to streamline the way organizations handle expenses. From submission to approval, our platform simplifies every step, ensuring transparency and efficiency.
                        </p>
                        <p className="about-us-description" data-aos="fade-up" data-aos-delay="200">
                            Our application allows employees to effortlessly record their expenses, categorize them, and submit them for review. Managers can review submissions with clear insights, approve or reject them, and maintain detailed expense records, all from a single dashboard.
                        </p>
                        <p className="about-us-description" data-aos="fade-up" data-aos-delay="300">
                            Built with cutting-edge technology, our system is secure, user-friendly, and scalable, catering to businesses of all sizes. Whether you're looking to save time, reduce manual errors, or gain better financial control, our Expense Management System is here to help.
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section" id="features">
                    <div className="features-container">
                        <h2 className="features-title" data-aos="fade-up">Key Features</h2>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="features-grid"
                        >
                            <FeatureCard
                                title="Expense Submission"
                                description="Submit and categorize your expenses with just a few clicks."
                                icon={Wallet}
                            />
                            <FeatureCard
                                title="Approval Workflow"
                                description="Managers can approve or reject expenses in a structured workflow."
                                icon={CheckCircle}
                            />
                            <FeatureCard
                                title="Expense History"
                                description="View detailed history of submitted and approved/rejected expenses."
                                icon={LayoutDashboard}
                            />
                            <FeatureCard
                                title="Expense Report"
                                description="Expenses Graphical represention reports based on different criterias."
                                icon={Image}
                            />
                        </motion.div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="how-it-works-section" id="how-it-works">
                    <div className="how-it-works-container">
                        <h2 className="how-it-works-title" data-aos="fade-up">How It Works</h2>
                        <div className="how-it-works-steps">
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="step-card" data-aos="fade-up" data-aos-delay="100">
                                <Workflow size={48} className="step-icon" />
                                <h3>1. Submit Expense</h3>
                                <p>Easily log your expenses by entering details and uploading receipts.</p>
                            </motion.div>
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="step-card" data-aos="fade-up" data-aos-delay="200">
                                <Users size={48} className="step-icon" />
                                <h3>2. Manager Review</h3>
                                <p>Managers get real-time notifications to review submitted expenses.</p>
                            </motion.div>
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="step-card" data-aos="fade-up" data-aos-delay="300">
                                <CheckCircle size={48} className="step-icon" />
                                <h3>3. Get Approval</h3>
                                <p>Expenses are approved or rejected, and you're notified instantly.</p>
                            </motion.div>
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="step-card" data-aos="fade-up" data-aos-delay="400">
                                <LayoutDashboard size={48} className="step-icon" />
                                <h3>4. Track & Report</h3>
                                <p>Keep track of all your expenses and generate comprehensive reports.</p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="contact-section" id="contact">
                    <div className="contact-container">
                        <h2 className="contact-title" data-aos="fade-up">Contact Us</h2>
                        <p className="contact-description" data-aos="fade-up" data-aos-delay="100">
                            Have questions or need assistance? Reach out to us, and our support team will be happy to help.
                        </p>
                        <form className="contact-form" data-aos="fade-up" data-aos-delay="200" onSubmit={handleSubmit}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="contact-input"
                                name="name" // Added name prop
                                value={formData.name} // Controlled component
                                onChange={handleChange} // Handle changes
                                InputLabelProps={{ style: { color: '#666' } }}
                                InputProps={{ style: { color: '#333' } }}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="contact-input"
                                name="email" // Added name prop
                                type="email" // Set type for email validation
                                value={formData.email} // Controlled component
                                onChange={handleChange} // Handle changes
                                InputLabelProps={{ style: { color: '#666' } }}
                                InputProps={{ style: { color: '#333' } }}
                            />
                            <TextField
                                label="Mobile"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="contact-input"
                                name="mobile" // Added name prop
                                type="tel" // Set type for telephone
                                value={formData.mobile} // Controlled component
                                onChange={handleChange} // Handle changes
                                InputLabelProps={{ style: { color: '#666' } }}
                                InputProps={{ style: { color: '#333' } }}
                            />
                            <TextField
                                label="Message"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                                className="contact-input"
                                name="message" // Added name prop
                                value={formData.message} // Controlled component
                                onChange={handleChange} // Handle changes
                                InputLabelProps={{ style: { color: '#666' } }}
                                InputProps={{ style: { color: '#333' } }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                className="contact-submit-button"
                            >
                                Submit
                            </Button>
                        </form>
                    </div>
                </section>

                {/* INLINED FOOTER START */}
                <footer className="footer">
                    <div className="footer-container">
                        <div className="footer-content">
                            {/* Left Section - Logo and Tagline */}
                            <div className="footer-logo">
                                <Link to="/" className="footer-brand-link">
                                    <Wallet size={24} />
                                    ExpenseTrack
                                </Link>
                                <p className="footer-tagline">
                                    Simplify your expense management, track your spending, and gain financial insights with ExpenseTrack.
                                </p>
                            </div>

                            {/* Middle Section - Quick Links */}
                            <div className="footer-links">
                                <h4 className="font-semibold mb-4">Quick Links</h4>
                                <ul>
                                    <li><a href="#home" className="hover:text-blue-300 transition-colors">Home</a></li>
                                    <li><a href="#features" className="hover:text-blue-300 transition-colors">Features</a></li>
                                    <li><a href="#how-it-works" className="hover:text-blue-300 transition-colors">How It Works</a></li>
                                    <li><a href="#about" className="hover:text-blue-300 transition-colors">About Us</a></li>
                                    <li><a href="#contact" className="hover:text-blue-300 transition-colors">Contact Us</a></li>
                                </ul>
                            </div>

                            {/* Right Section - Social Links */}
                            <div className="footer-social">
                                <h4 className="font-semibold mb-4">Follow Us</h4>
                                <div className="social-icons">
                                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaTwitter className="h-6 w-6" /></a>
                                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaLinkedin className="h-6 w-6" /></a>
                                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaFacebook className="h-6 w-6" /></a>
                                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><FaInstagram className="h-6 w-6" /></a>
                                </div>
                            </div>
                        </div>

                        {/* Copyright Section */}
                        <p className="footer-copyright">
                            &copy; {new Date().getFullYear()} ExpenseTrack. All rights reserved.
                        </p>
                    </div>
                </footer>
                {/* INLINED FOOTER END */}
            </main>
        </div>
    );
};

export default LandingPage;