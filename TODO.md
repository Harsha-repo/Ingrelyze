# TODO: Add Logout Button to BarcodeScanner Page

- [x] Import useNavigate from 'react-router-dom' in BarcodeScanner.js
- [x] Add useNavigate hook inside the BarcodeScanner component
- [x] Add handleLogout function: clear localStorage tokens (access_token, refresh_token) and navigate to '/'
- [x] Add logout Button positioned fixed in top right corner (top: 10px, right: 10px) with onClick={handleLogout}
- [x] Test logout functionality: Login, navigate to BarcodeScanner, click logout, verify redirect to login and tokens cleared
