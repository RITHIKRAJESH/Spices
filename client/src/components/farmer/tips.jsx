import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, 
  Card, CardContent, CardMedia,
  Button, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";

export default function ViewTips() {
  const [tips, setTips] = useState([]);
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [selectedTip, setSelectedTip] = useState(null); // To store the selected tip

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

  const navigate = useNavigate();

  // Handle opening the dialog with the selected tip
  const handleOpenDialog = (tip) => {
    setSelectedTip(tip);
    setOpen(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedTip(null);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}>
        Tips & Guidance
      </Typography>
      {/* <Button onClick={() => navigate('/farmer')}>BACK TO DASHBOARD</Button> */}
      <Grid container spacing={3}>
        {tips.length > 0 ? (
          tips.map((tipItem) => (
            <Grid item xs={12} sm={6} md={4} key={tipItem._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 3, cursor: "pointer" }} onClick={() => handleOpenDialog(tipItem)}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {tipItem.title}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Typography variant="body2">
                    {tipItem.text.length > 100 ? tipItem.text.substring(0, 100) + "..." : tipItem.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", width: "100%" }}>
            No tips available.
          </Typography>
        )}
      </Grid>

      {/* Dialog (Popup) for showing full tip content */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedTip?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {selectedTip?.text}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
