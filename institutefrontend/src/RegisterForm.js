import React, { useState } from 'react';
import axios from 'axios';
import { Radio, Typography, TextField, Alert, Button } from '@mui/material';

const RegisterForm = ({ onRegister, onToggleForm, onRegisteredSuccessfully }) => {
  const [email, setEmail] = useState('');
  const [instituteKey, setInstituteKey] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userType, setUserType] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [registeredSuccessfully, setRegisteredSuccessfully] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
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

      if (userType === 'user') {
        const adminResponse = await axios.get(`http://localhost:8080/getAdmin?instituteKey=${instituteKey}`);

        if (adminResponse && adminResponse.status === 200) {
          registrationData = {
            email: email,
            password: password,
            userType: userType,
            instituteKey: instituteKey,
          };
        } else {
          
          setAlertMessage('Invalid instituteKey');
         
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

      const response = await axios.post(`http://localhost:8080/register/${userType}`, registrationData);

      if (response && response.status === 200 && response.data === 'Registration successful') {
        resetFormFields();
      //alert("Successful");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        
        setAlertMessage('Email already registered');
        
      } else {
        
        setAlertMessage('Registration failed');
        
      }
    }
  };

  const handleSubmit = (e) => {
    if (userType === 'admin' && secretKey !== 'admin') {
      e.preventDefault();
     
    } else {
      e.preventDefault();

      validateEmail();
      validatePassword();
      if (userType === 'user' && !emailError && !passwordError) {
        onRegister(email);
        handleRegister();
      } else if (userType === 'admin' && !emailError && !passwordError && secretKey === 'admin') {
        resetFormFields();
        onRegister(email);
        handleRegister();
      }
    }
  };


  const styles = {
    container: {
      backgroundColor: 'White',
      textAlign: 'center',
      maxWidth: '400px',
      margin: 'auto',
      marginTop: '100px',
      padding: '20px',
      marginLeft: '300px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
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
      <div style={{/* ... */}}>
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
              User
              <Radio
                type="radio"
                name="UserType"
                value="admin"
                checked={userType === "admin"}
                onChange={(e) => setUserType(e.target.value)}
                style={styles.radio}
              />
              Admin
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
          

         
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;