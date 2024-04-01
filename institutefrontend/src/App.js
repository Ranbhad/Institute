import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import LoginForm from './LoginForm';
import StudentBatchDetails from './UserPages/StudentBatchDetails';
import AdminDetails from './UserPages/AdminDetails';
import PersistentDrawerLeft from './Pages/Navbar';
import AddCourses from './UserPages/AddCourses';
import PersistentDrawer from './Pages/NavbarUser';
import YourCourses from './UserPages/YourCourses';
import EnrollStudents from './UserPages/EnrollStudents';
import Batches from './UserPages/Batches';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const handleLoginSuccess = (email, userType) => {
    setLoggedInUser({ email, userType });
  };
  const handleRegisterSuccess = () => {
  };
  const handleBackToLogin = () => {
    setLoggedInUser(null); 
    setShowRegisterForm(false);
  };
  return (
    <div className="container">
        {loggedInUser && loggedInUser.userType === 'admin' && <PersistentDrawerLeft loggedInUser={loggedInUser} onBackToLogin={handleBackToLogin} />}
        {loggedInUser && loggedInUser.userType === 'user' && <PersistentDrawer loggedInUser={loggedInUser} onBackToLogin={handleBackToLogin} />}

        <Routes>
          <Route
            path="/login"
            element={loggedInUser ? <Navigate to={`/${loggedInUser.userType}`} /> : <LoginForm onLogin={handleLoginSuccess} onToggleForm={() => setShowRegisterForm(true)} />}
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
            element={loggedInUser && loggedInUser.userType === 'admin' ? <AdminDetails onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}
          />
          <Route path="/batch-details" element={<StudentBatchDetails />} />
          <Route path='/addingCourse' element={loggedInUser && loggedInUser.userType === 'admin' ? <AdminDashboard onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}/>
          <Route path='/adminDetails' element={loggedInUser && loggedInUser.userType === 'admin' ? <AdminDetails onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}/>
          <Route path='/addedCourses' element={loggedInUser && loggedInUser.userType === 'admin' ? <AddCourses onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />} />
          <Route
          path="/edit-course/:courseId"
          element={loggedInUser && loggedInUser.userType === 'admin' ? <AddCourses onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}
        />
          <Route path='/yourCourse' element={loggedInUser && loggedInUser.userType === 'user' ? <YourCourses onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />} />
          <Route path="/enroll-student" element={loggedInUser && loggedInUser.userType === 'user' ? <EnrollStudents onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />} />
          <Route path="/batches" element={loggedInUser && loggedInUser.userType === 'user' ? <Batches onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />} />
          <Route
            path="/registeredStudents"
            element={loggedInUser && loggedInUser.userType === 'user' ? <UserDashboard onBackToLogin={() => setLoggedInUser(null)} loggedInUser={loggedInUser} /> : <Navigate to="/login" />}
          />
          <Route index element={<Navigate to="/login" />} />
        </Routes>
    </div>
  );
};

export default App;
