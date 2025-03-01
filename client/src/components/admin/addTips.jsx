import { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { 
  Container, TextField, Button, Typography, Box, Alert, Grid, 
  Card, CardContent, CardMedia, Fab, Collapse, IconButton,Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

export default function AddTips() {
  const [tip, setTip] = useState({ title: "", url: "" });
  const [tips, setTips] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/viewtips`);
      setTips(response.data);
    } catch (err) {
      console.error("Error fetching tips:", err);
    }
  };

  const handleChange = (e) => {
    setTip({ ...tip, [e.target.name]: e.target.value });
  };

  const deleteTips = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/deletetips`,{headers:{id:id}});
      setTips(tips.filter((tipItem) => tipItem._id !== id));
    } catch (err) {
      console.error("Error deleting tip:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!tip.title || !tip.text) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/addtips`, tip);
      setSuccess("Tip added successfully!");
      setTip({ title: "", text: "" });
      fetchTips();
      setShowForm(false); 
    } catch (err) {
      setError("Server error. Please try again later.",err);
    }
  };

  const navigate = useNavigate()

  // Function to check if the URL is a YouTube link and convert it to an embed URL
  // const getEmbedUrl = (url) => {
  //   const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  //   const match = url.match(youtubeRegex);
  //   return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  // };

  
  
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Floating Action Button (FAB) */}
      <Fab 
        color="primary" 
        sx={{ position: "fixed", bottom: 20, right: 20 }} 
        onClick={() => setShowForm(!showForm)}
      >
        <AddIcon />
      </Fab>

      {/* Form Appears When FAB is Clicked */}
      <Collapse in={showForm}>
        <Box sx={{ p: 3, boxShadow: 3, borderRadius: 3, bgcolor: "white", mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Add a New Tip
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField fullWidth label="Tip Title" variant="outlined" name="title" value={tip.title} onChange={handleChange} sx={{ mb: 2 }} />

          <TextField fullWidth label="Description" variant="outlined" name="text" value={tip.text} onChange={handleChange} sx={{ mb: 2 }} />

          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Submit Tip
          </Button>
        </Box>
      </Collapse>

      {/* Tips List */}
      <Typography variant="h5" sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}>
        Tips & Guidance
      </Typography>
      {/* <Button onClick={()=>navigate('/admin')}>BACK TO DASH BOARD</Button> */}
      <Grid container spacing={3}>
      {tips.length > 0 ? (
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="h6">Title</Typography></TableCell>
                  <TableCell><Typography variant="h6">Descriptions</Typography></TableCell>
                  <TableCell><Typography variant="h6">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tips.map((tipItem) => (
                  <TableRow key={tipItem._id}>
                    <TableCell>{tipItem.title}</TableCell>
                    <TableCell>{tipItem.text}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => deleteTips(tipItem._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", width: "100%" }}>
          No tips available.
        </Typography>
      )}
    </Grid>
    </Container>
  );
}
