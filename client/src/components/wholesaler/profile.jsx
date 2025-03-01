import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Container, Card, CardContent, Typography, Avatar, CircularProgress, Box } from "@mui/material";

export default function WholesaleProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
            </CardContent>
          </>
        )}
        {!user && <Typography variant="h6">User not found.</Typography>}
      </Card>
    </Container>
  );
}
