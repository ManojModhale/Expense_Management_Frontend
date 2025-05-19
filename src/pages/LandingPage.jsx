import React from "react";
import { Link } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Wallet, CheckCircle, Users, LayoutDashboard, Phone, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./LandingPage.css";

// Animation variants
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

// Styled Components
const FeatureCardRoot = styled(motion.div)(({ theme }) => ({
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: theme.spacing(2),
    padding: theme.spacing(6),
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
}));

const FeatureCardTitle = styled("h3")(({ theme }) => ({
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#fff",
    marginBottom: theme.spacing(2),
}));

const FeatureCardDescription = styled("p")(({ theme }) => ({
    color: "#d1d5db",
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
    return (
        <div className="landing-page">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="main-content">
                {/* Hero Section */}
                <section className="hero-section">
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
                        <h2 className="about-us-title">About Us</h2>
                        <p className="about-us-description">
                            Welcome to our Expense Management System – a modern solution designed to streamline the way organizations handle expenses. From submission to approval, our platform simplifies every step, ensuring transparency and efficiency.
                        </p>
                        <p className="about-us-description">
                            Our application allows employees to effortlessly record their expenses, categorize them, and submit them for review. Managers can review submissions with clear insights, approve or reject them, and maintain detailed expense records, all from a single dashboard.
                        </p>
                        <p className="about-us-description">
                            Built with cutting-edge technology, our system is secure, user-friendly, and scalable, catering to businesses of all sizes. Whether you're looking to save time, reduce manual errors, or gain better financial control, our Expense Management System is here to help.
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section" id="features">
                    <div className="features-container">
                        <h2 className="features-title">Key Features</h2>
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
                        </motion.div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="contact-section" id="contact">
                    <div className="contact-container">
                        <h2 className="contact-title">Contact Us</h2>
                        <p className="contact-description">
                            Have questions or need assistance? Reach out to us, and our support team will be happy to help.
                        </p>
                        <form className="contact-form">
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="contact-input"
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                className="contact-input"
                            />
                            <TextField
                                label="Message"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                margin="normal"
                                className="contact-input"
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

                {/* Footer */}
                <Footer />
            </main>
        </div>
    );
};

export default LandingPage;
