// import { useState } from "react";
// import { TextField, Button, Container, Typography, Box, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";

// const UserForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "",
//     shopOrFarmName: "",
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validate = () => {
//     let tempErrors = {};
//     tempErrors.username = formData.username ? "" : "Username is required";
//     tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "Valid email is required";
//     tempErrors.password = formData.password.length >= 6 ? "" : "Password must be at least 6 characters";
//     tempErrors.role = formData.role ? "" : "User type is required";
//     if (formData.role) {
//       tempErrors.shopOrFarmName = formData.shopOrFarmName ? "" : formData.role === "farmer" ? "Farm Name is required" : "Shop Name is required";
//     }
//     setErrors(tempErrors);
//     return Object.values(tempErrors).every(x => x === "");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       console.log("Submitted Data:", formData);
//       const url = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
//       console.log("url", url);
//       axios.post(`${url}/user/registeruser`, formData)
//         .then((res) => {
//           alert(res.data.msg);
//           if (res.data.status === 200) {
//             navigate("/login");
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', // Warm gradient background
//         padding: 2,
//       }}
//     >
//       <Container maxWidth="sm">
//         <Box sx={{
//           mt: 5, p: 4, boxShadow: 5, borderRadius: 3, background: 'white', border: '1px solid #ddd',
//           transition: 'all 0.3s ease-in-out', ':hover': { boxShadow: 10, transform: 'scale(1.02)' }
//         }}>
//           <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
//             Create Your Account
//           </Typography>
//           <form onSubmit={handleSubmit} noValidate>
//             <TextField
//               fullWidth
//               label="Username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               margin="normal"
//               variant="outlined"
//               error={!!errors.username}
//               helperText={errors.username}
//               sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
//             />
//             <TextField
//               fullWidth
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               margin="normal"
//               variant="outlined"
//               error={!!errors.email}
//               helperText={errors.email}
//               sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               margin="normal"
//               variant="outlined"
//               error={!!errors.password}
//               helperText={errors.password}
//               sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
//             />
//             <FormControl fullWidth margin="normal" error={!!errors.role}>
//               <InputLabel>User Type</InputLabel>
//               <Select
//                 label="User Type"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
//               >
//                 <MenuItem value="wholesaler">Wholesaler</MenuItem>
//                 <MenuItem value="retailer">Retailer</MenuItem>
//                 <MenuItem value="farmer">Farmer</MenuItem>
//               </Select>
//               <FormHelperText>{errors.role}</FormHelperText>
//             </FormControl>

//             {formData.role && (
//               <TextField
//                 fullWidth
//                 label={formData.role === "farmer" ? "Farm Name" : "Shop Name"}
//                 name="shopOrFarmName"
//                 value={formData.shopOrFarmName}
//                 onChange={handleChange}
//                 margin="normal"
//                 variant="outlined"
//                 error={!!errors.shopOrFarmName}
//                 helperText={errors.shopOrFarmName}
//                 sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
//               />
//             )}

//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               sx={{
//                 mt: 2, width: '100%', padding: '12px', fontSize: '16px', background: '#ff7e5f', '&:hover': { background: '#feb47b' },
//                 borderRadius: 3, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', transition: 'all 0.3s ease-in-out'
//               }}
//             >
//               Register
//             </Button>
//           </form>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default UserForm;

import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    shopOrFarmName: "",
    image: null, // New field to store the image
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = formData.username ? "" : "Username is required";
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "Valid email is required";
    tempErrors.password = formData.password.length >= 6 ? "" : "Password must be at least 6 characters";
    tempErrors.role = formData.role ? "" : "User type is required";
    if (formData.role) {
      tempErrors.shopOrFarmName = formData.shopOrFarmName ? "" : formData.role === "farmer" ? "Farm Name is required" : "Shop Name is required";
    }
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const url = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
      
      const formDataToSend = new FormData(); // Create a new FormData object
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("shopOrFarmName", formData.shopOrFarmName);
      if (formData.image) {
        formDataToSend.append("image", formData.image); // Append the image if available
      }

      axios.post(`${url}/user/registeruser`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        }
      })
        .then((res) => {
          alert(res.data.msg);
          if (res.data.status === 200) {
            navigate("/login");
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
            Create Your Account
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              error={!!errors.username}
              helperText={errors.username}
              sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
            />
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
            <FormControl fullWidth margin="normal" error={!!errors.role}>
              <InputLabel>User Type</InputLabel>
              <Select
                label="User Type"
                name="role"
                value={formData.role}
                onChange={handleChange}
                sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
              >
                <MenuItem value="wholesaler">Wholesaler</MenuItem>
                <MenuItem value="retailer">Retailer</MenuItem>
                <MenuItem value="farmer">Farmer</MenuItem>
              </Select>
              <FormHelperText>{errors.role}</FormHelperText>
            </FormControl>

            {formData.role && (
              <TextField
                fullWidth
                label={formData.role === "farmer" ? "Farm Name" : "Shop Name"}
                name="shopOrFarmName"
                value={formData.shopOrFarmName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                error={!!errors.shopOrFarmName}
                helperText={errors.shopOrFarmName}
                sx={{ borderRadius: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)' }}
              />
            )}

            {/* Image Input */}
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              style={{ marginTop: '16px', width: '100%' }}
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
              Register
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default UserForm;
