import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Container, Card, CardContent, Typography, Avatar, CircularProgress, Box, TextField, Button } from "@mui/material";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.payload._id;

      const url = import.meta.env.VITE_BASE_URL;

      axios
        .get(`${url}/user/profile`, { headers: { _id: userId } })
        .then((res) => {
          console.log("User Data:", res.data);
          setUser(res.data);
          setMobile(res.data.mobile || "");
          setAccountNo(res.data.accountno || "");
          setIfsc(res.data.ifsc || "");
        })
        .catch((err) => {
          console.error("Error fetching profile:", err);
        })
        .finally(() => {
          setLoading(false);
        });

    } catch (error) {
      console.error("Invalid token", error);
      setLoading(false);
    }
  }, []);

  const handleUpdate = () => {
    if (!mobile || !accountNo || !ifsc) {
      setError("All fields are required.");
      return;
    }

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.payload._id;

    const url = import.meta.env.VITE_BASE_URL;

    const updatedDetails = {
      mobile,
      accountno: accountNo,
      ifsc,
    };

    axios
      .put(`${url}/user/update`, updatedDetails,{headers:{_id:userId}})
      .then((res) => {
        alert("User details updated successfully!");
        setUser((prevUser) => ({ ...prevUser, ...updatedDetails }));
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setError("Failed to update profile. Please try again.");
      });
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ textAlign: "center", p: 3, boxShadow: 3, borderRadius: 3 }}>
        {user && (
          <>
            <Avatar sx={{ bgcolor: "primary.main", mx: "auto", width: 80, height: 80, fontSize: 32 }}>
              {user.username ? user.username[0].toUpperCase() : "U"}
            </Avatar>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                {user.shopOrFarmName}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Owner: {user.username}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Role:</strong> {user.role}
              </Typography>
              {/* Editable Fields */}
              <TextField
                label="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <TextField
                label="Account No"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              <TextField
                label="IFSC"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleUpdate}>
                Update Details
              </Button>
            </CardContent>
          </>
        )}
        {!user && <Typography variant="h6">User not found.</Typography>}
      </Card>
    </Container>
  );
}
