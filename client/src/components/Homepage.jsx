import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Box, Typography, IconButton, Card, CardContent, CardActionArea, Container,Dialog,DialogTitle,DialogContent,DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import about from '../assets/spices.avif'; // Imported image
import axios from 'axios';

export default function Homepage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [tips, setTips] = useState([]);
  const [open, setOpen] = useState(false); // State to manage the modal visibility
  const [selectedTip, setSelectedTip] = useState(null); // State to store the selected tip


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Fetch tips data from the backend
  const fetchTips = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/viewtips`);
      setTips(response.data);
      console.log(response.data); // For debugging purposes
    } catch (err) {
      console.error('Error fetching tips:', err);
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/wholesale/viewproduct`)
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    fetchTips(); // Fetch tips when the component mounts
  }, []);

  const handleClickOpen = (tip) => {
    setSelectedTip(tip); // Set the selected tip
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
    setSelectedTip(null); // Reset the selected tip
  };

  const handleNextTip = () => {
    const currentIndex = tips.indexOf(selectedTip);
    const nextIndex = (currentIndex + 1) % tips.length;
    setSelectedTip(tips[nextIndex]); // Set the next tip
  };


  return (
    <div>
      {/* Navbar */}
      <AppBar position="relative" sx={{ backgroundColor: '#f8f8f8' }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            color="black"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {['Home', 'About', 'Testimonials', 'Products', 'Register', 'Login'].map((text, index) => (
              <Button key={index} component={Link} to={`/${text.toLowerCase()}`} sx={{ color: 'black' }}>
                {text}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section with Responsive Background Image */}
      <Box
        sx={{
          textAlign: 'center',
          position: 'relative',
          height: { xs: '80vh', md: '100vh' }, // Adjust height based on screen
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://media.istockphoto.com/id/168738383/photo/spices.jpg?s=612x612&w=0&k=20&c=EHn1AqYjfKtdMBcrWVuEEs9uDErJrMBJTplVE7P3_Fw="
          alt="Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' }, // Adjust font size for mobile
            // backgroundColor: 'rgba(60, 59, 59, 0.4)', // Add some contrast for text visibility
            padding: '10px',
            borderRadius: '10px',
          }}
        >
          Welcome to FlavorFiesta
        </Typography>
      </Box>

      {/* Tips Header */}
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
          Tips for Growing Your Business
        </Typography>
      </Box>

      {/* Tips Cards */}
      <Box
        sx={{
          mt: 5,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 3,
          padding: 2,
        }}
      >
        {tips.length > 0 ? (
          tips.map((tip, index) => (
            <Card
              key={index}
              sx={{
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)', // Slight scale-up effect on hover
                  boxShadow: 3, // Shadow effect on hover
                },
              }}
              onClick={() => handleClickOpen(tip)} // Open the modal on card click
            >
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'gray', marginTop: 1 }}>
                    {tip.text.length > 100 ? `${tip.text.substring(0, 100)}...` : tip.text}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'gray' }}>
            Loading tips...
          </Typography>
        )}
      </Box>

      {/* Dialog for displaying full tip */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedTip?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            {selectedTip?.text}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleNextTip} color="primary">
            Next Tip
          </Button>
        </DialogActions>
      </Dialog>

      {/* About Section */}
      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          width: '90%',
          mx: 'auto',
          mt: 5,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: { xs: 'none', sm: '400px' }, // Adjust height for mobile
            backgroundImage: `url(${about})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 2,
            width: '100%',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 2,
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              position: 'absolute',
              top: '20%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              zIndex: 1,
            }}
          >
            About Us
          </Typography>

          {/* Overlay Text - About Us Description */}
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '85%', sm: '80%' },
              textAlign: 'justify',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              padding: { xs: 1, sm: 2 },
              borderRadius: 2,
              zIndex: 1,
            }}
          >
           FlavorFiesta is a platform that connects food lovers with local chefs and caterers. Kerala, often referred to as the "Spice Garden of India," has a rich and vibrant history deeply intertwined with the cultivation and trade of spices. The origin of spices in Kerala is deeply rooted in the region’s rich natural heritage and ancient history. Kerala, often referred to as the "Spice Garden of India," has been a center of spice cultivation for over two millennia. The region's tropical climate, fertile soil, and monsoon rains provide the perfect environment for growing a diverse array of spices, including black pepper, cardamom, cloves, cinnamon, and nutmeg. Historically, Kerala's spices were highly prized and traded extensively, with the region becoming a key player in the ancient spice trade routes. The earliest records suggest that Kerala’s spices were sought after by ancient civilizations such as the Egyptians, Greeks, and Romans. Over centuries, the spice trade attracted traders from across the world, including Arabs, Portuguese, Dutch, and British, all of whom contributed to the region's rich cultural and economic development. Today, Kerala continues to be one of the largest producers of spices globally, preserving its legacy as a hub of spice cultivation and trade.
          </Typography>
        </Box>
      </Box>

      {/* Marquee Section for Products */}
      <Box sx={{ mt: 5, overflow: 'hidden', position: 'relative' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
          Our Product Spices
        </Typography>

        <Box
          sx={{
            display: 'flex',
            animation: 'scroll 15s linear infinite', // Animation for scrolling effect
            overflow: 'hidden',
            gap: 2,
            p: 2,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {products.map((product, index) => (
            <Box
              key={index}
              sx={{
                width: 250,
                height: 250,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ddd',
                borderRadius: 2,
                boxShadow: 2,
                padding: 1,
                backgroundColor: 'white',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <img
                src={product.productImage}
                alt={product.productName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              <Typography variant="body2" sx={{ fontSize: '0.9rem', mt: 1 }}>
                {product.productName}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Footer */}
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} FlavorFiesta. All Rights Reserved.
          </Typography>
        </Box>
   
    </div>
  );
}
