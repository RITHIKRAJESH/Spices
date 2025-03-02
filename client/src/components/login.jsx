import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "Valid email is required";
    tempErrors.password = formData.password ? "" : "Password is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const url = import.meta.env.VITE_BASE_URL;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios.post(`${url}/user/login`, formData)
        .then((res) => {
          alert(res.data.msg);
          const token = res.data.token;
          const decoded = jwtDecode(token);
          localStorage.setItem("token", token);
          if (decoded.payload.role === "farmer" && res.data.status === 200) {
            navigate("/farmer");
          } else if (res.data.status === 200 && decoded.payload.role === "admin") {
            navigate("/admin");
          } else if (res.data.status === 200 && decoded.payload.role === "wholesaler") {
            navigate("/wholesaler");
          } else if (res.data.status === 200 && decoded.payload.role === "retailer") {
            navigate("/retailer");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', // Warm gradient background
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{
          mt: 5, p: 4, boxShadow: 5, borderRadius: 3, background: 'white', border: '1px solid #ddd',
          transition: 'all 0.3s ease-in-out', ':hover': { boxShadow: 10, transform: 'scale(1.02)' }
        }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
            Login to Your Account
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
              sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password}
              sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2, width: '100%', padding: '12px', fontSize: '16px', background: '#ff7e5f', '&:hover': { background: '#feb47b' },
                borderRadius: 3, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease-in-out'
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginForm;
