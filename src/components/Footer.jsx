import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Wallet } from "lucide-react";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    {/* Left Section - Logo and Tagline */}
                    <div className="footer-logo">
                        <Link to="/" className="text-2xl font-bold text-yellow-400">
                            <Wallet size={24} />
                            ExpenseTrack
                        </Link>
                        <p className="text-gray-400 mt-4">
                            Simplify your expense management, track your spending, and gain financial insights with ExpenseTrack.
                        </p>
                    </div>

                    {/* Middle Section - Quick Links */}
                    <div className="footer-links">
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul>
                            <li><a href="#home" className="hover:text-yellow-300 transition-colors">Home</a></li>
                            <li><a href="#features" className="hover:text-yellow-300 transition-colors">Features</a></li>
                            <li><a href="#about" className="hover:text-yellow-300 transition-colors">About Us</a></li>
                            <li><a href="#contact" className="hover:text-yellow-300 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Right Section - Social Links */}
                    <div className="footer-social">
                        <h4 className="font-semibold mb-4">Follow Us</h4>
                        <div className="social-icons">
                            <a href="https://x.com" className="hover:text-yellow-400"><FaTwitter className="h-6 w-6" /></a>
                            <a href="https://www.linkedin.com" className="hover:text-yellow-400"><FaLinkedin className="h-6 w-6" /></a>
                            <a href="https://www.facebook.com" className="hover:text-yellow-400"><FaFacebook className="h-6 w-6" /></a>
                            <a href="https://www.instagram.com" className="hover:text-yellow-400"><FaInstagram className="h-6 w-6" /></a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <p className="footer-copyright text-gray-400 mt-4">
                    &copy; 2025 ExpenseTrack. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
