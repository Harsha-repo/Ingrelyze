import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="menu-button">
                    &#9776;
                </button>
            </div>
            <div className="navbar-center">
                <Link to="/ingrelyze" className="nav-button">Ingrelyze</Link>
                <Link to="/instant-analyzer" className="nav-button">Instant-Analyzer</Link>
                <Link to="/new-addon" className="nav-button">New-AddOn</Link>
                <Link to="/chatbot" className="nav-button">Chat Bot</Link>
            </div>
            <div className="navbar-right">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;