import React, { useState } from 'react';
import axios from 'axios';
import { Radio, Typography, TextField, Button } from '@mui/material';
import Alerts from './Pages/Alerts';

const RegisterForm = ({ onRegister, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [instituteKey, setInstituteKey] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userType, setUserType] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [name, setName] = useState('');
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const openSuccessAlert = (message) => {
    setSuccessAlertMessage(message);
    setIsSuccessAlertOpen(true);
  };
  
  const openErrorAlert = (message) => {
    setErrorAlertMessage(message);
    setIsErrorAlertOpen(true);
  };
  const closeAlerts = () => {
    setIsSuccessAlertOpen(false);
    setIsErrorAlertOpen(false);
  };
const resetFormFields = () => {
    setEmail('');
    setInstituteKey('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
    setUserType('');
    setSecretKey('');
  };
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError('Invalid email format');
    } else {
        setEmailError('');
    }
  };

  const validatePassword = () => {
    if (!password.trim()) {
        setPasswordError('Password is required');
    } else if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
    } else {
        setPasswordError('');
    }
  };

  const handleRegister = async () => {
    try {
      let registrationData;
  
      if (userType === 'user' || userType === 'faculty') {
        const adminResponse = await axios.get(`http://localhost:8080/getAdmin?instituteKey=${instituteKey}`);
  
        if (adminResponse && adminResponse.status === 200) {
          registrationData = {
            email: email,
            password: password,
            userType: userType,
            instituteKey: instituteKey,
            name: name // Include name field for faculty
          };
        } else {
          openErrorAlert('Institute key not found');
          return;
        }
      } else {
        registrationData = {
          email: email,
          password: password,
          userType: userType,
          instituteKey: instituteKey,
        };
      }
  
      console.log('Registration Data:', registrationData); // Print request body
  
      const response = await axios.post(`http://localhost:8080/register/${userType}`, registrationData);
      console.log("Registration Response:", response);
      if (response && response.status === 200 && response.data === 'Registration successful' || response.data === 'Admin registration successful') {
        console.log("Registration successful");
        resetFormFields();
        openSuccessAlert('Registration Successful');
      } else {
        console.log("Registration not successful");
      }
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        openErrorAlert('Institute key not found');
      } else if (error.response && error.response.status === 400) {
        openErrorAlert('Email already registered');
      } else {
        openErrorAlert('Registration failed');
      }
    }
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit button clicked");
    validateEmail();
    validatePassword();
  
    if (!emailError && !passwordError) {
      if (userType === 'admin' && secretKey !== 'admin') {
        openErrorAlert('Invalid secret key');
      } else {
        onRegister(email);
        handleRegister();
      }
    }
  };
  // const handleRegister = async () => {
  //   try {
  //     let registrationData;
  //     let existingUser;
  
  //     // Check if email already exists in either admin or user table
  //     if (userType === 'admin') {
  //       existingUser = await axios.get(`http://localhost:8080/getAdminByEmail?email=${email}`);
  //     } else {
  //       existingUser = await axios.get(`http://localhost:8080/getUserByEmail?email=${email}`);
  //     }
  
  //     if (existingUser && existingUser.data) {
  //       openErrorAlert('Email already registered');
  //       return;
  //     }
  
  //     // Proceed with registration if email is not already registered
  //     if (userType === 'user') {
  //       const adminResponse = await axios.get(`http://localhost:8080/getAdmin?instituteKey=${instituteKey}`);
  
  //       if (adminResponse && adminResponse.status === 200) {
  //         registrationData = {
  //           email: email,
  //           password: password,
  //           userType: userType,
  //           instituteKey: instituteKey,
  //         };
  //       } else {
  //         openErrorAlert('Institute key not found');
  //         return;
  //       }
  //     } else {
  //       registrationData = {
  //         email: email,
  //         password: password,
  //         userType: userType,
  //         instituteKey: instituteKey,
  //       };
  //     }
  
  //     const response = await axios.post(`http://localhost:8080/register/${userType}`, registrationData);
  
  //     if (response && response.status === 200 && response.data === 'Registration successful') {
  //       resetFormFields();
  //       openSuccessAlert('Registration Successful');
  //     } else {
  //       openErrorAlert('Registration failed');
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 404) {
  //       openErrorAlert('Institute key not found');
  //     } else {
  //       openErrorAlert('Registration failed');
  //     }
  //   }
  // };
  
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Submit button clicked");
  //   validateEmail();
  //   validatePassword();
  
  //   if (!emailError && !passwordError) {
  //     if (userType === 'admin' && secretKey !== 'admin') {
  //       openErrorAlert('Invalid secret key');
  //     } else {
  //       onRegister(email);
  //       handleRegister();
  //     }
  //   }
  // };
  
  const styles = {
    container: {
        textAlign: 'center',
        maxWidth: '400px',
        margin: '100px auto',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '3px',
        backgroundColor: 'White'
      },
    heading: {
      fontSize: '28px',
      marginBottom: '20px',
      color: 'Black',
    },
    radioGroup: {
      marginTop: '10px',
      marginBottom: '20px',
    },
    radio: {
      marginRight: '5px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    label: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#333',
      textAlign: 'left',
    },
    input: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '3px',
      fontSize: '16px',
    },
    button: {
      padding: '12px',
      backgroundColor: 'Black',
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
      fontSize: '18px',
      cursor: 'pointer',
    },
    error: {
      color: '#dc3545',
      fontSize: '14px',
      marginTop: '5px',
    },
    toggleMessage: {
      marginTop: '10px',
      fontSize: '16px',
      color: '#333',
    },
    toggleButton: {
      backgroundColor: 'Black',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  };

  return (
    <div>
       <div style={{
        backgroundImage: 'url("https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77701479464.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        overflow: 'hidden',
      }}>
        <div style={styles.container}>
          <Typography variant="h6" component="h6" gutterBottom>
            <b>REGISTER AS:</b>
          </Typography>
          <div>
            <Typography>
              <Radio
                type="radio"
                name="UserType"
                value="user"
                checked={userType === "user"}
                onChange={(e) => setUserType(e.target.value)}
                style={styles.radio}
              />
              Manager
              <Radio
                type="radio"
                name="UserType"
                value="admin"
                checked={userType === "admin"}
                onChange={(e) => setUserType(e.target.value)}
                style={styles.radio}
              />
              Admin
              <Radio
                type="radio"
                name="UserType"
                value="faculty"
                checked={userType === "faculty"}
                onChange={(e) => setUserType(e.target.value)}
                style={styles.radio}
              />
              Faculty
            </Typography>
          </div>
          {userType === 'admin' ? (
            <form style={styles.form}>
              <Typography style={styles.label}><b>Secret Key</b></Typography>
              <TextField
                type="password"
                value={secretKey}
                placeholder="Secret Key"
                size='small'
                onChange={(e) => setSecretKey(e.target.value)}
              />&nbsp;
            </form>
          ) : null}
          {userType === 'faculty' ? (
            <form style={styles.form}>
              <Typography style={styles.label}><b>Name</b></Typography>
              <TextField
                value={name}
                label="Name"
                required
                size='small'
                onChange={(e) => setName(e.target.value)}
              />&nbsp;
            </form>
          ) : null}
          <form style={styles.form}>
            <TextField
              label="InstituteKey"
              value={instituteKey}
              onChange={(e) => setInstituteKey(e.target.value)}
              required
              size='small'
            />
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size='small'
            />
            {emailError && <p style={styles.error}>{emailError}</p>}
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size='small'
            />
            {passwordError && <p style={styles.error}>{passwordError}</p>}
            <button onClick={handleSubmit} style={styles.button}>Register</button>
          </form>
          <div>
            <Typography padding={"15px"}>Already have an account?   <button onClick={onToggleForm} style={styles.button}>Login</button></Typography>
          </div>
          <Alerts open={isSuccessAlertOpen} message={successAlertMessage} severity="success" onClose={closeAlerts} />
        <Alerts open={isErrorAlertOpen} message={errorAlertMessage} severity="error" onClose={closeAlerts} />
    

         
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;