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
        background: 'linear-gradient(135deg, #00B09B, #96C93D)',// Gradient background
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, background: 'white' }}>
          <Typography variant="h5" gutterBottom>
            User Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginForm;
