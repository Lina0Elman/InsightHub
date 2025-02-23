import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Paper, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import './Register.css';
import { config } from '../config';
import Footer from '../components/Footer';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.app.backend_url()}/auth/register`, {
        username,
        email,
        password,
      });
      // Handle successful registration
      console.log(response.data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after registration
      }, 4000);
    } catch (error) {
      // Handle registration error
      const err = error as any;
      if (err.response && err.response.data) {
        setError(err.response.data.toString());
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="body">
      <Container component="main" maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
          <Typography component="h1" variant="h3" gutterBottom>
            Insight Hub
          </Typography>
          <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
            <Typography component="h1" variant="h5" align="center">
              Register
            </Typography>
            {error != '' && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>Registration successful! Redirecting to login...</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Typography variant="body2" align="center">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Login
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
      <Footer/>
    </div>
  );
};

export default Register;