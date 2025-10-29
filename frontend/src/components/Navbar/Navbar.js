import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');

    const userTypes = [
        'Adult men',
        'Adult women (moderate activity)',
        'Adult women (sedentary)',
        'Pregnant women'
    ];

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('userType');
        navigate('/');
    };

    const handleUserTypeChange = (e) => {
        const selectedType = e.target.value;
        setUserType(selectedType);
        localStorage.setItem('userType', selectedType);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('userTypeChanged'));
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="menu-button">
                    &#9776;
                </button>
                <select
                    value={userType}
                    onChange={handleUserTypeChange}
                    className="user-type-dropdown"
                >
                    <option value="">Select User Type</option>
                    {userTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            <div className="navbar-center">
                <Link to="/ingrelyze" className="nav-button">Ingrelyze</Link>
                <Link to="/instant-analyzer" className="nav-button">Photo-Analyzer</Link>
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