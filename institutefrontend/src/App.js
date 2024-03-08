import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import RegisterForm from './RegisterForm';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import LoginForm from './LoginForm';
import StudentBatchDetails from './UserPages/StudentBatchDetails';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleRegisterSuccess = () => {
    setAlertSeverity('success');
    setAlertMessage('Registered successfully!');
    setAlertOpen(true);
  };

  const handleBackToLogin = () => {
    setShowRegisterForm(false);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <div className="container">
        <Routes>
          <Route
            path="/login"
            element={loggedInUser ? <Navigate to={`/${loggedInUser.userType}`} /> : <LoginForm onLogin={(email, userType) => setLoggedInUser({ email, userType })} onToggleForm={() => setShowRegisterForm(true)} />}
          />
          <Route
            path="/register"
            element={showRegisterForm ? <RegisterForm onRegister={handleRegisterSuccess} onToggleForm={() => setShowRegisterForm(false)} /> : <Navigate to="/login" />}
          />
          <Route
            path="/user"
            element={loggedInUser && loggedInUser.userType === 'user' ? <UserDashboard onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={loggedInUser && loggedInUser.userType === 'admin' ? <AdminDashboard onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}
          />
          <Route path="/batch-details" element={<StudentBatchDetails />} /> 
          <Route index element={<Navigate to="/login" />} />
        </Routes>
      <Snackbar open={alertOpen} autoHideDuration={4000} onClose={handleAlertClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default App;
