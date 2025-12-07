import React from 'react';
import Navbar from './Navbar/Navbar';

const DashboardLayout = ({ children, onPageChange }) => {
  return (
    <div>
      <Navbar onPageChange={onPageChange} />
      {children}
    </div>
  );
};

export default DashboardLayout;
